/**
 * Cloud Storage Configuration
 * Supports AWS S3, Cloudinary, and Vercel Blob
 */

const fs = require('fs');
const path = require('path');

// Determine which storage to use
const STORAGE_TYPE = process.env.STORAGE_TYPE || 'local'; // 'local', 's3', 'cloudinary', 'blob', 'supabase'

/**
 * Upload file to cloud storage
 * @param {Object} file - Multer file object
 * @param {String} folder - Folder path (e.g., 'thesis/documents')
 * @returns {Promise<Object>} File info object
 */
async function uploadFile(file, folder = '') {
  if (STORAGE_TYPE === 'local') {
    return uploadToLocal(file, folder);
  } else if (STORAGE_TYPE === 'supabase') {
    return uploadToSupabase(file, folder);
  } else if (STORAGE_TYPE === 's3') {
    return uploadToS3(file, folder);
  } else if (STORAGE_TYPE === 'cloudinary') {
    return uploadToCloudinary(file, folder);
  } else if (STORAGE_TYPE === 'blob') {
    return uploadToBlob(file, folder);
  } else {
    throw new Error(`Unknown storage type: ${STORAGE_TYPE}`);
  }
}

/**
 * Delete file from cloud storage
 * @param {String} filePath - File path or URL
 * @returns {Promise<Boolean>} Success status
 */
async function deleteFile(filePath) {
  if (STORAGE_TYPE === 'local') {
    return deleteLocalFile(filePath);
  } else if (STORAGE_TYPE === 'supabase') {
    return deleteFromSupabase(filePath);
  } else if (STORAGE_TYPE === 's3') {
    return deleteFromS3(filePath);
  } else if (STORAGE_TYPE === 'cloudinary') {
    return deleteFromCloudinary(filePath);
  } else if (STORAGE_TYPE === 'blob') {
    return deleteFromBlob(filePath);
  } else {
    throw new Error(`Unknown storage type: ${STORAGE_TYPE}`);
  }
}

/**
 * Get file URL
 * @param {String} filePath - File path or identifier
 * @returns {String} File URL
 */
function getFileUrl(filePath) {
  if (STORAGE_TYPE === 'local') {
    // In production with separate backend, you'll need the backend URL
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    return `${backendUrl}/uploads/${filePath}`;
  } else if (STORAGE_TYPE === 'supabase') {
    return getSupabaseFileUrl(filePath);
  } else if (STORAGE_TYPE === 's3') {
    const bucket = process.env.AWS_S3_BUCKET;
    const region = process.env.AWS_REGION || 'us-east-1';
    return `https://${bucket}.s3.${region}.amazonaws.com/${filePath}`;
  } else if (STORAGE_TYPE === 'cloudinary') {
    return filePath; // Cloudinary returns full URL
  } else if (STORAGE_TYPE === 'blob') {
    return filePath; // Vercel Blob returns full URL
  } else {
    return filePath;
  }
}

// Local storage (development)
async function uploadToLocal(file, folder) {
  const uploadPath = path.join('uploads', folder);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  
  const filePath = path.join(uploadPath, file.filename);
  fs.renameSync(file.path, filePath);
  
  return {
    filename: file.filename,
    originalName: file.originalname,
    path: filePath,
    size: file.size,
    mimetype: file.mimetype,
    url: `/uploads/${folder}/${file.filename}`
  };
}

async function deleteLocalFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting local file:', error);
    return false;
  }
}

// AWS S3 storage
async function uploadToS3(file, folder) {
  const AWS = require('aws-sdk');
  
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1'
  });
  
  const fileContent = fs.readFileSync(file.path);
  const key = folder ? `${folder}/${file.filename}` : file.filename;
  
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: fileContent,
    ContentType: file.mimetype,
    ACL: 'public-read' // or 'private' for private files
  };
  
  const result = await s3.upload(params).promise();
  
  // Delete local file after upload
  fs.unlinkSync(file.path);
  
  return {
    filename: file.filename,
    originalName: file.originalname,
    path: key,
    size: file.size,
    mimetype: file.mimetype,
    url: result.Location
  };
}

async function deleteFromS3(filePath) {
  const AWS = require('aws-sdk');
  
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1'
  });
  
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: filePath
  };
  
  try {
    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    console.error('Error deleting from S3:', error);
    return false;
  }
}

// Cloudinary storage
async function uploadToCloudinary(file, folder) {
  const cloudinary = require('cloudinary').v2;
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  
  const fileContent = fs.readFileSync(file.path);
  const uploadPath = folder ? `${folder}/${file.filename}` : file.filename;
  
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: folder || 'uploads',
        resource_type: 'auto',
        public_id: file.filename.replace(/\.[^/.]+$/, '') // Remove extension
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          // Delete local file after upload
          fs.unlinkSync(file.path);
          
          resolve({
            filename: file.filename,
            originalName: file.originalname,
            path: result.public_id,
            size: result.bytes,
            mimetype: file.mimetype,
            url: result.secure_url
          });
        }
      }
    ).end(fileContent);
  });
}

async function deleteFromCloudinary(filePath) {
  const cloudinary = require('cloudinary').v2;
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  
  try {
    await cloudinary.uploader.destroy(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
}

// Vercel Blob storage
async function uploadToBlob(file, folder) {
  const { put } = require('@vercel/blob');
  
  const fileContent = fs.readFileSync(file.path);
  const blobPath = folder ? `${folder}/${file.filename}` : file.filename;
  
  const blob = await put(blobPath, fileContent, {
    access: 'public',
    contentType: file.mimetype
  });
  
  // Delete local file after upload
  fs.unlinkSync(file.path);
  
  return {
    filename: file.filename,
    originalName: file.originalname,
    path: blobPath,
    size: file.size,
    mimetype: file.mimetype,
    url: blob.url
  };
}

async function deleteFromBlob(filePath) {
  const { del } = require('@vercel/blob');
  
  try {
    await del(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting from Blob:', error);
    return false;
  }
}

// Supabase Storage (FREE - 1GB free tier)
async function uploadToSupabase(file, folder) {
  const { uploadFile: supabaseUpload } = require('./supabaseStorage');
  return await supabaseUpload(file, folder);
}

async function deleteFromSupabase(filePath) {
  const { deleteFile: supabaseDelete } = require('./supabaseStorage');
  return await supabaseDelete(filePath);
}

function getSupabaseFileUrl(filePath) {
  const { getFileUrl: supabaseGetUrl } = require('./supabaseStorage');
  return supabaseGetUrl(filePath);
}

module.exports = {
  uploadFile,
  deleteFile,
  getFileUrl,
  STORAGE_TYPE
};

