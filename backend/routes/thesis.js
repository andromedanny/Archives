const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const { Thesis, User, ThesisAuthors } = require('../models');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { uploadThesisDocument, uploadSupplementaryFiles, handleUploadError, getFileInfo, verifyFileIntegrity } = require('../middleware/upload');
const { logAction, logFileOperation } = require('../middleware/audit');
const path = require('path');
const fs = require('fs');

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
    const offset = (page - 1) * limit;

    // Build where clause (using snake_case to match database columns)
    // Collect all conditions first, then combine them properly
    const conditions = [];

    // Base visibility condition: Show published public theses, OR theses from the logged-in user's department
    if (req.user && req.user.department) {
      // If user is logged in and has a department:
      if (req.user.role === 'adviser') {
        // Advisers see ONLY APPROVED theses from their department when viewing public thesis list
        // (Note: /adviser/theses endpoint shows all statuses for management purposes)
        conditions.push({ 
          department: req.user.department,
          status: 'Approved'
        });
      } else if (req.user.role === 'student') {
        // Students can only see their own draft theses
        // We'll filter by author in the include/query, but for now restrict to Draft status
        // The actual author filtering will be done after fetching
        conditions.push({ status: 'Draft' });
      } else {
        // Other users (faculty, admin) see:
        // 1. All published public theses (from any department)
        // 2. All theses from user's department (regardless of status or is_public)
        conditions.push({
          [Op.or]: [
            { is_public: true, status: 'Published' },
            { department: req.user.department }
          ]
        });
      }
    } else {
      // If not logged in, only show published public theses
      conditions.push({ is_public: true, status: 'Published' });
    }

    // Search functionality (Objective 5.3: Advanced search)
    if (req.query.search) {
      const searchTerm = `%${req.query.search}%`;
      const searchConditions = [
        { title: { [Op.like]: searchTerm } },
        { abstract: { [Op.like]: searchTerm } }
      ];
      
      // Search in keywords (JSON field) - cast to text for PostgreSQL/MySQL compatibility
      // For PostgreSQL: cast JSON to text, for MySQL: use JSON_EXTRACT or CAST
      const dbType = sequelize.getDialect();
      if (dbType === 'postgres') {
        searchConditions.push(
          sequelize.where(
            sequelize.cast(sequelize.col('keywords'), 'TEXT'),
            { [Op.like]: searchTerm }
          )
        );
      } else {
        // MySQL - keywords is JSON, use JSON_SEARCH or CAST
        searchConditions.push(
          sequelize.where(
            sequelize.fn('CAST', sequelize.col('keywords'), 'CHAR'),
            { [Op.like]: searchTerm }
          )
        );
      }
      
      conditions.push({ [Op.or]: searchConditions });
    }

    // Keyword search (Objective 5.3: Advanced search with keywords)
    if (req.query.keywords) {
      const keywords = Array.isArray(req.query.keywords) 
        ? req.query.keywords 
        : req.query.keywords.split(',').map(k => k.trim());
      
      const dbType = sequelize.getDialect();
      const keywordConditions = keywords.map(keyword => {
        const keywordTerm = `%${keyword}%`;
        if (dbType === 'postgres') {
          return sequelize.where(
            sequelize.cast(sequelize.col('keywords'), 'TEXT'),
            { [Op.like]: keywordTerm }
          );
        } else {
          return sequelize.where(
            sequelize.fn('CAST', sequelize.col('keywords'), 'CHAR'),
            { [Op.like]: keywordTerm }
          );
        }
      });
      
      conditions.push({ [Op.or]: keywordConditions });
    }

    // Date range filtering (Objective 5.3: Date range search)
    if (req.query.dateFrom || req.query.dateTo) {
      const dateCondition = {};
      if (req.query.dateFrom) {
        dateCondition[Op.gte] = new Date(req.query.dateFrom);
      }
      if (req.query.dateTo) {
        dateCondition[Op.lte] = new Date(req.query.dateTo);
      }
      conditions.push({ submitted_at: dateCondition });
    }

    // Filter by department
    if (req.query.department) {
      conditions.push({ department: req.query.department });
    }

    // Filter by program
    if (req.query.program) {
      conditions.push({ program: req.query.program });
    }

    // Filter by academic year (convert camelCase to snake_case)
    if (req.query.academicYear) {
      conditions.push({ academic_year: req.query.academicYear });
    }

    // Filter by category
    if (req.query.category) {
      conditions.push({ category: req.query.category });
    }

    // Combine all conditions with Op.and
    const where = conditions.length === 1 ? conditions[0] : { [Op.and]: conditions };

    // Sort options (convert camelCase to snake_case)
    let sortBy = req.query.sortBy || 'published_at';
    // Convert camelCase sortBy to snake_case
    const sortByMap = {
      'publishedAt': 'published_at',
      'downloadCount': 'download_count',
      'viewCount': 'view_count'
    };
    sortBy = sortByMap[sortBy] || sortBy;
    
    const sortOrder = req.query.sortOrder === 'asc' ? 'ASC' : 'DESC';
    const order = [[sortBy, sortOrder]];

    // For students, we need to filter by author - add this to the include condition
    let includeConditions = [
      {
        model: User,
        as: 'authors',
        attributes: ['id', 'firstName', 'lastName'],
        through: { attributes: [] }
      },
      {
        model: User,
        as: 'adviser',
        attributes: ['id', 'firstName', 'lastName']
      }
    ];

    // If user is a student, only show theses where they are an author
    if (req.user && req.user.role === 'student') {
      includeConditions[0] = {
        ...includeConditions[0],
        where: { id: req.user.id },
        required: true // INNER JOIN - only theses where this student is an author
      };
    }

    // Execute query
    const { count, rows: theses } = await Thesis.findAndCountAll({
      where,
      include: includeConditions,
      order,
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
    console.error('Get theses error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get adviser's department theses
// @route   GET /api/thesis/adviser/department-theses
// @access  Private (Adviser)
// NOTE: This route MUST come before /:id to avoid route conflicts
router.get('/adviser/department-theses', protect, async (req, res) => {
  try {
    // Check if user is an adviser
    if (req.user.role !== 'adviser') {
      return res.status(403).json({
        success: false,
        message: 'Only advisers can access this endpoint'
      });
    }

    if (!req.user.department) {
      return res.status(400).json({
        success: false,
        message: 'Adviser must have a department assigned'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get all theses from adviser's department
    const { count, rows: theses } = await Thesis.findAndCountAll({
      where: {
        department: req.user.department
      },
      include: [
        {
          model: User,
          as: 'authors',
          attributes: ['id', 'firstName', 'lastName'],
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'adviser',
          attributes: ['id', 'firstName', 'lastName'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']],
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
    console.error('Get adviser department theses error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get user's theses
// @route   GET /api/thesis/user/my-theses
// @access  Private
// NOTE: This route MUST come before /:id to avoid route conflicts
router.get('/user/my-theses', protect, async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const { ThesisAuthors } = require('../models');
    
    // Get all thesis IDs where the user is an author
    const authorTheses = await ThesisAuthors.findAll({
      where: { user_id: req.user.id },
      attributes: ['thesis_id', 'user_id']
    });
    
    const thesisIds = authorTheses.map(at => at.thesis_id);
    
    if (thesisIds.length === 0) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }
    
    const theses = await Thesis.findAll({
      where: {
        id: {
          [Op.in]: thesisIds
        }
      },
      include: [
        {
          model: User,
          as: 'authors',
          attributes: ['id', 'firstName', 'lastName'],
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'adviser',
          attributes: ['id', 'firstName', 'lastName'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: theses.length,
      data: theses
    });
  } catch (error) {
    console.error('Get user theses error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    View thesis document (for inline viewing in browser)
// @route   GET /api/thesis/:id/view
// @access  Private (Public theses can be viewed by anyone, private only by authors/admin)
// NOTE: This route MUST come before /:id to avoid route conflicts
router.get('/:id/view', optionalAuth, async (req, res) => {
  try {
    const thesis = await Thesis.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'authors',
          attributes: ['id'],
          through: { attributes: [] }
        }
      ]
    });

    if (!thesis) {
      return res.status(404).json({
        success: false,
        message: 'Thesis not found'
      });
    }

    // Check if user can view this thesis
    // Students can only view their own draft theses
    // Public theses with Published status can be viewed by anyone (except students)
    // Private theses or non-published theses require authentication
    // Admins and advisers can view all theses they have access to
    
    // Check if user is author
    const authorIds = thesis.authors.map(a => a.id);
    const isAuthor = req.user && authorIds.includes(req.user.id);
    
    // Students can only view their own draft theses
    if (req.user && req.user.role === 'student') {
      if (!isAuthor || thesis.status !== 'Draft') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Students can only view their own draft theses.'
        });
      }
      // Allow access - student is viewing their own draft
    } else if (!thesis.is_public || thesis.status !== 'Published') {
      // For non-students: Public theses with Published status can be viewed by anyone
      // Private theses or non-published theses require authentication
      // Admins can view all theses
      if (req.user && req.user.role === 'admin') {
        // Allow admin access - continue
      } else if (req.user) {
        // Check if user is the assigned adviser
        const isAssignedAdviser = thesis.adviser_id === req.user.id;
        
        // Check if user is an adviser from the same department
        const isDepartmentAdviser = req.user.role === 'adviser' && 
                                    req.user.department && 
                                    thesis.department === req.user.department;
        
        if (!isAuthor && !isAssignedAdviser && !isDepartmentAdviser) {
          return res.status(403).json({
            success: false,
            message: 'Access denied. This thesis is not publicly available.'
          });
        }
      } else {
        // No user authentication
        return res.status(403).json({
          success: false,
          message: 'Access denied. This thesis is not publicly available.'
        });
      }
    }

    // Check if document exists
    if (!thesis.main_document || !thesis.main_document.path) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
        details: 'This thesis does not have a document uploaded yet.'
      });
    }

    const filePath = thesis.main_document.path;

    // Check if using cloud storage (Supabase Storage)
    // If path is a URL, redirect to it or proxy it
    if (filePath && (filePath.startsWith('http://') || filePath.startsWith('https://'))) {
      // Cloud storage URL - redirect to it
      return res.redirect(filePath);
    }

    // Check if Supabase Storage is configured and file might be in Supabase
    const storageType = process.env.STORAGE_TYPE || 'local';
    if (storageType === 'supabase') {
      const { isConfigured, getFileUrl } = require('../config/supabaseStorage');
      if (isConfigured()) {
        // Try to construct Supabase URL from file path
        // If file path is a storage path (not a full URL), try to get public URL
        const supabaseUrl = getFileUrl(filePath);
        if (supabaseUrl) {
          return res.redirect(supabaseUrl);
        }
      }
    }

    // Local file storage
    // Resolve absolute path from project root
    const absolutePath = path.isAbsolute(filePath) 
      ? filePath 
      : path.resolve(process.cwd(), filePath);

    // Verify file exists
    if (!fs.existsSync(absolutePath)) {
      console.error('File not found locally:', absolutePath);
      console.error('Stored path:', filePath);
      console.error('Current working directory:', process.cwd());
      console.error('Storage type:', storageType);
      
      // Check if file might be in uploads directory
      const uploadsPath = path.resolve(process.cwd(), 'uploads', path.basename(filePath));
      if (fs.existsSync(uploadsPath)) {
        // File exists but path was wrong - use correct path
        const correctPath = uploadsPath;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${thesis.main_document.originalName || `thesis-${thesis.id}.pdf`}"`);
        res.setHeader('X-Content-Type-Options', 'nosniff');
        return res.sendFile(correctPath);
      }
      
      // File not found - provide helpful error message
      const isSupabaseConfigured = storageType === 'supabase' && require('../config/supabaseStorage').isConfigured();
      const errorMessage = isSupabaseConfigured
        ? 'File not found on server. The file may have been deleted or the server was redeployed. Please re-upload the document. If this file was uploaded before Supabase Storage was configured, you will need to re-upload it.'
        : 'File not found on server. This is because Render uses ephemeral storage - files are lost when the server redeploys. Please set up Supabase Storage for persistent file storage.';
      
      return res.status(404).json({
        success: false,
        message: errorMessage,
        details: {
          storedPath: filePath,
          absolutePath: absolutePath,
          cwd: process.cwd(),
          storageType: storageType,
          supabaseConfigured: isSupabaseConfigured,
          tip: storageType !== 'supabase' 
            ? 'Set STORAGE_TYPE=supabase and configure SUPABASE_URL, SUPABASE_KEY, and SUPABASE_STORAGE_BUCKET in Render environment variables to enable persistent file storage.'
            : 'Files uploaded before Supabase Storage was configured may need to be re-uploaded.'
        }
      });
    }

    // Set headers for inline viewing (not download)
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${thesis.main_document.originalName || `thesis-${thesis.id}.pdf`}"`);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Send file for inline viewing
    res.sendFile(absolutePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: 'Error viewing file'
          });
        }
      }
    });
  } catch (error) {
    console.error('View thesis error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
});

// @desc    Download thesis document with integrity verification
// @route   GET /api/thesis/:id/download
// @access  Private (Public theses can be downloaded by anyone, private only by authors/admin)
// NOTE: This route MUST come before /:id to avoid route conflicts
router.get('/:id/download', optionalAuth, async (req, res) => {
  try {
    const thesis = await Thesis.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'authors',
          attributes: ['id'],
          through: { attributes: [] }
        }
      ]
    });

    if (!thesis) {
      return res.status(404).json({
        success: false,
        message: 'Thesis not found'
      });
    }

    // Check if user can download this thesis
    // Students can only download their own draft theses
    // Public theses with Published status can be downloaded by anyone (except students)
    // Private theses or non-published theses require authentication
    // Admins and advisers can download all theses they have access to
    
    // Check if user is author
    const authorIds = thesis.authors.map(a => a.id);
    const isAuthor = req.user && authorIds.includes(req.user.id);
    
    // Students can only download their own draft theses
    if (req.user && req.user.role === 'student') {
      if (!isAuthor || thesis.status !== 'Draft') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Students can only download their own draft theses.'
        });
      }
      // Allow access - student is downloading their own draft
    } else if (!thesis.is_public || thesis.status !== 'Published') {
      // For non-students: Public theses with Published status can be downloaded by anyone
      // Private theses or non-published theses require authentication
      // Admins can download all theses
      if (req.user && req.user.role === 'admin') {
        // Allow admin access - continue
      } else if (req.user) {
        // Check if user is the assigned adviser
        const isAssignedAdviser = thesis.adviser_id === req.user.id;
        
        // Check if user is an adviser from the same department
        const isDepartmentAdviser = req.user.role === 'adviser' && 
                                    req.user.department && 
                                    thesis.department === req.user.department;
        
        if (!isAuthor && !isAssignedAdviser && !isDepartmentAdviser) {
          return res.status(403).json({
            success: false,
            message: 'Access denied. This thesis is not publicly available.'
          });
        }
      } else {
        // No user authentication
        return res.status(403).json({
          success: false,
          message: 'Access denied. This thesis is not publicly available.'
        });
      }
    }

    // Check if document exists
    if (!thesis.main_document || !thesis.main_document.path) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
        details: 'This thesis does not have a document uploaded yet.'
      });
    }

    const filePath = thesis.main_document.path;

    // Check if using cloud storage (Supabase Storage)
    // If path is a URL, redirect to it
    if (filePath && (filePath.startsWith('http://') || filePath.startsWith('https://'))) {
      // Cloud storage URL - redirect to it for download
      // Increment download count before redirecting
      await thesis.incrementDownloadCount();
      await logFileOperation(req, 'thesis.download', thesis.id, 'success');
      return res.redirect(filePath);
    }

    // Check if Supabase Storage is configured and file might be in Supabase
    const storageType = process.env.STORAGE_TYPE || 'local';
    if (storageType === 'supabase') {
      const { isConfigured, getFileUrl } = require('../config/supabaseStorage');
      if (isConfigured()) {
        // Try to construct Supabase URL from file path
        // If file path is a storage path (not a full URL), try to get public URL
        const supabaseUrl = getFileUrl(filePath);
        if (supabaseUrl) {
          await thesis.incrementDownloadCount();
          await logFileOperation(req, 'thesis.download', thesis.id, 'success');
          return res.redirect(supabaseUrl);
        }
      }
    }

    // Local file storage
    // Resolve absolute path from project root
    const absolutePath = path.isAbsolute(filePath) 
      ? filePath 
      : path.resolve(process.cwd(), filePath);

    // Verify file exists
    if (!fs.existsSync(absolutePath)) {
      console.error('File not found locally for download:', absolutePath);
      console.error('Stored path:', filePath);
      console.error('Current working directory:', process.cwd());
      console.error('Storage type:', storageType);
      
      // Check if file might be in uploads directory
      const uploadsPath = path.resolve(process.cwd(), 'uploads', path.basename(filePath));
      if (fs.existsSync(uploadsPath)) {
        // File exists but path was wrong - use correct path
        const correctPath = uploadsPath;
        const fileName = thesis.main_document.originalName || `thesis-${thesis.id}.pdf`;
        await thesis.incrementDownloadCount();
        await logFileOperation(req, 'thesis.download', thesis.id, 'success');
        return res.download(correctPath, fileName);
      }
      
      // File not found - provide helpful error message
      const isSupabaseConfigured = storageType === 'supabase' && require('../config/supabaseStorage').isConfigured();
      const errorMessage = isSupabaseConfigured
        ? 'File not found on server. The file may have been deleted or the server was redeployed. Please re-upload the document. If this file was uploaded before Supabase Storage was configured, you will need to re-upload it.'
        : 'File not found on server. This is because Render uses ephemeral storage - files are lost when the server redeploys. Please set up Supabase Storage for persistent file storage.';
      
      return res.status(404).json({
        success: false,
        message: errorMessage,
        details: {
          storedPath: filePath,
          absolutePath: absolutePath,
          cwd: process.cwd(),
          storageType: storageType,
          supabaseConfigured: isSupabaseConfigured,
          tip: storageType !== 'supabase' 
            ? 'Set STORAGE_TYPE=supabase and configure SUPABASE_URL, SUPABASE_KEY, and SUPABASE_STORAGE_BUCKET in Render environment variables to enable persistent file storage.'
            : 'Files uploaded before Supabase Storage was configured may need to be re-uploaded.'
        }
      });
    }

    // Verify file integrity (Objective 1.4: Prevent data corruption)
    // Only verify integrity for local files (not URLs)
    if (thesis.main_document.checksum) {
      const isIntegrityValid = verifyFileIntegrity(absolutePath, thesis.main_document.checksum);
      if (!isIntegrityValid) {
        console.error(`File integrity check failed for thesis ${thesis.id}`);
        return res.status(500).json({
          success: false,
          message: 'File integrity verification failed. The file may be corrupted. Please contact the administrator.'
        });
      }
    }

    // Increment download count
    await thesis.incrementDownloadCount();

    // Log file download (Objective 5.5: Audit logging)
    await logFileOperation(req, 'thesis.download', thesis.id, 'success');

    // Send file
    const fileName = thesis.main_document.originalName || `thesis-${thesis.id}.pdf`;
    res.download(absolutePath, fileName, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        // Log download failure
        logFileOperation(req, 'thesis.download', thesis.id, 'failure', err.message).catch(console.error);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: 'Error downloading file'
          });
        }
      }
    });
  } catch (error) {
    console.error('Download thesis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Upload thesis document
// @route   POST /api/thesis/:id/document
// @access  Private (Thesis authors and admin)
// NOTE: This route MUST come before /:id to avoid route conflicts
router.post('/:id/document', protect, uploadThesisDocument, handleUploadError, async (req, res) => {
  try {
    const thesis = await Thesis.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'authors',
          attributes: ['id'],
          through: { attributes: [] }
        }
      ]
    });

    if (!thesis) {
      return res.status(404).json({
        success: false,
        message: 'Thesis not found'
      });
    }

    // Check if user is author or admin
    const authorIds = thesis.authors.map(a => a.id);
    const isAuthor = authorIds.includes(req.user.id);
    
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

    // Check if using cloud storage (Supabase Storage)
    const storageType = process.env.STORAGE_TYPE || 'local';
    let fileInfo;
    
    if (storageType === 'supabase') {
      // Check if Supabase is configured
      const { isConfigured } = require('../config/supabaseStorage');
      
      if (!isConfigured()) {
        console.error('⚠️ Supabase Storage is not configured. Falling back to local storage.');
        console.error('Please set SUPABASE_URL and SUPABASE_KEY environment variables in Render.');
        console.error('Current values:', {
          SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
          SUPABASE_KEY: process.env.SUPABASE_KEY ? 'SET' : 'NOT SET',
          SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET || 'thesis-documents'
        });
        // Fall back to local storage if Supabase is not configured
        fileInfo = getFileInfo(req.file);
      } else {
        // Upload to Supabase Storage
        const { uploadFile: uploadToCloud } = require('../config/cloudStorage');
        try {
          fileInfo = await uploadToCloud(req.file, 'thesis/documents');
          // fileInfo.url contains the public URL
          // fileInfo.path contains the storage path
          // Store the URL in the database for Supabase
        } catch (error) {
          console.error('❌ Supabase upload error:', error);
          console.error('Error message:', error.message);
          console.error('Error code:', error.error || error.code);
          console.error('Error stack:', error.stack);
          // Fall back to local storage if Supabase upload fails
          console.warn('⚠️ Falling back to local storage due to Supabase upload error');
          fileInfo = getFileInfo(req.file);
        }
      }
    } else {
      // Local storage - get file info (includes checksum for integrity verification - Objective 1.4)
      fileInfo = getFileInfo(req.file);
    }

    // Update thesis with document info (using snake_case)
    // For Supabase: store the URL in path field
    // For local: store the file path
    await thesis.update({
      main_document: {
        filename: fileInfo.filename || req.file.filename,
        originalName: fileInfo.originalName || req.file.originalname,
        path: fileInfo.url || fileInfo.path || req.file.path, // URL for Supabase, path for local
        size: fileInfo.size || req.file.size,
        mimetype: fileInfo.mimetype || req.file.mimetype,
        checksum: fileInfo.checksum, // SHA256 checksum for integrity verification (local only)
        uploadedAt: new Date()
      }
    });

    // Log file upload (Objective 5.5: Audit logging)
    await logFileOperation(req, 'thesis.upload', thesis.id, 'success');

    res.json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        file: fileInfo
      }
    });
  } catch (error) {
    console.error('Upload document error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    
    // Provide more helpful error messages
    let errorMessage = 'Failed to upload document. Please try again.';
    if (error.message && error.message.includes('Supabase')) {
      errorMessage = 'Failed to upload to cloud storage. Please check Supabase configuration or try again.';
    } else if (error.message && error.message.includes('bucket')) {
      errorMessage = 'Storage bucket not found. Please check Supabase Storage configuration.';
    } else if (error.message && error.message.includes('permission')) {
      errorMessage = 'Permission denied. Please check Supabase Storage permissions.';
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack,
        tip: 'Check Render logs for more details. If using Supabase, verify SUPABASE_URL and SUPABASE_KEY are set correctly.'
      } : undefined
    });
  }
});

// @desc    Get single thesis
// @route   GET /api/thesis/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const thesis = await Thesis.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'authors',
          attributes: ['id', 'firstName', 'lastName', 'email', 'department'],
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'adviser',
          attributes: ['id', 'firstName', 'lastName', 'email', 'department']
        },
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    if (!thesis) {
      return res.status(404).json({
        success: false,
        message: 'Thesis not found'
      });
    }

    // Check if user can view this thesis
    // Public theses with Published status can be viewed by anyone
    // Private theses or non-published theses require authentication
    // Admins and advisers can view all theses they have access to
    if (!thesis.is_public || thesis.status !== 'Published') {
      // Admins can view all theses
      if (req.user && req.user.role === 'admin') {
        // Allow admin access - continue
      } else if (req.user) {
        // Check if user is author
        const authorIds = thesis.authors.map(a => a.id);
        const isAuthor = authorIds.includes(req.user.id);
        
        // Check if user is the assigned adviser
        const isAssignedAdviser = thesis.adviser_id === req.user.id;
        
        // Check if user is an adviser from the same department
        const isDepartmentAdviser = req.user.role === 'adviser' && 
                                    req.user.department && 
                                    thesis.department === req.user.department;
        
        if (!isAuthor && !isAssignedAdviser && !isDepartmentAdviser) {
          return res.status(403).json({
            success: false,
            message: 'Access denied. This thesis is not publicly available.'
          });
        }
      } else {
        // No user authentication
        return res.status(403).json({
          success: false,
          message: 'Access denied. This thesis is not publicly available.'
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

// @desc    Create new thesis - ALL ROLES CAN CREATE
// @route   POST /api/thesis
// @access  Private (All authenticated users)
router.post('/', protect, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('abstract').trim().notEmpty().withMessage('Abstract is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('program').trim().notEmpty().withMessage('Program is required'),
  body('academicYear').trim().notEmpty().withMessage('Academic year is required'),
  body('semester').isIn(['1st Semester', '2nd Semester', 'Summer']).withMessage('Invalid semester'),
  body('category').isIn(['Undergraduate', 'Graduate', 'Doctoral', 'Research Paper']).withMessage('Invalid category'),
  body('adviserId').optional().isInt().withMessage('Valid adviser ID is required'),
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
      adviserId,
      keywords
    } = req.body;

    // Verify adviser exists if provided
    let adviser = null;
    if (adviserId) {
      adviser = await User.findByPk(adviserId);
      if (!adviser || !['faculty', 'adviser', 'prof', 'admin'].includes(adviser.role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid adviser'
        });
      }
    }

    // Create thesis - use snake_case field names to match model definition
    // Note: Even with underscored: true, when model defines fields in snake_case,
    // we need to use the field names as defined in the model
    const thesisData = {
      title,
      abstract,
      department,
      program,
      semester,
      category,
      keywords: keywords || [],
      status: 'Draft'
    };
    
    // Add optional fields
    if (adviserId) {
      thesisData.adviser_id = adviserId;
    }
    if (academicYear) {
      thesisData.academic_year = academicYear;
    }
    
    const thesis = await Thesis.create(thesisData);

    // Add authors - use coAuthorIds if provided (for admin-created theses), otherwise use current user
    const authorIds = req.body.coAuthorIds && Array.isArray(req.body.coAuthorIds) && req.body.coAuthorIds.length > 0
      ? req.body.coAuthorIds
      : [req.user.id];

    try {
      // Use the Sequelize belongsToMany association method
      await thesis.setAuthors(authorIds);
      
      // Verify the relationship was created
      const authorCount = await ThesisAuthors.count({
        where: {
          thesis_id: thesis.id,
          user_id: { [Op.in]: authorIds }
        }
      });
    } catch (authorError) {
      console.error('Error adding author:', authorError);
      console.error('Author error stack:', authorError.stack);
      
      // Try alternative method if setAuthors fails
      try {
        for (const userId of authorIds) {
          await ThesisAuthors.findOrCreate({
            where: {
              thesis_id: thesis.id,
              user_id: userId
            },
            defaults: {
              thesis_id: thesis.id,
              user_id: userId
            }
          });
        }
      } catch (fallbackError) {
        // Don't fail the whole request, but log the error silently
      }
    }

    // Reload with associations
    await thesis.reload({
      include: [
        {
          model: User,
          as: 'authors',
          attributes: ['id', 'firstName', 'lastName'],
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'adviser',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    // Log thesis creation (Objective 5.5: Audit logging)
    await logAction({
      userId: req.user.id,
      action: 'thesis.create',
      resourceType: 'thesis',
      resourceId: thesis.id,
      description: `Created thesis: ${thesis.title}`,
      status: 'success',
      req
    });

    res.status(201).json({
      success: true,
      message: 'Thesis created successfully',
      data: thesis
    });
  } catch (error) {
    console.error('Create thesis error:', error);
    console.error('Error stack:', error.stack);
    
    // Log creation failure
    await logAction({
      userId: req.user?.id,
      action: 'thesis.create',
      resourceType: 'thesis',
      description: `Failed to create thesis: ${req.body.title}`,
      status: 'failure',
      errorMessage: error.message,
      req
    });

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Update thesis - ALL ROLES CAN UPDATE (with restrictions)
// @route   PUT /api/thesis/:id
// @access  Private (Authors, Admin can update any)
router.put('/:id', protect, [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('abstract').optional().trim().notEmpty().withMessage('Abstract cannot be empty'),
  body('keywords').optional().isArray().withMessage('Keywords must be an array'),
  body('status').optional().isIn(['Draft', 'Under Review', 'Approved', 'Published', 'Rejected'])
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

    const thesis = await Thesis.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'authors',
          attributes: ['id'],
          through: { attributes: [] }
        }
      ]
    });

    if (!thesis) {
      return res.status(404).json({
        success: false,
        message: 'Thesis not found'
      });
    }

    // Check if user is author, admin, or adviser in the same department
    const authorIds = thesis.authors.map(a => a.id);
    const isAuthor = authorIds.includes(req.user.id);
    const isAdmin = req.user.role === 'admin';
    const isAdviser = req.user.role === 'adviser';
    const isAdviserInDepartment = isAdviser && req.user.department && thesis.department === req.user.department;
    
    if (!isAuthor && !isAdmin && !isAdviserInDepartment) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this thesis'
      });
    }

    // Status update permissions
    if (req.body.status) {
      // Prevent admins from approving theses directly - only advisers can approve
      if (req.body.status === 'Approved' && isAdmin && !isAdviserInDepartment) {
        return res.status(403).json({
          success: false,
          message: 'Admins cannot approve theses directly. Only advisers can approve theses. Admins can only publish already-approved theses.'
        });
      }

      // Only admins can publish theses, and only if they are Approved
      if (req.body.status === 'Published') {
        if (!isAdmin) {
          return res.status(403).json({
            success: false,
            message: 'Only administrators can publish theses. Advisers can approve or reject.'
          });
        }
        // Admins can only publish theses that are Approved (not Rejected)
        if (thesis.status !== 'Approved') {
          return res.status(400).json({
            success: false,
            message: 'Only approved theses can be published. The thesis must be approved by an adviser first. Current status: ' + thesis.status
          });
        }
      }
      
      // Advisers can only approve or reject theses in their department (from Under Review status)
      if (isAdviserInDepartment && !isAdmin) {
        if (req.body.status !== 'Approved' && req.body.status !== 'Rejected') {
          return res.status(403).json({
            success: false,
            message: 'Advisers can only approve or reject theses. Only administrators can publish.'
          });
        }
        // Advisers can only approve/reject theses that are Under Review
        if (thesis.status !== 'Under Review') {
          return res.status(400).json({
            success: false,
            message: 'Advisers can only approve or reject theses that are under review.'
          });
        }
      }
      
      // Authors can only update status to "Under Review" from "Draft"
      if (isAuthor && !isAdmin && !isAdviserInDepartment) {
        if (req.body.status !== 'Under Review' || thesis.status !== 'Draft') {
          return res.status(400).json({
            success: false,
            message: 'Authors can only submit theses for review (change status from Draft to Under Review).'
          });
        }
      }
    }

    // Only allow content updates if thesis is in draft status (unless admin or adviser approving/rejecting)
    if (thesis.status !== 'Draft' && !isAdmin && !isAdviserInDepartment && !req.body.status) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update thesis content that is not in draft status'
      });
    }

    const updateData = {};
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.abstract) updateData.abstract = req.body.abstract;
    if (req.body.keywords) updateData.keywords = req.body.keywords;
    if (req.body.department) updateData.department = req.body.department;
    if (req.body.program) updateData.program = req.body.program;
    if (req.body.academicYear) updateData.academic_year = req.body.academicYear;
    if (req.body.semester) updateData.semester = req.body.semester;
    if (req.body.category) updateData.category = req.body.category;
    if (req.body.adviserId) updateData.adviser_id = req.body.adviserId;
    if (req.body.status) {
      updateData.status = req.body.status;
      
      // If status is being set to Approved, record the reviewer (adviser)
      if (req.body.status === 'Approved' && isAdviserInDepartment) {
        updateData.reviewer_id = req.user.id;
        updateData.reviewed_at = new Date();
        if (req.body.reviewComments) updateData.review_comments = req.body.reviewComments;
        if (req.body.reviewScore) updateData.review_score = req.body.reviewScore;
      }
      
      // If status is being set to Published by admin, set published_at
      if (req.body.status === 'Published' && isAdmin) {
        updateData.published_at = new Date();
        updateData.is_public = true;
      }
    }
    
    // Only admins can change isPublic manually (but it's auto-set when publishing)
    if (req.body.isPublic !== undefined && isAdmin && req.body.status !== 'Published') {
      updateData.is_public = req.body.isPublic;
    }
    // If adviser approves, don't automatically make it public (admin must publish)
    // If adviser rejects, keep current is_public status

    // Update thesis
    await thesis.update(updateData);

    // Reload with associations
    await thesis.reload({
      include: [
        {
          model: User,
          as: 'authors',
          attributes: ['id', 'firstName', 'lastName'],
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'adviser',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Thesis updated successfully',
      data: thesis
    });
  } catch (error) {
    console.error('Update thesis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete thesis - ALL ROLES CAN DELETE (authors and admin)
// @route   DELETE /api/thesis/:id
// @access  Private (Authors, Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const thesis = await Thesis.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'authors',
          attributes: ['id'],
          through: { attributes: [] }
        }
      ]
    });

    if (!thesis) {
      return res.status(404).json({
        success: false,
        message: 'Thesis not found'
      });
    }

    // Check if user is author or admin
    const authorIds = thesis.authors.map(a => a.id);
    const isAuthor = authorIds.includes(req.user.id);
    
    if (!isAuthor && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this thesis'
      });
    }

    await thesis.destroy();

    res.json({
      success: true,
      message: 'Thesis deleted successfully'
    });
  } catch (error) {
    console.error('Delete thesis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Submit thesis for review
// @route   PUT /api/thesis/:id/submit
// @access  Private (Thesis authors)
// NOTE: This route MUST come before /:id to avoid route conflicts
router.put('/:id/submit', protect, async (req, res) => {
  try {
    const thesis = await Thesis.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'authors',
          attributes: ['id'],
          through: { attributes: [] }
        }
      ]
    });

    if (!thesis) {
      return res.status(404).json({
        success: false,
        message: 'Thesis not found'
      });
    }

    // Check if user is author
    const authorIds = thesis.authors.map(a => a.id);
    if (!authorIds.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to submit this thesis'
      });
    }

    // Check if thesis has required document (optional check)
    if (!thesis.main_document) {
      return res.status(400).json({
        success: false,
        message: 'Main document is recommended before submission'
      });
    }

    // Update status
    thesis.status = 'Under Review';
    thesis.submitted_at = new Date();
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


module.exports = router;
