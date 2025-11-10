const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');
const { Calendar, User } = require('../models');
const { protect, authorize } = require('../middleware/auth');
const { uploadCalendarAttachments, handleUploadError, getFileInfo } = require('../middleware/upload');
const { logAction } = require('../middleware/audit');

const router = express.Router();

/**
 * Check for calendar event conflicts (Objective 2.3: Reduce scheduling conflicts)
 * @param {Date} eventDate - Event date
 * @param {Date} endDate - End date (optional)
 * @param {String} department - Department
 * @param {Number} excludeId - Event ID to exclude from conflict check
 * @returns {Promise<Array>} Array of conflicting events
 */
async function checkEventConflicts(eventDate, endDate, department, excludeId = null) {
  const whereClause = {
    department: department,
    status: 'scheduled',
    [Op.or]: []
  };

  if (excludeId) {
    whereClause.id = { [Op.ne]: excludeId };
  }

  // Check for overlapping events
  if (endDate) {
    // Event has end date - check if it overlaps with existing events
    whereClause[Op.or].push(
      {
        // Existing event starts before new event ends and ends after new event starts
        event_date: {
          [Op.lte]: endDate
        },
        end_date: {
          [Op.gte]: eventDate
        }
      },
      {
        // Existing event has no end date but starts within new event range
        event_date: {
          [Op.between]: [eventDate, endDate]
        },
        end_date: null
      }
    );
  } else {
    // Event has no end date - check if any event overlaps
    whereClause[Op.or].push(
      {
        // Existing event starts on the same date
        event_date: eventDate
      },
      {
        // Existing event spans the new event date
        event_date: {
          [Op.lte]: eventDate
        },
        end_date: {
          [Op.gte]: eventDate
        }
      }
    );
  }

  return await Calendar.findAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: 'organizer',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ]
  });
}

// @desc    Get all calendar events
// @route   GET /api/calendar
// @access  Private
router.get('/', protect, [
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  query('department').optional().trim(),
  query('eventType').optional().isIn(['thesis_submission', 'thesis_defense', 'title_defense', 'meeting', 'deadline', 'other']),
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
    const offset = (page - 1) * limit;

    // Build where clause
    const where = {};

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      where.event_date = {};
      if (req.query.startDate) {
        where.event_date[Op.gte] = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        where.event_date[Op.lte] = new Date(req.query.endDate);
      }
    }

    // Department filter
    if (req.query.department) {
      where.department = req.query.department;
    }

    // Event type filter
    if (req.query.eventType) {
      where.event_type = req.query.eventType;
    }

    // If user is not admin, only show events from their department or public events
    if (req.user.role !== 'admin') {
      where[Op.or] = [
        { department: req.user.department },
        { is_public: true }
      ];
    }

    // Get events with pagination
    const { count, rows: events } = await Calendar.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['event_date', 'ASC']],
      limit,
      offset
    });

    res.json({
      success: true,
      count: events.length,
      total: count,
      page,
      pages: Math.ceil(count / limit),
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
    const event = await Calendar.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user can view this event
    if (req.user.role !== 'admin' && 
        event.department !== req.user.department && 
        !event.is_public) {
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
  body('event_date').isISO8601().withMessage('Event date is required and must be valid'),
  body('end_date').optional().isISO8601().withMessage('End date must be valid'),
  body('location').optional().trim(),
  body('event_type').isIn(['thesis_submission', 'thesis_defense', 'title_defense', 'meeting', 'deadline', 'other']).withMessage('Invalid event type'),
  body('department').trim().notEmpty().withMessage('Department is required')
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
      event_date,
      end_date,
      location,
      event_type,
      department,
      thesis_id,
      is_public,
      attendees
    } = req.body;

    // Check for conflicts (Objective 2.3: Reduce scheduling conflicts)
    const conflicts = await checkEventConflicts(
      new Date(event_date),
      end_date ? new Date(end_date) : null,
      department
    );

    // Create event
    const event = await Calendar.create({
      title,
      description,
      event_date: new Date(event_date),
      end_date: end_date ? new Date(end_date) : null,
      location,
      event_type: event_type || 'other',
      department,
      thesis_id: thesis_id || null,
      organizer_id: req.user.id,
      attendees: attendees || [],
      is_public: is_public !== undefined ? is_public : true,
      status: 'scheduled'
    });

    // Reload with associations
    await event.reload({
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    // Log event creation (Objective 5.5: Audit logging)
    await logAction({
      userId: req.user.id,
      action: 'calendar.create',
      resourceType: 'calendar',
      resourceId: event.id,
      description: `Created calendar event: ${event.title}`,
      status: 'success',
      metadata: {
        conflicts: conflicts.length,
        hasConflicts: conflicts.length > 0
      },
      req
    });

    res.status(201).json({
      success: true,
      message: conflicts.length > 0 
        ? `Event created successfully. Warning: ${conflicts.length} conflicting event(s) found.`
        : 'Event created successfully',
      data: event,
      conflicts: conflicts.length > 0 ? conflicts.map(c => ({
        id: c.id,
        title: c.title,
        event_date: c.event_date,
        organizer: c.organizer
      })) : []
    });
  } catch (error) {
    console.error('Create calendar event error:', error);
    
    // Log creation failure
    await logAction({
      userId: req.user?.id,
      action: 'calendar.create',
      resourceType: 'calendar',
      description: `Failed to create calendar event: ${req.body.title}`,
      status: 'failure',
      errorMessage: error.message,
      req
    });

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
  body('event_date').optional().isISO8601().withMessage('Event date must be valid'),
  body('end_date').optional().isISO8601().withMessage('End date must be valid'),
  body('status').optional().isIn(['scheduled', 'in_progress', 'completed', 'cancelled'])
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

    const event = await Calendar.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user can update this event
    if (event.organizer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    // Check for conflicts if date is being changed (Objective 2.3: Reduce scheduling conflicts)
    let conflicts = [];
    if (req.body.event_date || req.body.end_date) {
      const eventDate = req.body.event_date ? new Date(req.body.event_date) : event.event_date;
      const endDate = req.body.end_date ? new Date(req.body.end_date) : event.end_date;
      conflicts = await checkEventConflicts(eventDate, endDate, event.department, event.id);
    }

    // Update event
    const updateData = {};
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.event_date) updateData.event_date = new Date(req.body.event_date);
    if (req.body.end_date !== undefined) updateData.end_date = req.body.end_date ? new Date(req.body.end_date) : null;
    if (req.body.location !== undefined) updateData.location = req.body.location;
    if (req.body.event_type) updateData.event_type = req.body.event_type;
    if (req.body.status) updateData.status = req.body.status;
    if (req.body.is_public !== undefined) updateData.is_public = req.body.is_public;

    await event.update(updateData);

    // Reload with associations
    await event.reload({
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    // Log event update
    await logAction({
      userId: req.user.id,
      action: 'calendar.update',
      resourceType: 'calendar',
      resourceId: event.id,
      description: `Updated calendar event: ${event.title}`,
      status: 'success',
      metadata: {
        conflicts: conflicts.length,
        hasConflicts: conflicts.length > 0
      },
      req
    });

    res.json({
      success: true,
      message: conflicts.length > 0 
        ? `Event updated successfully. Warning: ${conflicts.length} conflicting event(s) found.`
        : 'Event updated successfully',
      data: event,
      conflicts: conflicts.length > 0 ? conflicts.map(c => ({
        id: c.id,
        title: c.title,
        event_date: c.event_date,
        organizer: c.organizer
      })) : []
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
    const event = await Calendar.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user can delete this event
    if (event.organizer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    const eventTitle = event.title;
    await event.destroy();

    // Log event deletion
    await logAction({
      userId: req.user.id,
      action: 'calendar.delete',
      resourceType: 'calendar',
      resourceId: req.params.id,
      description: `Deleted calendar event: ${eventTitle}`,
      status: 'success',
      req
    });

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

module.exports = router;
