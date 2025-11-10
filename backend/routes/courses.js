const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');
const { Course, Department } = require('../models');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All course routes require authentication
router.use(protect);

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('departmentId').optional().isInt().withMessage('Department ID must be a valid integer'),
  query('level').optional().isIn(['Undergraduate', 'Graduate', 'Doctoral']),
  query('search').optional().trim()
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

    // Department filter
    if (req.query.departmentId) {
      where.department_id = parseInt(req.query.departmentId);
    }

    // Level filter
    if (req.query.level) {
      where.level = req.query.level;
    }

    // Search functionality
    if (req.query.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${req.query.search}%` } },
        { code: { [Op.like]: `%${req.query.search}%` } },
        { description: { [Op.like]: `%${req.query.search}%` } }
      ];
    }

    // Non-admin users can only see active courses
    if (req.user.role !== 'admin') {
      where.is_active = true;
    }

    const { count, rows: courses } = await Course.findAndCountAll({
      where,
      include: [
        {
          model: Department,
          as: 'department',
          required: false,
          attributes: ['id', 'name', 'code']
        }
      ],
      order: [['name', 'ASC']],
      limit,
      offset,
      distinct: true
    });

    res.json({
      success: true,
      count: courses.length,
      total: count,
      page,
      pages: Math.ceil(count / limit),
      data: courses
    });
  } catch (error) {
    console.error('Get courses error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code', 'description']
        }
      ]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Non-admin users can only see active courses
    if (!course.is_active && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Course not available'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create course - ALL ROLES CAN CREATE (Admin, Faculty)
// @route   POST /api/courses
// @access  Private (Admin, Faculty, Prof)
router.post('/', authorize('admin', 'faculty', 'prof'), [
  body('name').trim().notEmpty().withMessage('Course name is required'),
  body('code').trim().notEmpty().withMessage('Course code is required'),
  body('departmentId').isInt().withMessage('Valid department ID is required'),
  body('level').isIn(['Undergraduate', 'Graduate', 'Doctoral']).withMessage('Invalid level'),
  body('description').optional().trim(),
  body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('credits').optional().isInt({ min: 1 }).withMessage('Credits must be a positive integer')
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

    // Verify department exists
    const department = await Department.findByPk(req.body.departmentId);
    if (!department) {
      return res.status(400).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Check if course code already exists in this department
    const existingCourse = await Course.findOne({
      where: {
        code: req.body.code,
        departmentId: req.body.departmentId
      }
    });

    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: 'Course with this code already exists in this department'
      });
    }

    const course = await Course.create({
      name: req.body.name,
      code: req.body.code,
      departmentId: req.body.departmentId,
      level: req.body.level,
      description: req.body.description || null,
      duration: req.body.duration || null,
      credits: req.body.credits || null,
      is_active: true
    });

    // Reload with department
    await course.reload({
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update course - ALL ROLES CAN UPDATE (Admin, Faculty)
// @route   PUT /api/courses/:id
// @access  Private (Admin, Faculty, Prof)
router.put('/:id', authorize('admin', 'faculty', 'prof'), [
  body('name').optional().trim().notEmpty().withMessage('Course name cannot be empty'),
  body('code').optional().trim().notEmpty().withMessage('Course code cannot be empty'),
  body('level').optional().isIn(['Undergraduate', 'Graduate', 'Doctoral']),
  body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('credits').optional().isInt({ min: 1 }).withMessage('Credits must be a positive integer'),
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

    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if course code already exists in this department (if code is being updated)
    if (req.body.code && req.body.code !== course.code) {
      const existingCourse = await Course.findOne({
        where: {
          code: req.body.code,
          departmentId: course.departmentId,
          id: { [Op.ne]: course.id }
        }
      });

      if (existingCourse) {
        return res.status(400).json({
          success: false,
          message: 'Course with this code already exists in this department'
        });
      }
    }

    const updateData = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.code) updateData.code = req.body.code;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.level) updateData.level = req.body.level;
    if (req.body.duration !== undefined) updateData.duration = req.body.duration;
    if (req.body.credits !== undefined) updateData.credits = req.body.credits;

    // Only admin can change active status
    if (req.body.is_active !== undefined && req.user.role === 'admin') {
      updateData.is_active = req.body.is_active;
    }

    await course.update(updateData);

    // Reload with department
    await course.reload({
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete course - ALL ROLES CAN DELETE (Admin, Faculty)
// @route   DELETE /api/courses/:id
// @access  Private (Admin, Faculty, Prof)
router.delete('/:id', authorize('admin', 'faculty', 'prof'), async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Only admin can permanently delete
    if (req.user.role !== 'admin') {
      // Non-admin users can only deactivate
      course.is_active = false;
      await course.save();
      return res.json({
        success: true,
        message: 'Course deactivated successfully',
        data: course
      });
    }

    await course.destroy();

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get courses by department
// @route   GET /api/courses/department/:departmentId
// @access  Private
router.get('/department/:departmentId', async (req, res) => {
  try {
    const where = {
      departmentId: parseInt(req.params.departmentId)
    };

    // Non-admin users can only see active courses
    if (req.user.role !== 'admin') {
      where.is_active = true;
    }

    const courses = await Course.findAll({
      where,
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code']
        }
      ],
      order: [['level', 'ASC'], ['name', 'ASC']]
    });

    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Get courses by department error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

