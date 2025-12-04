import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

export default function VideoModal({ video, onClose }) {
  if (!video) return null;

  const handleBackdropClick = (e) => {
    // Only close if clicking directly on the backdrop, not the content
    if (e.target === e.currentTarget) {
      console.log('Backdrop clicked, closing theatre mode');
      onClose();
    }
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  // Portal renders directly to document.body, escaping parent container constraints
  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
      onClick={handleBackdropClick}
    >
      {/* Theatre Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '900px',
          backgroundColor: '#0f172a',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 0 60px rgba(8, 145, 178, 0.6)',
          border: '2px solid rgba(8, 145, 178, 0.5)',
        }}
        onClick={handleContentClick}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 20,
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.9)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title="Close (click backdrop or press Esc)"
        >
          <X size={24} color="#ffffff" strokeWidth={3} />
        </button>

        {/* Video Player Section */}
        <div style={{
          width: '100%',
          backgroundColor: '#000000',
          aspectRatio: '16 / 9',
        }}>
          <video
            key={`video-${video.id}`}
            controls
            poster={video.thumbnailUrl}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              backgroundColor: '#000000',
            }}
          >
            <source src={video.cloudinaryUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Metadata Section */}
        <div style={{
          padding: '2rem',
          backgroundColor: '#0f172a',
          borderTop: '1px solid rgba(8, 145, 178, 0.2)',
        }}>
          {/* Title */}
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#ffffff',
            margin: '0 0 0.75rem 0',
          }}>
            {video.title}
          </h2>

          {/* Client Name */}
          <p style={{
            fontSize: '1.125rem',
            color: '#22d3ee',
            margin: '0 0 1rem 0',
            fontWeight: '500',
          }}>
            {video.clientName}
          </p>

          {/* Description (if available) */}
          {video.description && (
            <p style={{
              fontSize: '0.95rem',
              color: '#cbd5e1',
              lineHeight: '1.6',
              margin: '0 0 1rem 0',
            }}>
              {video.description}
            </p>
          )}

          {/* Industries (if available) */}
          {video.industries && video.industries.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginTop: '1rem',
            }}>
              {video.industries.map(industry => (
                <span
                  key={industry}
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'rgba(8, 145, 178, 0.2)',
                    color: '#22d3ee',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    border: '1px solid rgba(8, 145, 178, 0.4)',
                  }}
                >
                  {industry}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body // Portal target - renders at document.body level
  );
}
