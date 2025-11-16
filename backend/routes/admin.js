const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');
const { User, Thesis, Calendar, Department, AuditLog } = require('../models');
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
    const { Op } = require('sequelize');
    
    // Get statistics
    const [
      totalTheses,
      totalUsers,
      totalDepartments,
      recentSubmissions
    ] = await Promise.all([
      Thesis.count(),
      User.count({ where: { is_active: true } }),
      Department.count({ where: { is_active: true } }),
      Thesis.count({
        where: {
          submitted_at: {
            [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    // Get recent activity
    const [recentTheses, recentUsers] = await Promise.all([
      Thesis.findAll({
        where: {
          submitted_at: {
            [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        },
        include: [{
          model: User,
          as: 'adviser',
          attributes: ['firstName', 'lastName']
        }],
        order: [['submitted_at', 'DESC']],
        limit: 10
      }),
      User.findAll({
        where: {
          createdAt: {
            [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        },
        order: [['createdAt', 'DESC']],
        limit: 5
      })
    ]);

    const recentActivity = [
      ...recentTheses.map(thesis => ({
        id: thesis.id,
        type: 'thesis',
        title: `New thesis submitted: "${thesis.title}"`,
        date: thesis.submitted_at || thesis.createdAt,
        author: thesis.adviser ? `${thesis.adviser.firstName} ${thesis.adviser.lastName}` : 'Unknown'
      })),
      ...recentUsers.map(user => ({
        id: user.id,
        type: 'user',
        title: `New user registered: ${user.firstName} ${user.lastName}`,
        date: user.createdAt,
        role: user.role
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

    // Get recent theses
    const recentThesesList = await Thesis.findAll({
      include: [{
        model: User,
        as: 'adviser',
        attributes: ['firstName', 'lastName']
      }],
      order: [['submitted_at', 'DESC']],
      limit: 5,
      attributes: ['id', 'title', 'status', 'submitted_at', 'view_count', 'download_count']
    });

    // Get upcoming events
    const upcomingEvents = await Calendar.findAll({
      where: {
        event_date: {
          [Op.gte]: new Date()
        }
      },
      order: [['event_date', 'ASC']],
      limit: 3
    });

    // Get pending reviews
    const pendingReviews = await Thesis.findAll({
      where: { status: 'Under Review' },
      include: [{
        model: User,
        as: 'adviser',
        attributes: ['firstName', 'lastName']
      }],
      order: [['submitted_at', 'DESC']],
      limit: 3,
      attributes: ['id', 'title', 'status', 'submitted_at']
    });

    res.json({
      success: true,
      stats: {
        totalTheses,
        totalUsers,
        totalDepartments,
        recentSubmissions
      },
      recentActivity,
      recentTheses: recentThesesList.map(t => ({
        id: t.id,
        title: t.title,
        author: t.adviser ? `${t.adviser.firstName} ${t.adviser.lastName}` : 'Unknown',
        status: t.status,
        submittedAt: t.submitted_at || t.createdAt
      })),
      upcomingEvents: upcomingEvents.map(e => ({
        id: e.id,
        title: e.title,
        date: e.event_date,
        eventDate: e.event_date,
        location: e.location
      })),
      pendingReviews: pendingReviews.map(t => ({
        id: t.id,
        title: t.title,
        author: t.adviser ? `${t.adviser.firstName} ${t.adviser.lastName}` : 'Unknown',
        submittedAt: t.submitted_at || t.createdAt
      }))
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

    // Get all departments
    const departments = await Department.findAll({
      where: { is_active: true },
      attributes: ['id', 'name']
    });

    // Get department statistics with user and thesis counts
    const departmentStats = await Promise.all(
      departments.map(async (dept) => {
        const [totalUsers, totalTheses] = await Promise.all([
          User.count({
            where: {
              department: dept.name,
              is_active: true
            }
          }),
          Thesis.count({
            where: {
              department: dept.name
            }
          })
        ]);

        return {
          department: dept.name,
          totalUsers,
          totalTheses
        };
      })
    );

    // Sort by total theses descending
    departmentStats.sort((a, b) => b.totalTheses - a.totalTheses);

    // Get overall statistics
    const [totalTheses, totalUsers] = await Promise.all([
      Thesis.count(),
      User.count({ where: { is_active: true } })
    ]);

    res.json({
      success: true,
      data: {
        totalTheses,
        totalUsers,
        departmentStats
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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

// @desc    Get all theses (admin only - includes all statuses)
// @route   GET /api/admin/thesis
// @access  Private (Admin)
router.get('/thesis', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional().isIn(['Draft', 'Under Review', 'Approved', 'Published', 'Rejected'])
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

    const { Op } = require('sequelize');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.status) {
      where.status = req.query.status;
    }

    const { count, rows: theses } = await Thesis.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'authors',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'adviser',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          required: false
        }
      ],
      order: [['submitted_at', 'DESC']],
      limit,
      offset,
      distinct: true
    });

    res.json({
      success: true,
      count: theses.length,
      total: count,
      page,
      pages: Math.ceil(count / limit),
      data: theses
    });
  } catch (error) {
    console.error('Get admin theses error:', error);
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

    const { Op } = require('sequelize');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows: theses } = await Thesis.findAndCountAll({
      where: { status: 'Under Review' },
      include: [
        {
          model: User,
          as: 'authors',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'adviser',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          required: false
        }
      ],
      order: [['submitted_at', 'ASC']],
      limit,
      offset,
      distinct: true
    });

    res.json({
      success: true,
      count: theses.length,
      total: count,
      page,
      pages: Math.ceil(count / limit),
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
  body('head_id').optional().isInt().withMessage('Valid head ID is required'),
  body('contact_info').optional().isObject().withMessage('Contact info must be an object')
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

    const department = await Department.create({
      name: req.body.name,
      code: req.body.code,
      description: req.body.description || null,
      head_id: req.body.head_id || null,
      contact_info: req.body.contact_info || {},
      is_active: req.body.is_active !== undefined ? req.body.is_active : true
    });

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department
    });
  } catch (error) {
    console.error('Create department error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
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
    const { Course } = require('../models');
    const { Op } = require('sequelize');
    
    const departments = await Department.findAll({
      include: [{
        model: Course,
        as: 'courses',
        attributes: ['id', 'name', 'code', 'level', 'is_active']
      }],
      order: [['name', 'ASC']]
    });

    // Get student counts for each department
    const departmentsWithCounts = await Promise.all(
      departments.map(async (dept) => {
        const studentCount = await User.count({
          where: {
            department: dept.name,
            role: 'student',
            is_active: true
          }
        });

        const thesisCount = await Thesis.count({
          where: {
            department: dept.name
          }
        });

        return {
          ...dept.toJSON(),
          studentCount,
          student_count: studentCount,
          thesisCount,
          thesis_count: thesisCount
        };
      })
    );

    res.json({
      success: true,
      count: departmentsWithCounts.length,
      data: departmentsWithCounts
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
  body('is_active').optional().isBoolean()
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

    const department = await Department.findByPk(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    await department.update({
      name: req.body.name !== undefined ? req.body.name : department.name,
      code: req.body.code !== undefined ? req.body.code : department.code,
      description: req.body.description !== undefined ? req.body.description : department.description,
      head_id: req.body.head_id !== undefined ? req.body.head_id : department.head_id,
      contact_info: req.body.contact_info || department.contact_info,
      is_active: req.body.is_active !== undefined ? req.body.is_active : department.is_active
    });

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
    const { Op } = require('sequelize');
    const { Course } = require('../models');
    
    const department = await Department.findByPk(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Check if department has users
    const userCount = await User.count({ 
      where: { 
        department: department.name,
        is_active: true
      } 
    });
    
    // Check if department has courses
    const courseCount = await Course.count({
      where: {
        department_id: department.id,
        is_active: true
      }
    });
    
    if (userCount > 0 || courseCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete department with ${userCount} user(s) and ${courseCount} course(s)`
      });
    }

    await department.destroy();

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

// @desc    Get audit logs
// @route   GET /api/admin/audit-logs
// @access  Private (Admin)
// Objective 5.5: Comprehensive audit logging for accountability
router.get('/audit-logs', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('action').optional().trim(),
  query('resourceType').optional().trim(),
  query('userId').optional().isInt().withMessage('User ID must be an integer'),
  query('status').optional().isIn(['success', 'failure', 'pending']),
  query('dateFrom').optional().isISO8601().withMessage('Date from must be a valid date'),
  query('dateTo').optional().isISO8601().withMessage('Date to must be a valid date')
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
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    // Build where clause
    const where = {};
    
    if (req.query.action) {
      where.action = { [Op.like]: `%${req.query.action}%` };
    }
    
    if (req.query.resourceType) {
      where.resource_type = req.query.resourceType;
    }
    
    if (req.query.userId) {
      where.user_id = req.query.userId;
    }
    
    if (req.query.status) {
      where.status = req.query.status;
    }
    
    if (req.query.dateFrom || req.query.dateTo) {
      where.created_at = {};
      if (req.query.dateFrom) {
        where.created_at[Op.gte] = new Date(req.query.dateFrom);
      }
      if (req.query.dateTo) {
        where.created_at[Op.lte] = new Date(req.query.dateTo);
      }
    }

    // Get audit logs with pagination
    const { count, rows: logs } = await AuditLog.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          required: false
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    res.json({
      success: true,
      count: logs.length,
      total: count,
      page,
      pages: Math.ceil(count / limit),
      data: logs
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
