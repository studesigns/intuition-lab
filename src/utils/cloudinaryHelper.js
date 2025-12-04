/**
 * Cloudinary Upload Helper
 * Handles video uploads to Cloudinary using unsigned uploads
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadVideoToCloudinary = async (file, onProgress) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'visual-vault');
    formData.append('resource_type', 'video');

    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      });
    }

    return new Promise((resolve, reject) => {
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);

          // Extract video metadata
          const videoData = {
            cloudinaryPublicId: response.public_id,
            cloudinaryUrl: response.secure_url,
            duration: response.duration || 0,
            width: response.width || 1920,
            height: response.height || 1080,
            format: response.format || 'mp4',
            fileSize: response.bytes || 0,
            thumbnailUrl: generateThumbnailUrl(response.public_id),
          };

          resolve(videoData);
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });

      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`);
      xhr.send(formData);
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Generate thumbnail URL from Cloudinary public ID
 * Uses the 2.5 second mark of the video as thumbnail
 */
export const generateThumbnailUrl = (publicId) => {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_2.5,w_400,h_300,c_scale,f_auto,q_auto/${publicId}.jpg`;
};

/**
 * Format video duration from seconds to MM:SS format
 */
export const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Validate video file before upload
 */
export const validateVideoFile = (file) => {
  const maxFileSize = 100 * 1024 * 1024; // 100 MB
  const allowedFormats = ['video/mp4', 'video/quicktime', 'video/webm', 'video/avi'];

  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (file.size > maxFileSize) {
    return { valid: false, error: `File too large. Maximum size is 100MB (your file is ${(file.size / 1024 / 1024).toFixed(2)}MB)` };
  }

  if (!allowedFormats.includes(file.type)) {
    return { valid: false, error: `Invalid format. Allowed formats: MP4, MOV, WebM, AVI (your file is ${file.type})` };
  }

  return { valid: true };
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

/**
 * Convert file size to human readable format
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
