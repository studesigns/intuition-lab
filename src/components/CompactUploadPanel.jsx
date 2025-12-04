import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadVideoToCloudinary, validateVideoFile, formatFileSize, formatDuration } from '../utils/cloudinaryHelper';
import { INDUSTRIES } from '../context/VideoContext';

export default function CompactUploadPanel({ onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    description: '',
    industries: [],
    customTags: '',
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    setError(null);
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
      setError(err.message || 'Upload failed');
      setUploading(false);
      setUploadedFile(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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

    if (onUploadSuccess) {
      onUploadSuccess(videoData);
    }

    setFormData({ title: '', clientName: '', description: '', industries: [], customTags: '' });
    setUploadedFile(null);
    setUploadedData(null);
    setUploadProgress(0);
  };

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.4)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '2rem',
    }}>
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
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {!uploadedData ? (
        /* 2-Column Layout */
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '2rem',
          alignItems: 'start',
        }}>
          {/* Left: Upload Zone (col-span-4 equivalent) */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              border: dragActive ? '2px solid #0891b2' : '2px dashed rgba(255, 255, 255, 0.2)',
              background: dragActive ? 'rgba(8, 145, 178, 0.1)' : 'transparent',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              aspectRatio: '1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <input
              type="file"
              onChange={handleFileInput}
              accept="video/*"
              style={{ display: 'none' }}
              id="video-input-compact"
              disabled={uploading}
            />

            {uploading ? (
              <div>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  border: '3px solid rgba(8, 145, 178, 0.2)',
                  borderTopColor: '#0891b2',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem',
                }} />
                <p style={{ fontSize: '0.875rem', color: '#cbd5e1', margin: '0.5rem 0' }}>
                  {uploadProgress}%
                </p>
              </div>
            ) : (
              <>
                <Upload size={40} color="#22d3ee" style={{ marginBottom: '1rem' }} />
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#ffffff', margin: '0 0 0.5rem 0' }}>
                  Drag video here
                </p>
                <label
                  htmlFor="video-input-compact"
                  style={{
                    display: 'inline-block',
                    marginTop: '0.75rem',
                    padding: '0.5rem 1rem',
                    background: '#0891b2',
                    color: '#ffffff',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                  }}
                >
                  Browse
                </label>
              </>
            )}
          </div>

          {/* Right: Form Fields (col-span-8 equivalent) */}
          <div>
            {/* Row 1: Title (50%) + Client Name (50%) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#cbd5e1',
                  marginBottom: '0.25rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Video title"
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '6px',
                    padding: '0.5rem',
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
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#cbd5e1',
                  marginBottom: '0.25rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Client
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Client name"
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '6px',
                    padding: '0.5rem',
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
            </div>

            {/* Row 2: Description (Full width, short) */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: '500',
                color: '#cbd5e1',
                marginBottom: '0.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description..."
                style={{
                  width: '100%',
                  background: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '6px',
                  padding: '0.5rem',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                  minHeight: '50px',
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

            {/* Row 3: Industries + Tags */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: '500',
                color: '#cbd5e1',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Industries
              </label>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
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
                      padding: '0.4rem 0.75rem',
                      background: formData.industries.includes(industry)
                        ? 'rgba(8, 145, 178, 0.8)'
                        : 'transparent',
                      border: formData.industries.includes(industry)
                        ? '1px solid #0891b2'
                        : '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: formData.industries.includes(industry)
                        ? '#ffffff'
                        : '#cbd5e1',
                      fontSize: '0.75rem',
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
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: '500',
                color: '#cbd5e1',
                marginBottom: '0.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Custom Tags
              </label>
              <input
                type="text"
                value={formData.customTags}
                onChange={(e) => setFormData({ ...formData, customTags: e.target.value })}
                placeholder="animation, mobile-app, demo"
                style={{
                  width: '100%',
                  background: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '6px',
                  padding: '0.5rem',
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

            {/* Row 4: Upload Button (Aligned Right) */}
            <button
              onClick={handleSubmit}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#0891b2',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                float: 'right',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#06b6d4';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#0891b2';
              }}
            >
              Upload Video
            </button>
            <div style={{ clear: 'both' }} />
          </div>
        </div>
      ) : (
        /* Video Info Display */
        <div style={{
          background: 'rgba(8, 145, 178, 0.1)',
          border: '1px solid rgba(8, 145, 178, 0.2)',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1rem',
          fontSize: '0.875rem',
          color: '#cbd5e1',
        }}>
          <p style={{ margin: '0 0 0.5rem 0' }}>
            <strong>File:</strong> {uploadedFile?.name} ({formatFileSize(uploadedFile?.size)})
          </p>
          <p style={{ margin: '0 0 0.5rem 0' }}>
            <strong>Duration:</strong> {formatDuration(uploadedData.duration)}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Resolution:</strong> {uploadedData.width}x{uploadedData.height}
          </p>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
