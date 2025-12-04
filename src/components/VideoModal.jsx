import { X } from 'lucide-react';

export default function VideoModal({ video, onClose }) {
  if (!video) return null;

  const handleBackdropClick = () => {
    console.log('Backdrop clicked, closing theatre mode');
    onClose();
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
          width: '100%',
          maxWidth: '900px',
          backgroundColor: '#000000',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 0 50px rgba(8, 145, 178, 0.5)',
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
            zIndex: 10000,
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
          title="Close (Esc or click outside)"
        >
          <X size={24} color="#ffffff" strokeWidth={3} />
        </button>

        {/* Video Player */}
        <div style={{ width: '100%', backgroundColor: '#000000' }}>
          <video
            key={`video-${video.id}`}
            width="100%"
            height="auto"
            controls
            poster={video.thumbnailUrl}
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              maxHeight: '70vh',
            }}
          >
            <source src={video.cloudinaryUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Metadata Section */}
        <div style={{
          padding: '2rem',
          backgroundColor: '#000000',
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
            fontSize: '1rem',
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
                    border: '1px solid rgba(8, 145, 178, 0.3)',
                  }}
                >
                  {industry}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
