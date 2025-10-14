const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Thesis = require('../models/Thesis');
const User = require('../models/User');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { uploadThesisDocument, uploadSupplementaryFiles, handleUploadError, getFileInfo } = require('../middleware/upload');

const router = express.Router();

// @desc    Get all theses (public)
// @route   GET /api/thesis
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('search').optional().trim(),
  query('department').optional().trim(),
  query('program').optional().trim(),
  query('academicYear').optional().trim(),
  query('category').optional().isIn(['Undergraduate', 'Graduate', 'Doctoral', 'Research Paper']),
  query('sortBy').optional().isIn(['title', 'publishedAt', 'downloadCount', 'viewCount']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], optionalAuth, async (req, res) => {
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
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = { isPublic: true, status: 'Published' };

    // Search functionality
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Filter by department
    if (req.query.department) {
      query.department = req.query.department;
    }

    // Filter by program
    if (req.query.program) {
      query.program = req.query.program;
    }

    // Filter by academic year
    if (req.query.academicYear) {
      query.academicYear = req.query.academicYear;
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Sort options
    const sortBy = req.query.sortBy || 'publishedAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    // Execute query
    const theses = await Thesis.find(query)
      .populate('authors', 'firstName lastName')
      .populate('adviser', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Thesis.countDocuments(query);

    res.json({
      success: true,
      count: theses.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: theses
    });
  } catch (error) {
    console.error('Get theses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single thesis
// @route   GET /api/thesis/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const thesis = await Thesis.findById(req.params.id)
      .populate('authors', 'firstName lastName email department')
      .populate('adviser', 'firstName lastName email department')
      .populate('review.reviewer', 'firstName lastName');

    if (!thesis) {
      return res.status(404).json({
        success: false,
        message: 'Thesis not found'
      });
    }

    // Check if user can view this thesis
    if (!thesis.isPublic && thesis.status !== 'Published') {
      if (!req.user || (req.user.role !== 'admin' && !thesis.authors.some(author => author._id.toString() === req.user.id))) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    // Increment view count
    await thesis.incrementViewCount();

    res.json({
      success: true,
      data: thesis
    });
  } catch (error) {
    console.error('Get thesis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new thesis
// @route   POST /api/thesis
// @access  Private (Students, Faculty)
router.post('/', protect, authorize('student', 'faculty'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('abstract').trim().notEmpty().withMessage('Abstract is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('program').trim().notEmpty().withMessage('Program is required'),
  body('academicYear').trim().notEmpty().withMessage('Academic year is required'),
  body('semester').isIn(['1st Semester', '2nd Semester', 'Summer']).withMessage('Invalid semester'),
  body('category').isIn(['Undergraduate', 'Graduate', 'Doctoral', 'Research Paper']).withMessage('Invalid category'),
  body('adviser').isMongoId().withMessage('Valid adviser ID is required'),
  body('keywords').optional().isArray().withMessage('Keywords must be an array')
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
      abstract,
      department,
      program,
      academicYear,
      semester,
      category,
      adviser,
      keywords
    } = req.body;

    // Verify adviser exists
    const adviserUser = await User.findById(adviser);
    if (!adviserUser || !['faculty', 'adviser'].includes(adviserUser.role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid adviser'
      });
    }

    // Create thesis
    const thesis = await Thesis.create({
      title,
      abstract,
      authors: [req.user.id],
      adviser,
      department,
      program,
      academicYear,
      semester,
      category,
      keywords: keywords || []
    });

    // Populate the created thesis
    await thesis.populate([
      { path: 'authors', select: 'firstName lastName' },
      { path: 'adviser', select: 'firstName lastName' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Thesis created successfully',
      data: thesis
    });
  } catch (error) {
    console.error('Create thesis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Upload thesis document
// @route   POST /api/thesis/:id/document
// @access  Private (Thesis authors, Admin)
router.post('/:id/document', protect, uploadThesisDocument, handleUploadError, async (req, res) => {
  try {
    const thesis = await Thesis.findById(req.params.id);

    if (!thesis) {
      return res.status(404).json({
        success: false,
        message: 'Thesis not found'
      });
    }

    // Check if user is author or admin
    const isAuthor = thesis.authors.some(author => author.toString() === req.user.id);
    if (!isAuthor && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload document for this thesis'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Update thesis with document info
    thesis.files.mainDocument = getFileInfo(req.file);
    await thesis.save();

    res.json({
      success: true,
      message: 'Document uploaded successfully',
      data: thesis.files.mainDocument
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Upload supplementary files
// @route   POST /api/thesis/:id/supplementary
// @access  Private (Thesis authors, Admin)
router.post('/:id/supplementary', protect, uploadSupplementaryFiles, handleUploadError, async (req, res) => {
  try {
    const thesis = await Thesis.findById(req.params.id);

    if (!thesis) {
      return res.status(404).json({
        success: false,
        message: 'Thesis not found'
      });
    }

    // Check if user is author or admin
    const isAuthor = thesis.authors.some(author => author.toString() === req.user.id);
    if (!isAuthor && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload files for this thesis'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Add supplementary files
    const supplementaryFiles = req.files.map(file => getFileInfo(file));
    thesis.files.supplementaryFiles.push(...supplementaryFiles);
    await thesis.save();

    res.json({
      success: true,
      message: 'Supplementary files uploaded successfully',
      data: supplementaryFiles
    });
  } catch (error) {
    console.error('Upload supplementary files error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update thesis
// @route   PUT /api/thesis/:id
// @access  Private (Thesis authors, Admin)
router.put('/:id', protect, [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('abstract').optional().trim().notEmpty().withMessage('Abstract cannot be empty'),
  body('keywords').optional().isArray().withMessage('Keywords must be an array')
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

    // Check if user is author or admin
    const isAuthor = thesis.authors.some(author => author.toString() === req.user.id);
    if (!isAuthor && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this thesis'
      });
    }

    // Only allow updates if thesis is in draft status
    if (thesis.status !== 'Draft' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update thesis that is not in draft status'
      });
    }

    const updateData = {};
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.abstract) updateData.abstract = req.body.abstract;
    if (req.body.keywords) updateData.keywords = req.body.keywords;

    const updatedThesis = await Thesis.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'authors', select: 'firstName lastName' },
      { path: 'adviser', select: 'firstName lastName' }
    ]);

    res.json({
      success: true,
      message: 'Thesis updated successfully',
      data: updatedThesis
    });
  } catch (error) {
    console.error('Update thesis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Submit thesis for review
// @route   PUT /api/thesis/:id/submit
// @access  Private (Thesis authors)
router.put('/:id/submit', protect, async (req, res) => {
  try {
    const thesis = await Thesis.findById(req.params.id);

    if (!thesis) {
      return res.status(404).json({
        success: false,
        message: 'Thesis not found'
      });
    }

    // Check if user is author
    const isAuthor = thesis.authors.some(author => author.toString() === req.user.id);
    if (!isAuthor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to submit this thesis'
      });
    }

    // Check if thesis has required document
    if (!thesis.files.mainDocument) {
      return res.status(400).json({
        success: false,
        message: 'Main document is required before submission'
      });
    }

    // Update status
    thesis.status = 'Under Review';
    thesis.submittedAt = new Date();
    await thesis.save();

    res.json({
      success: true,
      message: 'Thesis submitted for review successfully',
      data: thesis
    });
  } catch (error) {
    console.error('Submit thesis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Download thesis document
// @route   GET /api/thesis/:id/download
// @access  Public
router.get('/:id/download', async (req, res) => {
  try {
    const thesis = await Thesis.findById(req.params.id);

    if (!thesis) {
      return res.status(404).json({
        success: false,
        message: 'Thesis not found'
      });
    }

    if (!thesis.files.mainDocument) {
      return res.status(404).json({
        success: false,
        message: 'Document not available'
      });
    }

    // Increment download count
    await thesis.incrementDownloadCount();

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${thesis.files.mainDocument.originalName}"`);
    res.setHeader('Content-Type', thesis.files.mainDocument.mimetype);

    // Send file
    res.sendFile(path.resolve(thesis.files.mainDocument.path));
  } catch (error) {
    console.error('Download thesis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user's theses
// @route   GET /api/thesis/user/my-theses
// @access  Private
router.get('/user/my-theses', protect, async (req, res) => {
  try {
    const theses = await Thesis.find({ authors: req.user.id })
      .populate('adviser', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: theses.length,
      data: theses
    });
  } catch (error) {
    console.error('Get user theses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
