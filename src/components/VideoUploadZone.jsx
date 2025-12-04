import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import { uploadVideoToCloudinary, validateVideoFile, formatFileSize } from '../utils/cloudinaryHelper';
import { INDUSTRIES } from '../context/VideoContext';

export default function VideoUploadZone({ onUploadSuccess, compact = false }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const [error, setError] = useState(null);

  // Form state for metadata
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    description: '',
    industries: [],
    customTags: '',
  });

  // Compact mode styles
  const compactContainerStyle = {
    background: 'transparent',
    border: 'none',
    padding: 0,
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  // Handle file input change
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // Upload file to Cloudinary
  const handleFileUpload = async (file) => {
    setError(null);

    // Validate file
    const validation = validateVideoFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadedFile(file);

    try {
      const videoData = await uploadVideoToCloudinary(file, (progress) => {
        setUploadProgress(progress);
      });

      setUploadedData(videoData);
      setUploading(false);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
      setUploading(false);
      setUploadedFile(null);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.clientName.trim()) {
      setError('Client name is required');
      return;
    }
    if (formData.industries.length === 0) {
      setError('Please select at least one industry');
      return;
    }

    // Prepare video data
    const videoData = {
      ...uploadedData,
      title: formData.title,
      clientName: formData.clientName,
      description: formData.description,
      industries: formData.industries,
      customTags: formData.customTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0),
      isFeatured: false,
      featuredOrder: 0,
    };

    // Call callback
    if (onUploadSuccess) {
      onUploadSuccess(videoData);
    }

    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      clientName: '',
      description: '',
      industries: [],
      customTags: '',
    });
    setUploadedFile(null);
    setUploadedData(null);
    setUploadProgress(0);
    setError(null);
  };

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.4)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '2rem',
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: '2rem',
        margin: '0 0 2rem 0',
      }}>
        Upload New Video
      </h2>

      {/* Error Message */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem',
          color: '#fca5a5',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#fca5a5',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {!uploadedData ? (
        /* Upload Zone */
        <motion.div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: dragActive
              ? '2px solid #0891b2'
              : '2px dashed rgba(255, 255, 255, 0.2)',
            background: dragActive
              ? 'rgba(8, 145, 178, 0.1)'
              : 'transparent',
            borderRadius: '12px',
            padding: '3rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
          }}
          whileHover={{ borderColor: '#0891b2' }}
        >
          <input
            type="file"
            onChange={handleFileInput}
            accept="video/*"
            style={{ display: 'none' }}
            id="video-input"
            disabled={uploading}
          />

          {uploading ? (
            // Upload Progress
            <div>
              <div style={{
                display: 'inline-block',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '3px solid rgba(8, 145, 178, 0.2)',
                borderTopColor: '#0891b2',
                animation: 'spin 1s linear infinite',
                marginBottom: '1rem',
              }} />

              <p style={{
                fontSize: '1rem',
                color: '#cbd5e1',
                margin: '1rem 0',
                fontWeight: '600',
              }}>
                Uploading: {uploadedFile?.name}
              </p>

              {/* Progress Bar */}
              <div style={{
                width: '100%',
                height: '8px',
                background: 'rgba(100, 116, 139, 0.2)',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '0.5rem',
              }}>
                <div style={{
                  height: '100%',
                  width: `${uploadProgress}%`,
                  background: 'linear-gradient(90deg, #0891b2, #22d3ee)',
                  transition: 'width 0.3s ease',
                }} />
              </div>

              <p style={{
                fontSize: '0.875rem',
                color: '#9ca3af',
                margin: 0,
              }}>
                {uploadProgress}%
              </p>

              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : (
            // Upload Prompt
            <>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'rgba(8, 145, 178, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}>
                <Upload size={40} color="#22d3ee" />
              </div>

              <p style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#ffffff',
                margin: '0 0 0.5rem 0',
              }}>
                Drag your video here or click to browse
              </p>

              <p style={{
                fontSize: '0.875rem',
                color: '#9ca3af',
                margin: 0,
              }}>
                Supported formats: MP4, MOV, WebM • Max size: 100MB
              </p>

              <label
                htmlFor="video-input"
                style={{
                  display: 'inline-block',
                  marginTop: '1.5rem',
                  padding: '0.75rem 1.5rem',
                  background: '#0891b2',
                  color: '#ffffff',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#06b6d4';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(8, 145, 178, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#0891b2';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Choose File
              </label>
            </>
          )}
        </motion.div>
      ) : (
        /* Metadata Form */
        <form onSubmit={handleSubmit}>
          {/* Thumbnail Preview */}
          <div style={{
            marginBottom: '2rem',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: '#000000',
            maxHeight: '300px',
          }}>
            <img
              src={uploadedData.thumbnailUrl}
              alt="Video thumbnail"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>

          {/* Video Info */}
          <div style={{
            background: 'rgba(8, 145, 178, 0.1)',
            border: '1px solid rgba(8, 145, 178, 0.2)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '2rem',
            fontSize: '0.875rem',
            color: '#cbd5e1',
          }}>
            <p style={{ margin: '0 0 0.5rem 0' }}>
              <strong>File:</strong> {uploadedFile?.name} ({formatFileSize(uploadedFile?.size)})
            </p>
            <p style={{ margin: '0 0 0.5rem 0' }}>
              <strong>Duration:</strong> {Math.floor(uploadedData.duration / 60)}:{String(Math.floor(uploadedData.duration % 60)).padStart(2, '0')}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Resolution:</strong> {uploadedData.width}x{uploadedData.height}
            </p>
          </div>

          {/* Title */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#cbd5e1',
              marginBottom: '0.5rem',
            }}>
              Video Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Product Demo Explainer"
              style={{
                width: '100%',
                background: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                padding: '0.75rem',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.background = '#334155';
                e.target.style.borderColor = '#0891b2';
              }}
              onBlur={(e) => {
                e.target.style.background = '#1e293b';
                e.target.style.borderColor = '#475569';
              }}
            />
          </div>

          {/* Client Name */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#cbd5e1',
              marginBottom: '0.5rem',
            }}>
              Client Name *
            </label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              placeholder="e.g., Acme Corp"
              style={{
                width: '100%',
                background: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                padding: '0.75rem',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.background = '#334155';
                e.target.style.borderColor = '#0891b2';
              }}
              onBlur={(e) => {
                e.target.style.background = '#1e293b';
                e.target.style.borderColor = '#475569';
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#cbd5e1',
              marginBottom: '0.5rem',
            }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Briefly describe the video and its purpose..."
              style={{
                width: '100%',
                background: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                padding: '0.75rem',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
                minHeight: '100px',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
              onFocus={(e) => {
                e.target.style.background = '#334155';
                e.target.style.borderColor = '#0891b2';
              }}
              onBlur={(e) => {
                e.target.style.background = '#1e293b';
                e.target.style.borderColor = '#475569';
              }}
            />
          </div>

          {/* Industries */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#cbd5e1',
              marginBottom: '0.75rem',
            }}>
              Industries * (select at least one)
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '0.75rem',
            }}>
              {INDUSTRIES.map(industry => (
                <button
                  key={industry}
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      industries: formData.industries.includes(industry)
                        ? formData.industries.filter(i => i !== industry)
                        : [...formData.industries, industry]
                    });
                  }}
                  style={{
                    padding: '0.75rem',
                    background: formData.industries.includes(industry)
                      ? 'rgba(8, 145, 178, 0.8)'
                      : 'transparent',
                    border: formData.industries.includes(industry)
                      ? '1px solid #0891b2'
                      : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: formData.industries.includes(industry)
                      ? '#ffffff'
                      : '#cbd5e1',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!formData.industries.includes(industry)) {
                      e.currentTarget.style.borderColor = '#0891b2';
                      e.currentTarget.style.background = 'rgba(8, 145, 178, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!formData.industries.includes(industry)) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Tags */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#cbd5e1',
              marginBottom: '0.5rem',
            }}>
              Custom Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.customTags}
              onChange={(e) => setFormData({ ...formData, customTags: e.target.value })}
              placeholder="e.g., animation, ui-demo, mobile-app"
              style={{
                width: '100%',
                background: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                padding: '0.75rem',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.background = '#334155';
                e.target.style.borderColor = '#0891b2';
              }}
              onBlur={(e) => {
                e.target.style.background = '#1e293b';
                e.target.style.borderColor = '#475569';
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
          }}>
            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: '0.75rem',
                background: 'transparent',
                color: '#cbd5e1',
                border: '1px solid #475569',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = '#475569';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '0.75rem',
                background: '#0891b2',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#06b6d4';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(8, 145, 178, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#0891b2';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Upload Video
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
