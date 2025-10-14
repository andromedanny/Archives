const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const Thesis = require('../models/Thesis');
const Calendar = require('../models/Calendar');
const Department = require('../models/Department');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin role
router.use(protect);
router.use(authorize('admin'));

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalFaculty,
      totalTheses,
      publishedTheses,
      pendingTheses,
      totalEvents,
      upcomingEvents,
      departments
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'student', isActive: true }),
      User.countDocuments({ role: { $in: ['faculty', 'adviser'] }, isActive: true }),
      Thesis.countDocuments(),
      Thesis.countDocuments({ status: 'Published' }),
      Thesis.countDocuments({ status: { $in: ['Draft', 'Under Review'] } }),
      Calendar.countDocuments(),
      Calendar.countDocuments({ 
        startDate: { $gte: new Date() },
        status: { $in: ['Scheduled', 'In Progress'] }
      }),
      Department.find({ isActive: true }).select('name code statistics')
    ]);

    // Get recent activities
    const recentTheses = await Thesis.find()
      .populate('authors', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find({ isActive: true })
      .select('firstName lastName email role department createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const upcomingCalendarEvents = await Calendar.find({
      startDate: { $gte: new Date() },
      status: { $in: ['Scheduled', 'In Progress'] }
    })
    .populate('createdBy', 'firstName lastName')
    .sort({ startDate: 1 })
    .limit(5);

    res.json({
      success: true,
      data: {
        statistics: {
          totalUsers,
          totalStudents,
          totalFaculty,
          totalTheses,
          publishedTheses,
          pendingTheses,
          totalEvents,
          upcomingEvents,
          departments: departments.length
        },
        departments,
        recentActivities: {
          theses: recentTheses,
          users: recentUsers,
          events: upcomingCalendarEvents
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
router.get('/analytics', [
  query('period').optional().isIn(['7d', '30d', '90d', '1y']).withMessage('Invalid period')
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

    const period = req.query.period || '30d';
    const days = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    }[period];

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // User registrations over time
    const userRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Thesis submissions over time
    const thesisSubmissions = await Thesis.aggregate([
      {
        $match: {
          submittedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$submittedAt' },
            month: { $month: '$submittedAt' },
            day: { $dayOfMonth: '$submittedAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Department statistics
    const departmentStats = await Thesis.aggregate([
      {
        $group: {
          _id: '$department',
          totalTheses: { $sum: 1 },
          publishedTheses: {
            $sum: { $cond: [{ $eq: ['$status', 'Published'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { totalTheses: -1 }
      }
    ]);

    // Most downloaded theses
    const topDownloads = await Thesis.find({ status: 'Published' })
      .populate('authors', 'firstName lastName')
      .sort({ downloadCount: -1 })
      .limit(10)
      .select('title authors downloadCount viewCount');

    // Most viewed theses
    const topViews = await Thesis.find({ status: 'Published' })
      .populate('authors', 'firstName lastName')
      .sort({ viewCount: -1 })
      .limit(10)
      .select('title authors downloadCount viewCount');

    res.json({
      success: true,
      data: {
        period,
        userRegistrations,
        thesisSubmissions,
        departmentStats,
        topDownloads,
        topViews
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Review thesis
// @route   PUT /api/admin/thesis/:id/review
// @access  Private (Admin)
router.put('/thesis/:id/review', [
  body('status').isIn(['Approved', 'Rejected']).withMessage('Status must be Approved or Rejected'),
  body('comments').optional().trim(),
  body('score').optional().isInt({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100')
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

    const thesis = await Thesis.findById(req.params.id);

    if (!thesis) {
      return res.status(404).json({
        success: false,
        message: 'Thesis not found'
      });
    }

    const { status, comments, score } = req.body;

    // Update thesis review
    thesis.status = status;
    thesis.review = {
      reviewer: req.user.id,
      comments,
      score,
      reviewedAt: new Date()
    };

    if (status === 'Approved') {
      thesis.isPublic = true;
      thesis.publishedAt = new Date();
    }

    await thesis.save();

    // Populate the updated thesis
    await thesis.populate([
      { path: 'authors', select: 'firstName lastName email' },
      { path: 'adviser', select: 'firstName lastName email' },
      { path: 'review.reviewer', select: 'firstName lastName' }
    ]);

    res.json({
      success: true,
      message: `Thesis ${status.toLowerCase()} successfully`,
      data: thesis
    });
  } catch (error) {
    console.error('Review thesis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get pending theses for review
// @route   GET /api/admin/thesis/pending
// @access  Private (Admin)
router.get('/thesis/pending', [
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

    const theses = await Thesis.find({ status: 'Under Review' })
      .populate('authors', 'firstName lastName email')
      .populate('adviser', 'firstName lastName email')
      .sort({ submittedAt: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Thesis.countDocuments({ status: 'Under Review' });

    res.json({
      success: true,
      count: theses.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: theses
    });
  } catch (error) {
    console.error('Get pending theses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create department
// @route   POST /api/admin/departments
// @access  Private (Admin)
router.post('/departments', [
  body('name').trim().notEmpty().withMessage('Department name is required'),
  body('code').trim().notEmpty().withMessage('Department code is required'),
  body('description').optional().trim(),
  body('head').optional().isMongoId().withMessage('Valid head ID is required'),
  body('programs').optional().isArray().withMessage('Programs must be an array'),
  body('contactInfo.email').optional().isEmail().withMessage('Valid email is required'),
  body('contactInfo.phone').optional().matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Valid phone number is required')
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

    const department = await Department.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department
    });
  } catch (error) {
    console.error('Create department error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Department with this name or code already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all departments
// @route   GET /api/admin/departments
// @access  Private (Admin)
router.get('/departments', async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('head', 'firstName lastName email')
      .sort({ name: 1 });

    res.json({
      success: true,
      count: departments.length,
      data: departments
    });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update department
// @route   PUT /api/admin/departments/:id
// @access  Private (Admin)
router.put('/departments/:id', [
  body('name').optional().trim().notEmpty().withMessage('Department name cannot be empty'),
  body('code').optional().trim().notEmpty().withMessage('Department code cannot be empty'),
  body('isActive').optional().isBoolean()
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

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('head', 'firstName lastName email');

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    res.json({
      success: true,
      message: 'Department updated successfully',
      data: department
    });
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete department
// @route   DELETE /api/admin/departments/:id
// @access  Private (Admin)
router.delete('/departments/:id', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Check if department has users
    const userCount = await User.countDocuments({ department: department.name });
    if (userCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete department with existing users'
      });
    }

    await Department.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Department deleted successfully'
    });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Bulk operations
// @route   POST /api/admin/bulk
// @access  Private (Admin)
router.post('/bulk', [
  body('operation').isIn(['activateUsers', 'deactivateUsers', 'deleteUsers', 'publishTheses', 'unpublishTheses']).withMessage('Invalid operation'),
  body('ids').isArray().withMessage('IDs must be an array'),
  body('ids.*').isMongoId().withMessage('Invalid ID format')
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

    const { operation, ids } = req.body;
    let result;

    switch (operation) {
      case 'activateUsers':
        result = await User.updateMany(
          { _id: { $in: ids } },
          { isActive: true }
        );
        break;
      case 'deactivateUsers':
        result = await User.updateMany(
          { _id: { $in: ids } },
          { isActive: false }
        );
        break;
      case 'deleteUsers':
        result = await User.deleteMany({ _id: { $in: ids } });
        break;
      case 'publishTheses':
        result = await Thesis.updateMany(
          { _id: { $in: ids } },
          { 
            status: 'Published',
            isPublic: true,
            publishedAt: new Date()
          }
        );
        break;
      case 'unpublishTheses':
        result = await Thesis.updateMany(
          { _id: { $in: ids } },
          { 
            status: 'Draft',
            isPublic: false,
            publishedAt: null
          }
        );
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid operation'
        });
    }

    res.json({
      success: true,
      message: `Bulk operation ${operation} completed successfully`,
      data: {
        operation,
        affectedCount: result.modifiedCount || result.deletedCount || 0
      }
    });
  } catch (error) {
    console.error('Bulk operation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
