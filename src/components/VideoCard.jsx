import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Edit2, Trash2, Star } from 'lucide-react';
import { formatDuration } from '../utils/cloudinaryHelper';

export default function VideoCard({
  video,
  onPlay,
  onEdit,
  onDelete,
  onToggleFeatured,
  showAdminControls = false,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showAdminButtons, setShowAdminButtons] = useState(false);
  const videoRef = useRef(null);

  // Handle video preview on hover
  useEffect(() => {
    if (!videoRef.current) return;

    if (isHovered) {
      videoRef.current.play().catch(error => {
        console.log("Video preview failed:", error);
      });
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered]);

  const handleCardClick = () => {
    if (onPlay) {
      onPlay(video);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -10 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        if (showAdminControls) setShowAdminButtons(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (showAdminControls) setShowAdminButtons(false);
      }}
      style={{
        position: 'relative',
        minWidth: '320px',
        background: 'rgba(30, 41, 59, 0.4)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: isHovered ? '1px solid rgba(8, 145, 178, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: isHovered
          ? '0 0 40px rgba(8, 145, 178, 0.7), 0 0 60px rgba(8, 145, 178, 0.3)'
          : 'none',
      }}
      onClick={handleCardClick}
    >
      {/* Video Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '56.25%', // 16:9 aspect ratio
        background: '#000000',
        overflow: 'hidden',
      }}>
        {/* Thumbnail (always visible) */}
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: !isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Video Preview (on hover) */}
        {isHovered && (
          <video
            ref={videoRef}
            src={video.cloudinaryUrl}
            muted
            loop
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        {/* Play Button Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isHovered ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
        }}>
          {!isHovered && (
            <div style={{
              width: '56px',
              height: '56px',
              background: 'rgba(8, 145, 178, 0.9)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(8, 145, 178, 0.5)',
            }}>
              <Play size={28} color="#ffffff" fill="#ffffff" />
            </div>
          )}
        </div>

        {/* Duration Badge (top-right) */}
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          background: 'rgba(0, 0, 0, 0.8)',
          color: '#ffffff',
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: '600',
          zIndex: 5,
        }}>
          {formatDuration(video.duration)}
        </div>

        {/* Featured Star Badge (top-left, if featured) */}
        {video.isFeatured && (
          <div style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            background: 'rgba(251, 191, 36, 0.9)',
            padding: '0.5rem',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5,
          }}>
            <Star size={16} color="#000000" fill="#000000" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div style={{
        padding: '1rem',
      }}>
        {/* Title */}
        <h3 style={{
          fontSize: '1rem',
          fontWeight: '700',
          color: '#ffffff',
          margin: '0 0 0.25rem 0',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {video.title}
        </h3>

        {/* Client Name */}
        <p style={{
          fontSize: '0.875rem',
          color: '#9ca3af',
          margin: '0 0 0.75rem 0',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {video.clientName}
        </p>

        {/* Industry Badges */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '0.75rem',
        }}>
          {video.industries && video.industries.map(industry => (
            <span
              key={industry}
              style={{
                display: 'inline-block',
                background: 'rgba(8, 145, 178, 0.2)',
                color: '#22d3ee',
                padding: '0.25rem 0.625rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '600',
                border: '1px solid rgba(8, 145, 178, 0.3)',
              }}
            >
              {industry}
            </span>
          ))}
        </div>

        {/* Custom Tags */}
        {video.customTags && video.customTags.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}>
            {video.customTags.slice(0, 2).map(tag => (
              <span
                key={tag}
                style={{
                  display: 'inline-block',
                  background: 'rgba(100, 116, 139, 0.3)',
                  color: '#cbd5e1',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: '500',
                }}
              >
                #{tag}
              </span>
            ))}
            {video.customTags.length > 2 && (
              <span style={{
                fontSize: '0.7rem',
                color: '#64748b',
                paddingTop: '0.2rem',
              }}>
                +{video.customTags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Admin Controls (fade in on hover) */}
      {showAdminControls && (
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          display: 'flex',
          gap: '0.5rem',
          opacity: showAdminButtons ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: showAdminButtons ? 'auto' : 'none',
        }}>
          {/* Featured Toggle Button */}
          {onToggleFeatured && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFeatured(video.id, video.isFeatured);
              }}
              style={{
                width: '40px',
                height: '40px',
                background: video.isFeatured ? 'rgba(251, 191, 36, 0.9)' : 'rgba(100, 116, 139, 0.8)',
                border: 'none',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = video.isFeatured ? 'rgba(251, 191, 36, 1)' : 'rgba(100, 116, 139, 1)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = video.isFeatured ? 'rgba(251, 191, 36, 0.9)' : 'rgba(100, 116, 139, 0.8)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title={video.isFeatured ? 'Remove from Featured' : 'Add to Featured'}
            >
              <Star size={20} color={video.isFeatured ? '#000000' : '#ffffff'} fill={video.isFeatured ? '#000000' : 'none'} />
            </button>
          )}

          {/* Edit Button */}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(video);
              }}
              style={{
                width: '40px',
                height: '40px',
                background: 'rgba(8, 145, 178, 0.8)',
                border: 'none',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(8, 145, 178, 1)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(8, 145, 178, 0.8)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title="Edit video"
            >
              <Edit2 size={18} color="#ffffff" />
            </button>
          )}

          {/* Delete Button */}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Delete "${video.title}"? This action cannot be undone.`)) {
                  onDelete(video.id, video.cloudinaryPublicId);
                }
              }}
              style={{
                width: '40px',
                height: '40px',
                background: 'rgba(220, 38, 38, 0.8)',
                border: 'none',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(220, 38, 38, 1)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(220, 38, 38, 0.8)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title="Delete video"
            >
              <Trash2 size={18} color="#ffffff" />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
