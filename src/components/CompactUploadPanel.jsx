import { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadVideoToCloudinary, validateVideoFile, formatFileSize, formatDuration } from '../utils/cloudinaryHelper';
import { INDUSTRIES } from '../context/VideoContext';

export default function CompactUploadPanel({ onUploadSuccess, onEditModeChange, editingVideo, onUpdateVideo }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    description: '',
    industries: [],
    customTags: '',
  });

  // Handle when editingVideo prop changes
  useEffect(() => {
    if (editingVideo) {
      // Populate form with video data
      setFormData({
        title: editingVideo.title || '',
        clientName: editingVideo.clientName || '',
        description: editingVideo.description || '',
        industries: editingVideo.industries || [],
        customTags: editingVideo.customTags?.join(', ') || '',
      });
      setIsEditMode(true);
      setUploadedFile(null);
      setUploadedData(null);
      setError(null);
      if (onEditModeChange) {
        onEditModeChange(true);
      }
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [editingVideo, onEditModeChange]);

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

    if (isEditMode && editingVideo) {
      // UPDATE MODE - don't require video file
      const updatedData = {
        title: formData.title,
        clientName: formData.clientName,
        description: formData.description,
        industries: formData.industries,
        customTags: formData.customTags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0),
      };

      if (onUpdateVideo) {
        onUpdateVideo(editingVideo.id, updatedData);
      }

      handleCancel();
    } else {
      // CREATE MODE - require video file
      if (!uploadedData) {
        setError('Please upload a video first');
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
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', clientName: '', description: '', industries: [], customTags: '' });
    setUploadedFile(null);
    setUploadedData(null);
    setUploadProgress(0);
    setIsEditMode(false);
    setError(null);
    if (onEditModeChange) {
      onEditModeChange(false);
    }
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

      {/* MAIN 2-COLUMN GRID - Always visible */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '2rem',
        alignItems: 'start',
      }}>
        {/* LEFT COLUMN: Upload Zone OR Video Preview */}
        <div style={{
          borderRadius: '12px',
          padding: uploadedFile ? '1rem' : '2rem',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          aspectRatio: '1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: uploadedFile ? '1px solid rgba(8, 145, 178, 0.3)' : (dragActive ? '2px solid #0891b2' : '2px dashed rgba(255, 255, 255, 0.2)'),
          background: uploadedFile ? 'rgba(8, 145, 178, 0.08)' : (dragActive ? 'rgba(8, 145, 178, 0.1)' : 'transparent'),
          cursor: uploadedFile ? 'default' : 'pointer',
          overflow: 'hidden',
        }}
          {...(uploadedFile ? {} : { onDragEnter: handleDrag, onDragLeave: handleDrag, onDragOver: handleDrag, onDrop: handleDrop })}
        >
          {/* IF NO FILE: Show Drop Zone */}
          {!uploadedFile && (
            <>
              <input
                type="file"
                onChange={handleFileInput}
                accept="video/*"
                style={{ display: 'none' }}
                id="video-input-compact"
                disabled={uploading}
              />

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

          {/* IF FILE: Show Video Preview + File Info */}
          {uploadedFile && (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '0.75rem',
            }}>
              {/* Video Preview with Local File */}
              <video
                src={URL.createObjectURL(uploadedFile)}
                muted
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  aspectRatio: '16 / 9',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                }}
              />

              {/* Show Upload Progress if Still Uploading */}
              {uploading && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '3px solid rgba(8, 145, 178, 0.2)',
                    borderTopColor: '#0891b2',
                    animation: 'spin 1s linear infinite',
                  }} />
                  <p style={{ fontSize: '0.75rem', color: '#cbd5e1', margin: 0 }}>
                    {uploadProgress}% uploading...
                  </p>
                </div>
              )}

              {/* File Info */}
              {!uploading && (
                <div style={{
                  width: '100%',
                  fontSize: '0.75rem',
                  color: '#cbd5e1',
                  textAlign: 'left',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                  <p style={{ margin: '0.5rem 0 0 0' }}>
                    <strong>{uploadedFile?.name}</strong>
                  </p>
                  <p style={{ margin: '0.25rem 0', color: '#9ca3af' }}>
                    {formatFileSize(uploadedFile?.size)}
                  </p>
                  {uploadedData && (
                    <>
                      <p style={{ margin: '0.25rem 0', color: '#9ca3af' }}>
                        {uploadedData.width}x{uploadedData.height} · {formatDuration(uploadedData.duration)}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Form Fields (ALWAYS Visible) */}
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

            {/* Row 4: Upload Button + Cancel Button (if in edit mode) */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              {isEditMode && (
                <button
                  onClick={handleCancel}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'transparent',
                    color: '#cbd5e1',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
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
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  Cancel
                </button>
              )}
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
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#06b6d4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#0891b2';
                }}
              >
                {isEditMode ? 'Update Video' : 'Upload Video'}
              </button>
            </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
