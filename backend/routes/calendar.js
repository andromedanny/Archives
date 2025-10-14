const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Calendar = require('../models/Calendar');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { uploadCalendarAttachments, handleUploadError, getFileInfo } = require('../middleware/upload');

const router = express.Router();

// @desc    Get all calendar events
// @route   GET /api/calendar
// @access  Private
router.get('/', protect, [
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  query('department').optional().trim(),
  query('eventType').optional().isIn(['Thesis Defense', 'Submission Deadline', 'Review Meeting', 'Workshop', 'Conference', 'Other']),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};

    // Date range filter
    if (req.query.startDate && req.query.endDate) {
      query.startDate = { $gte: new Date(req.query.startDate) };
      query.endDate = { $lte: new Date(req.query.endDate) };
    } else if (req.query.startDate) {
      query.startDate = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      query.endDate = { $lte: new Date(req.query.endDate) };
    }

    // Department filter
    if (req.query.department) {
      query.department = req.query.department;
    }

    // Event type filter
    if (req.query.eventType) {
      query.eventType = req.query.eventType;
    }

    // If user is not admin, only show events from their department or events they're attending
    if (req.user.role !== 'admin') {
      query.$or = [
        { department: req.user.department },
        { 'attendees.user': req.user.id },
        { createdBy: req.user.id }
      ];
    }

    const events = await Calendar.find(query)
      .populate('createdBy', 'firstName lastName email')
      .populate('attendees.user', 'firstName lastName email')
      .sort({ startDate: 1, startTime: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Calendar.countDocuments(query);

    res.json({
      success: true,
      count: events.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: events
    });
  } catch (error) {
    console.error('Get calendar events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get upcoming events
// @route   GET /api/calendar/upcoming
// @access  Private
router.get('/upcoming', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const department = req.user.role === 'admin' ? req.query.department : req.user.department;

    const events = await Calendar.getUpcomingEvents(limit, department);

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single calendar event
// @route   GET /api/calendar/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const event = await Calendar.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email')
      .populate('attendees.user', 'firstName lastName email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user can view this event
    if (req.user.role !== 'admin' && 
        event.department !== req.user.department && 
        !event.attendees.some(attendee => attendee.user._id.toString() === req.user.id) &&
        event.createdBy._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get calendar event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new calendar event
// @route   POST /api/calendar
// @access  Private (Faculty, Admin, Adviser)
router.post('/', protect, authorize('faculty', 'admin', 'adviser'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('startDate').isISO8601().withMessage('Start date is required and must be valid'),
  body('endDate').isISO8601().withMessage('End date is required and must be valid'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Start time must be in HH:MM format'),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('End time must be in HH:MM format'),
  body('location').optional().trim(),
  body('eventType').isIn(['Thesis Defense', 'Submission Deadline', 'Review Meeting', 'Workshop', 'Conference', 'Other']).withMessage('Invalid event type'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']),
  body('isAllDay').optional().isBoolean(),
  body('attendees').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      location,
      eventType,
      department,
      priority,
      isAllDay,
      attendees,
      notes
    } = req.body;

    // Validate attendees if provided
    if (attendees && attendees.length > 0) {
      const attendeeIds = attendees.map(attendee => attendee.user);
      const validUsers = await User.find({ _id: { $in: attendeeIds } });
      
      if (validUsers.length !== attendeeIds.length) {
        return res.status(400).json({
          success: false,
          message: 'Some attendees are invalid'
        });
      }
    }

    // Create event
    const event = await Calendar.create({
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startTime,
      endTime,
      location,
      eventType,
      department,
      priority: priority || 'Medium',
      isAllDay: isAllDay || false,
      attendees: attendees || [],
      notes,
      createdBy: req.user.id
    });

    // Populate the created event
    await event.populate([
      { path: 'createdBy', select: 'firstName lastName email' },
      { path: 'attendees.user', select: 'firstName lastName email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Create calendar event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update calendar event
// @route   PUT /api/calendar/:id
// @access  Private (Event creator, Admin)
router.put('/:id', protect, [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('startDate').optional().isISO8601().withMessage('Start date must be valid'),
  body('endDate').optional().isISO8601().withMessage('End date must be valid'),
  body('startTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Start time must be in HH:MM format'),
  body('endTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('End time must be in HH:MM format'),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']),
  body('status').optional().isIn(['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Postponed'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const event = await Calendar.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user can update this event
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    const updateData = {};
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.startDate) updateData.startDate = new Date(req.body.startDate);
    if (req.body.endDate) updateData.endDate = new Date(req.body.endDate);
    if (req.body.startTime) updateData.startTime = req.body.startTime;
    if (req.body.endTime) updateData.endTime = req.body.endTime;
    if (req.body.location !== undefined) updateData.location = req.body.location;
    if (req.body.priority) updateData.priority = req.body.priority;
    if (req.body.status) updateData.status = req.body.status;
    if (req.body.notes !== undefined) updateData.notes = req.body.notes;

    const updatedEvent = await Calendar.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'createdBy', select: 'firstName lastName email' },
      { path: 'attendees.user', select: 'firstName lastName email' }
    ]);

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    console.error('Update calendar event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete calendar event
// @route   DELETE /api/calendar/:id
// @access  Private (Event creator, Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Calendar.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user can delete this event
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    await Calendar.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete calendar event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Respond to event invitation
// @route   PUT /api/calendar/:id/respond
// @access  Private
router.put('/:id/respond', protect, [
  body('status').isIn(['Accepted', 'Declined']).withMessage('Status must be Accepted or Declined')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const event = await Calendar.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Find user in attendees
    const attendeeIndex = event.attendees.findIndex(
      attendee => attendee.user.toString() === req.user.id
    );

    if (attendeeIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You are not invited to this event'
      });
    }

    // Update attendee status
    event.attendees[attendeeIndex].status = req.body.status;
    await event.save();

    res.json({
      success: true,
      message: `Event response updated to ${req.body.status}`,
      data: event.attendees[attendeeIndex]
    });
  } catch (error) {
    console.error('Respond to event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Upload event attachments
// @route   POST /api/calendar/:id/attachments
// @access  Private (Event creator, Admin)
router.post('/:id/attachments', protect, uploadCalendarAttachments, handleUploadError, async (req, res) => {
  try {
    const event = await Calendar.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user can upload attachments
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload attachments for this event'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Add attachments
    const attachments = req.files.map(file => getFileInfo(file));
    event.attachments.push(...attachments);
    await event.save();

    res.json({
      success: true,
      message: 'Attachments uploaded successfully',
      data: attachments
    });
  } catch (error) {
    console.error('Upload event attachments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
