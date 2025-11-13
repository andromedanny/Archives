const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');
const { User, Thesis, ThesisAuthors, Calendar } = require('../models');
const { protect, authorize } = require('../middleware/auth');
const { uploadAvatar, handleUploadError, getFileInfo } = require('../middleware/upload');

const router = express.Router();

// @desc    Get all users - ALL ROLES CAN VIEW (Admin sees all, others see limited)
// @route   GET /api/users
// @access  Private
router.get('/', protect, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('role').optional().isIn(['student', 'faculty', 'admin', 'adviser', 'prof']),
  query('department').optional().trim(),
  query('course').optional().trim(),
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

    // Non-admin users can only see active users
    if (req.user.role !== 'admin') {
      where.is_active = true;
    }

    // Role filter
    if (req.query.role) {
      where.role = req.query.role;
    }

    // Department filter
    if (req.query.department) {
      where.department = req.query.department;
    }

    if (req.query.course) {
      where.course = req.query.course;
    }

    // Search functionality
    if (req.query.search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${req.query.search}%` } },
        { lastName: { [Op.like]: `%${req.query.search}%` } },
        { email: { [Op.like]: `%${req.query.search}%` } },
        { student_id: { [Op.like]: `%${req.query.search}%` } }
      ];
    }

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      success: true,
      count: users.length,
      total: count,
      page,
      pages: Math.ceil(count / limit),
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single user - ALL ROLES CAN VIEW
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user can view this profile
    if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
      // Non-admin can only see active users
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this profile'
        });
      }
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create user - ALL ROLES CAN CREATE (but typically done via registration)
// @route   POST /api/users
// @access  Private (Admin can create, others need to use registration)
router.post('/', protect, authorize('admin'), [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['student', 'faculty', 'admin', 'adviser', 'prof']).withMessage('Invalid role'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('studentId').optional().trim(),
  body('phone').optional().trim()
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

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email: req.body.email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      department: req.body.department,
      student_id: req.body.studentId || null,
      phone: req.body.phone || null,
      isActive: true
    });

    const userData = user.toJSON();
    delete userData.password;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userData
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update user - ALL ROLES CAN UPDATE (themselves or admin)
// @route   PUT /api/users/:id
// @access  Private
router.put('/:id', protect, [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Invalid phone number'),
  body('role').optional().isIn(['student', 'faculty', 'admin', 'adviser', 'prof']),
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

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user can update this profile
    if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    // Only admin can change role and active status
    const updateData = {};
    if (req.body.firstName) updateData.firstName = req.body.firstName;
    if (req.body.lastName) updateData.lastName = req.body.lastName;
    if (req.body.phone) updateData.phone = req.body.phone;
    if (req.body.department) updateData.department = req.body.department;
    if (req.body.studentId) updateData.student_id = req.body.studentId;
    
    // Password update - only update if provided (for admin password reset)
    if (req.body.password && req.body.password.trim() !== '') {
      // Only admin can update passwords (for password reset functionality)
      if (req.user.role === 'admin') {
        updateData.password = req.body.password;
      }
    }

    if (req.user.role === 'admin') {
      if (req.body.role) updateData.role = req.body.role;
      if (req.body.isActive !== undefined) updateData.isActive = req.body.isActive;
    }

    await user.update(updateData);

    const userData = user.toJSON();
    delete userData.password;

    res.json({
      success: true,
      message: 'User updated successfully',
      data: userData
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete user - ALL ROLES CAN DELETE (themselves or admin)
// @route   DELETE /api/users/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user can delete this profile
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this profile'
      });
    }

    // Prevent admin from deleting themselves
    if (req.user.id === userId && req.user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Check if user is an author of any theses
    let thesisCount = 0;
    let userTheses = [];
    try {
      thesisCount = await ThesisAuthors.count({
        where: { user_id: userId }
      });
      
      // Get all thesis IDs where this user is an author
      if (thesisCount > 0) {
        const thesisAuthorRecords = await ThesisAuthors.findAll({
          where: { user_id: userId },
          attributes: ['thesis_id']
        });
        userTheses = thesisAuthorRecords.map(record => record.thesis_id);
      }
    } catch (err) {
      // If ThesisAuthors table doesn't exist or query fails, continue with deletion
      // This is a safety fallback
    }

    // Check if force delete is requested (query parameter)
    const forceDelete = req.query.force === 'true' || req.query.force === true;
    
    if (thesisCount > 0 && !forceDelete) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete user. This student has ${thesisCount} uploaded thesis/theses. Please remove the uploaded thesis/theses first before deleting the user, or use force delete to remove user and all their theses.`,
        thesisCount: thesisCount,
        thesisIds: userTheses,
        canForceDelete: true
      });
    }

    // Also check if user is an adviser for any theses
    let advisedThesisCount = 0;
    let advisedTheses = [];
    try {
      advisedThesisCount = await Thesis.count({
        where: { adviser_id: userId }
      });
      
      if (advisedThesisCount > 0) {
        const advisedThesisRecords = await Thesis.findAll({
          where: { adviser_id: userId },
          attributes: ['id']
        });
        advisedTheses = advisedThesisRecords.map(record => record.id);
      }
    } catch (err) {
      console.error('Error checking advised theses:', err);
      // Continue with deletion if query fails
    }

    // During force delete, handle adviser theses by setting adviser_id to null
    if (advisedThesisCount > 0 && forceDelete) {
      try {
        // Set adviser_id to null for all theses where this user is the adviser
        await Thesis.update(
          { adviser_id: null },
          { where: { adviser_id: userId } }
        );
      } catch (err) {
        console.error('Error removing adviser from theses:', err);
        return res.status(500).json({
          success: false,
          message: 'Error removing user as adviser from theses. Please try again.'
        });
      }
    } else if (advisedThesisCount > 0 && !forceDelete) {
      // If not force delete and user is an adviser, block deletion
      return res.status(400).json({
        success: false,
        message: `Cannot delete user. This user is an adviser for ${advisedThesisCount} thesis/theses. Please reassign the adviser first before deleting the user, or use force delete.`,
        advisedThesisCount: advisedThesisCount,
        canForceDelete: true
      });
    }

    // If force delete, delete all theses first
    if (thesisCount > 0 && forceDelete) {
      try {
        console.log('Force deleting theses for user:', userId);
        // Delete all theses where this user is an author
        for (const thesisId of userTheses) {
          try {
            // Verify thesis still exists
            const thesis = await Thesis.findByPk(thesisId);
            if (!thesis) {
              // Remove author relationship if thesis doesn't exist
              await ThesisAuthors.destroy({
                where: { thesis_id: thesisId, user_id: userId }
              });
              continue;
            }

            // Check if this is the only author or if there are co-authors
            const authorCount = await ThesisAuthors.count({
              where: { thesis_id: thesisId }
            });
            
            if (authorCount === 1) {
              // Only author, delete the thesis completely
              // First delete related calendar events
              await Calendar.destroy({
                where: { thesis_id: thesisId }
              });
              
              // Then delete all author relationships
              await ThesisAuthors.destroy({
                where: { thesis_id: thesisId }
              });
              
              // Finally delete the thesis
              await Thesis.destroy({ 
                where: { id: thesisId }
              });
            } else {
              // Multiple authors, just remove this user from authors
              await ThesisAuthors.destroy({
                where: { thesis_id: thesisId, user_id: userId }
              });
            }
          } catch (thesisErr) {
            // Continue with next thesis even if one fails
          }
        }
      } catch (err) {
        console.error('Error deleting user theses:', err);
        console.error('Error stack:', err.stack);
        return res.status(500).json({
          success: false,
          message: 'Error deleting user theses. Please try again.',
          error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/users/:id/stats
// @access  Private
router.get('/:id/stats', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user can view this profile
    if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this profile'
      });
    }

    // Get user statistics
    const stats = {
      totalTheses: 0,
      publishedTheses: 0,
      totalDownloads: 0,
      totalViews: 0,
      joinedDate: user.createdAt
    };

    if (user.role === 'student') {
      const theses = await Thesis.findAll({
        include: [
          {
            model: User,
            as: 'authors',
            where: { id: user.id },
            attributes: [],
            through: { attributes: [] },
            required: true
          }
        ]
      });
      stats.totalTheses = theses.length;
      stats.publishedTheses = theses.filter(t => t.status === 'Published').length;
      stats.totalDownloads = theses.reduce((sum, t) => sum + (t.download_count || 0), 0);
      stats.totalViews = theses.reduce((sum, t) => sum + (t.view_count || 0), 0);
    } else if (user.role === 'faculty' || user.role === 'adviser' || user.role === 'prof') {
      const advisedTheses = await Thesis.findAll({
        where: { adviser_id: user.id }
      });
      stats.totalTheses = advisedTheses.length;
      stats.publishedTheses = advisedTheses.filter(t => t.status === 'Published').length;
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get faculty/advisers for thesis assignment
// @route   GET /api/users/faculty/list
// @access  Private
router.get('/faculty/list', protect, async (req, res) => {
  try {
    const faculty = await User.findAll({
      where: {
        role: { [Op.in]: ['faculty', 'adviser', 'prof'] },
        isActive: true
      },
      attributes: ['id', 'firstName', 'lastName', 'email', 'department'],
      order: [['firstName', 'ASC'], ['lastName', 'ASC']]
    });

    res.json({
      success: true,
      count: faculty.length,
      data: faculty
    });
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get users by department
// @route   GET /api/users/department/:department
// @access  Private
router.get('/department/:department', protect, async (req, res) => {
  try {
    const where = {
      department: req.params.department,
      isActive: true
    };

    // Non-admin users can only see active users
    if (req.user.role !== 'admin') {
      where.isActive = true;
    }

    const users = await User.findAll({
      where,
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'student_id'],
      order: [['role', 'ASC'], ['firstName', 'ASC']]
    });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get users by department error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
