const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const ensureUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    // Determine upload path based on file type
    if (file.fieldname === 'avatar') {
      uploadPath += 'avatars/';
    } else if (file.fieldname === 'thesisDocument') {
      uploadPath += 'thesis/documents/';
    } else if (file.fieldname === 'supplementaryFiles') {
      uploadPath += 'thesis/supplementary/';
    } else if (file.fieldname === 'calendarAttachments') {
      uploadPath += 'calendar/attachments/';
    } else {
      uploadPath += 'general/';
    }
    
    ensureUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + extension;
    cb(null, filename);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedMimes = {
    avatar: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    thesisDocument: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    supplementaryFiles: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'text/plain',
      'application/zip',
      'application/x-rar-compressed'
    ],
    calendarAttachments: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'text/plain'
    ]
  };

  const fieldAllowedMimes = allowedMimes[file.fieldname] || allowedMimes.supplementaryFiles;
  
  if (fieldAllowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types for ${file.fieldname}: ${fieldAllowedMimes.join(', ')}`), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 10 // Maximum 10 files
  },
  fileFilter: fileFilter
});

// Specific upload configurations
const uploadAvatar = upload.single('avatar');
const uploadThesisDocument = upload.single('thesisDocument');
const uploadSupplementaryFiles = upload.array('supplementaryFiles', 5);
const uploadCalendarAttachments = upload.array('calendarAttachments', 3);

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size allowed is 10MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 10 files allowed.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name for file upload.'
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
};

// Helper function to delete file
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Helper function to get file info
const getFileInfo = (file) => {
  if (!file) return null;
  
  return {
    filename: file.filename,
    originalName: file.originalname,
    path: file.path,
    size: file.size,
    mimetype: file.mimetype,
    uploadedAt: new Date()
  };
};

module.exports = {
  upload,
  uploadAvatar,
  uploadThesisDocument,
  uploadSupplementaryFiles,
  uploadCalendarAttachments,
  handleUploadError,
  deleteFile,
  getFileInfo
};
