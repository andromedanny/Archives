const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const Thesis = require('../models/Thesis');
const { protect, authorize } = require('../middleware/auth');
const { uploadAvatar, handleUploadError, getFileInfo } = require('../middleware/upload');

const router = express.Router();

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('role').optional().isIn(['student', 'faculty', 'admin', 'adviser']),
  query('department').optional().trim(),
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
    const skip = (page - 1) * limit;

    // Build query
    const query = {};

    // Role filter
    if (req.query.role) {
      query.role = req.query.role;
    }

    // Department filter
    if (req.query.department) {
      query.department = req.query.department;
    }

    // Search functionality
    if (req.query.search) {
      query.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { studentId: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
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

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user can view this profile
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this profile'
      });
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

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (User themselves, Admin)
router.put('/:id', protect, [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('phone').optional().matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Invalid phone number'),
  body('role').optional().isIn(['student', 'faculty', 'admin', 'adviser']),
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

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user can update this profile
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
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

    if (req.user.role === 'admin') {
      if (req.body.role) updateData.role = req.body.role;
      if (req.body.isActive !== undefined) updateData.isActive = req.body.isActive;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Upload user avatar
// @route   POST /api/users/:id/avatar
// @access  Private (User themselves, Admin)
router.post('/:id/avatar', protect, uploadAvatar, handleUploadError, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user can update this profile
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Update user avatar
    user.avatar = getFileInfo(req.file);
    await user.save();

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: user.avatar
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/users/:id/stats
// @access  Private
router.get('/:id/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user can view this profile
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
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
      const theses = await Thesis.find({ authors: user._id });
      stats.totalTheses = theses.length;
      stats.publishedTheses = theses.filter(t => t.status === 'Published').length;
      stats.totalDownloads = theses.reduce((sum, t) => sum + t.downloadCount, 0);
      stats.totalViews = theses.reduce((sum, t) => sum + t.viewCount, 0);
    } else if (user.role === 'faculty' || user.role === 'adviser') {
      const advisedTheses = await Thesis.find({ adviser: user._id });
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
// @route   GET /api/users/faculty
// @access  Private
router.get('/faculty/list', protect, async (req, res) => {
  try {
    const faculty = await User.find({
      role: { $in: ['faculty', 'adviser'] },
      isActive: true
    })
    .select('firstName lastName email department')
    .sort({ firstName: 1, lastName: 1 });

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
    const users = await User.find({
      department: req.params.department,
      isActive: true
    })
    .select('firstName lastName email role studentId')
    .sort({ role: 1, firstName: 1 });

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
