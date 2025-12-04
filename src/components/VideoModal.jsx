import { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { formatDuration, formatFileSize } from '../utils/cloudinaryHelper';

export default function VideoModal({ video, onClose }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset error when video changes
    setError(null);
    console.log('VideoModal opened with video:', video?.title);
  }, [video?.id]);

  if (!video) {
    console.log('VideoModal: no video provided');
    return null;
  }

  console.log('VideoModal rendering for:', video.title, 'Video object:', video);

  if (error) {
    console.error('VideoModal error state:', error);
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          padding: '1rem',
        }}
        onClick={onClose}
      >
        <div
          style={{
            backgroundColor: '#0f172a',
            border: '1px solid rgba(220, 38, 38, 0.4)',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '500px',
            textAlign: 'center',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 style={{ color: '#ffffff', marginBottom: '1rem' }}>Error Loading Video</h2>
          <p style={{ color: '#cbd5e1', marginBottom: '1.5rem' }}>{error}</p>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#0891b2',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  try {
    return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 1001,
          backgroundColor: '#0f172a',
          border: '2px solid rgba(8, 145, 178, 0.6)',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '1200px',
          width: '95%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 0 40px rgba(8, 145, 178, 0.3), 0 0 60px rgba(8, 145, 178, 0.1), 0 0 80px rgba(8, 145, 178, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            width: '40px',
            height: '40px',
            background: 'rgba(100, 116, 139, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 1002,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(220, 38, 38, 0.8)';
            e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(100, 116, 139, 0.5)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <X size={20} color="#ffffff" />
        </button>

        {/* Video Player */}
        <div style={{
          width: '100%',
          background: '#000000',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '2rem',
          border: '1px solid rgba(8, 145, 178, 0.5)',
          boxShadow: '0 8px 32px rgba(8, 145, 178, 0.3)',
          position: 'relative',
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '56.25%',
            backgroundColor: '#000000',
          }}>
            <video
              ref={videoRef}
              src={video.cloudinaryUrl}
              poster={video.thumbnailUrl}
              controls
              autoPlay
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'block',
              }}
            />
          </div>
        </div>

        {/* Metadata Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Left: Title and Description */}
          <div>
            {/* Title */}
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#ffffff',
              margin: '0 0 0.5rem 0',
            }}>
              {video.title}
            </h1>

            {/* Client Name */}
            <p style={{
              fontSize: '1rem',
              color: '#22d3ee',
              margin: '0 0 1.5rem 0',
              fontWeight: '500',
            }}>
              Client: {video.clientName}
            </p>

            {/* Description */}
            {video.description && (
              <div>
                <h3 style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#cbd5e1',
                  margin: '0 0 0.5rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Description
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: '#e2e8f0',
                  margin: '0 0 1.5rem 0',
                  lineHeight: '1.6',
                }}>
                  {video.description}
                </p>
              </div>
            )}

            {/* Industry Badges */}
            {video.industries && video.industries.length > 0 && (
              <div>
                <h3 style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#cbd5e1',
                  margin: '0 0 0.75rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Industries
                </h3>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}>
                  {video.industries.map(industry => (
                    <span
                      key={industry}
                      style={{
                        display: 'inline-block',
                        background: 'rgba(8, 145, 178, 0.2)',
                        color: '#22d3ee',
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        border: '1px solid rgba(8, 145, 178, 0.3)',
                      }}
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Video Details */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(8, 145, 178, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(8, 145, 178, 0.1)',
          }}>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#cbd5e1',
              margin: '0 0 1rem 0',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Video Details
            </h3>

            {/* Details Grid */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              {/* Duration */}
              <div>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#9ca3af',
                  margin: '0 0 0.25rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                }}>
                  Duration
                </p>
                <p style={{
                  fontSize: '1rem',
                  color: '#e2e8f0',
                  margin: 0,
                  fontWeight: '600',
                }}>
                  {formatDuration(video.duration)}
                </p>
              </div>

              {/* Resolution */}
              {video.width && video.height && (
                <div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    margin: '0 0 0.25rem 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                  }}>
                    Resolution
                  </p>
                  <p style={{
                    fontSize: '1rem',
                    color: '#e2e8f0',
                    margin: 0,
                    fontWeight: '600',
                  }}>
                    {video.width}x{video.height}
                  </p>
                </div>
              )}

              {/* File Size */}
              {video.fileSize && (
                <div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    margin: '0 0 0.25rem 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                  }}>
                    File Size
                  </p>
                  <p style={{
                    fontSize: '1rem',
                    color: '#e2e8f0',
                    margin: 0,
                    fontWeight: '600',
                  }}>
                    {formatFileSize(video.fileSize)}
                  </p>
                </div>
              )}

              {/* Format */}
              {video.format && (
                <div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    margin: '0 0 0.25rem 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                  }}>
                    Format
                  </p>
                  <p style={{
                    fontSize: '1rem',
                    color: '#e2e8f0',
                    margin: 0,
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}>
                    {video.format}
                  </p>
                </div>
              )}

              {/* Upload Date */}
              {video.createdAt && (
                <div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    margin: '0 0 0.25rem 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                  }}>
                    Uploaded
                  </p>
                  <p style={{
                    fontSize: '1rem',
                    color: '#e2e8f0',
                    margin: 0,
                    fontWeight: '600',
                  }}>
                    {(() => {
                      try {
                        const dateObj = video.createdAt.toDate?.() || video.createdAt;
                        return new Date(dateObj).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        });
                      } catch (e) {
                        return 'Date unavailable';
                      }
                    })()}
                  </p>
                </div>
              )}
            </div>

            {/* Custom Tags */}
            {video.customTags && video.customTags.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#9ca3af',
                  margin: '0 0 0.75rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                }}>
                  Tags
                </p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}>
                  {video.customTags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        display: 'inline-block',
                        background: 'rgba(100, 116, 139, 0.3)',
                        color: '#cbd5e1',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    );
  } catch (err) {
    console.error('VideoModal render error:', err);
    setError(`Rendering error: ${err.message}`);
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          padding: '1rem',
        }}
        onClick={onClose}
      >
        <div
          style={{
            backgroundColor: '#0f172a',
            border: '1px solid rgba(220, 38, 38, 0.4)',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '500px',
            textAlign: 'center',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 style={{ color: '#ffffff', marginBottom: '1rem' }}>Error Loading Video</h2>
          <p style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>{err.message}</p>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Check the browser console for details.</p>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#0891b2',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }
}
