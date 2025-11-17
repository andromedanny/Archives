const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { protect } = require('../middleware/auth');
// Import models from index to ensure associations are loaded
const { User, Department, Course } = require('../models');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('course').trim().notEmpty().withMessage('Course is required'),
  body('role').isIn(['student', 'faculty', 'adviser']).withMessage('Invalid role'),
  body('studentId').optional().trim()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, password, department, course, role, studentId, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email },
          ...(studentId ? [{ student_id: studentId }] : [])
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or student ID'
      });
    }

    // Create user with pending approval status (admin users are auto-approved)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      department,
      course,
      role,
      student_id: studentId,
      phone,
      approval_status: role === 'admin' ? 'approved' : 'pending'
    });

    // Don't generate token for non-admin users - they need approval first
    if (role === 'admin') {
      const token = generateToken(user.id);
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          department: user.department,
          course: user.course,
          studentId: user.student_id,
          approvalStatus: user.approval_status
        }
      });
    } else {
      res.status(201).json({
        success: true,
        message: 'Registration successful. Your account is pending admin approval. You will be able to login once approved.',
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          department: user.department,
          course: user.course,
          studentId: user.student_id,
          approvalStatus: user.approval_status
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('email').notEmpty().withMessage('Email or School ID is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check for user by email OR student_id (School ID)
    // The frontend sends "School ID" in the email field, so we check both
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: email },
          { student_id: email }
        ]
      },
      attributes: ['id', 'email', 'password', 'role', 'student_id', 'firstName', 'lastName', 'department', 'course', 'is_active', 'approval_status']
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact administrator.'
      });
    }

    // Check if user is approved (admin users are always approved)
    if (user.role !== 'admin' && user.approval_status !== 'approved') {
      if (user.approval_status === 'pending') {
        return res.status(403).json({
          success: false,
          message: 'Your account is pending admin approval. Please wait for approval before logging in.'
        });
      } else if (user.approval_status === 'rejected') {
        return res.status(403).json({
          success: false,
          message: 'Your account has been rejected. Please contact administrator for more information.'
        });
      }
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Skip lastLogin update since updated_at column doesn't exist in database
    // TODO: Add updated_at and last_login columns to database

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        department: user.department,
        course: user.course,
        studentId: user.student_id,
        approvalStatus: user.approval_status
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    res.json({
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        department: user.department,
        course: user.course,
        studentId: user.student_id,
        phone: user.phone,
        avatar: user.avatar,
        isActive: user.is_active,
        approvalStatus: user.approval_status,
        lastLogin: user.last_login,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('phone').optional().matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Invalid phone number'),
  body('course').optional().trim()
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

    const { firstName, lastName, phone, course } = req.body;
    const updateData = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (course !== undefined) updateData.course = course || null;

    let user = await User.findByPk(req.user.id);
    await user.update(updateData);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        department: user.department,
        course: user.course,
        studentId: user.studentId,
        phone: user.phone,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', protect, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
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

    const { currentPassword, newPassword } = req.body;

    // Get user with password (Sequelize)
    const user = await User.findByPk(req.user.id, { attributes: { include: ['password'] } });

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get departments and courses for registration (public)
// @route   GET /api/auth/register-data
// @access  Public
router.get('/register-data', async (req, res) => {
  // Set timeout to prevent hanging requests (10 seconds)
  let timeout;
  const timeoutPromise = new Promise((_, reject) => {
    timeout = setTimeout(() => {
      reject(new Error('Database query timeout'));
    }, 10000); // 10 seconds timeout
  });

  try {
    // Fetch departments with their courses with timeout protection
    const departmentsPromise = Department.findAll({
      where: { is_active: true },
      include: [{
        model: Course,
        as: 'courses',
        required: false,
        attributes: ['id', 'name', 'code', 'is_active']
      }],
      order: [['name', 'ASC']],
      attributes: ['id', 'name', 'code']
    });

    // Race between database query and timeout
    const departments = await Promise.race([departmentsPromise, timeoutPromise]);
    
    // Clear timeout if query completes successfully
    clearTimeout(timeout);

    // Format the response and filter active courses
    const formattedData = departments.map(dept => {
      const deptData = dept.toJSON();
      return {
        id: deptData.id,
        name: deptData.name,
        code: deptData.code,
        courses: (deptData.courses || [])
          .filter(course => course.is_active !== false)
          .map(course => ({
            id: course.id,
            name: course.name,
            code: course.code
          }))
      };
    });

    // Ensure response is sent only once
    if (!res.headersSent) {
      res.json({
        success: true,
        data: formattedData
      });
    }
  } catch (error) {
    // Clear timeout on error
    if (timeout) clearTimeout(timeout);
    
    console.error('Get register data error:', error.message);
    console.error('Error stack:', error.stack);
    
    // Ensure response is sent only once
    if (!res.headersSent) {
      const statusCode = error.message === 'Database query timeout' ? 504 : 500;
      const message = error.message === 'Database query timeout' 
        ? 'Request timeout. Database may be slow or unavailable. Please try again.'
        : 'Server error';
      
      res.status(statusCode).json({
        success: false,
        message: message,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
});

module.exports = router;
