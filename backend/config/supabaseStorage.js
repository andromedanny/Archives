/**
 * Supabase Storage Configuration
 * Free file storage (1GB free tier)
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseBucket = process.env.SUPABASE_STORAGE_BUCKET || 'thesis-documents';

let supabaseClient = null;

if (supabaseUrl && supabaseKey) {
  supabaseClient = createClient(supabaseUrl, supabaseKey);
  console.log('Supabase Storage client initialized:', {
    url: supabaseUrl,
    bucket: supabaseBucket,
    hasKey: !!supabaseKey
  });
} else {
  console.warn('Supabase Storage client NOT initialized. Missing:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey
  });
}

/**
 * Upload file to Supabase Storage
 * @param {Object} file - Multer file object or buffer
 * @param {String} folder - Folder path (e.g., 'thesis/documents')
 * @returns {Promise<Object>} File info object
 */
async function uploadFile(file, folder = '') {
  if (!supabaseClient) {
    throw new Error('Supabase client not initialized. Set SUPABASE_URL and SUPABASE_KEY environment variables.');
  }

  try {
    const fs = require('fs');
    const path = require('path');
    
    // Read file if it's a file path
    let fileBuffer;
    let fileName;
    let fileMimeType;
    
    if (typeof file === 'string') {
      // File path
      fileBuffer = fs.readFileSync(file);
      fileName = path.basename(file);
      fileMimeType = 'application/octet-stream';
    } else if (file.buffer) {
      // Multer file object with buffer
      fileBuffer = file.buffer;
      fileName = file.originalname || file.filename;
      fileMimeType = file.mimetype;
    } else if (file.path) {
      // Multer file object with path
      fileBuffer = fs.readFileSync(file.path);
      fileName = file.filename || file.originalname;
      fileMimeType = file.mimetype;
    } else {
      throw new Error('Invalid file object');
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(fileName);
    const baseName = path.basename(fileName, extension);
    const uniqueFileName = `${baseName}-${uniqueSuffix}${extension}`;
    
    // Construct storage path
    const storagePath = folder ? `${folder}/${uniqueFileName}` : uniqueFileName;

    // Upload to Supabase Storage
    console.log(`Uploading to Supabase Storage: bucket=${supabaseBucket}, path=${storagePath}, size=${fileBuffer.length} bytes`);
    const { data, error } = await supabaseClient.storage
      .from(supabaseBucket)
      .upload(storagePath, fileBuffer, {
        contentType: fileMimeType,
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      console.error('Error code:', error.error || error.message);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('Supabase upload successful:', data);

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from(supabaseBucket)
      .getPublicUrl(storagePath);
    
    console.log('Supabase file URL:', urlData.publicUrl);

    // Delete local file if it exists
    if (file.path && fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error('Error deleting local file:', err);
      }
    }

    return {
      filename: uniqueFileName,
      originalName: fileName,
      path: storagePath,
      size: fileBuffer.length,
      mimetype: fileMimeType,
      url: urlData.publicUrl,
      uploadedAt: new Date()
    };
  } catch (error) {
    console.error('Supabase upload error:', error);
    throw error;
  }
}

/**
 * Delete file from Supabase Storage
 * @param {String} filePath - File path in storage
 * @returns {Promise<Boolean>} Success status
 */
async function deleteFile(filePath) {
  if (!supabaseClient) {
    throw new Error('Supabase client not initialized');
  }

  try {
    const { error } = await supabaseClient.storage
      .from(supabaseBucket)
      .remove([filePath]);

    if (error) {
      console.error('Supabase delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Supabase delete error:', error);
    return false;
  }
}

/**
 * Get file URL
 * @param {String} filePath - File path in storage
 * @returns {String} File URL
 */
function getFileUrl(filePath) {
  if (!supabaseClient) {
    return null;
  }

  const { data } = supabaseClient.storage
    .from(supabaseBucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Calculate file checksum (for integrity checks)
 * @param {Buffer} fileBuffer - File buffer
 * @returns {String} SHA256 checksum
 */
async function calculateChecksum(fileBuffer) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

module.exports = {
  uploadFile,
  deleteFile,
  getFileUrl,
  calculateChecksum,
  isConfigured: () => !!supabaseClient
};

