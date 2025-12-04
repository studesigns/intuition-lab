import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import VideoCard from './VideoCard';

export default function VideoRow({
  title,
  videos,
  onVideoPlay,
  onVideoEdit,
  onVideoDelete,
  onToggleFeatured,
  showAdminControls = false,
}) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position to show/hide arrows
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    const scrollAmount = 400; // pixels
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      // Check scroll position after animation
      setTimeout(checkScroll, 300);
    }
  };

  // Check scroll position on mount and when videos change
  if (scrollRef.current) {
    checkScroll();
  }

  return (
    <div style={{
      marginBottom: '3rem',
    }}>
      {/* Row Title */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: '1rem',
        marginLeft: '0',
      }}>
        {title}
      </h2>

      {/* Scroll Container with Arrows */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            style={{
              position: 'absolute',
              left: '-2.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '48px',
              height: '48px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              color: '#ffffff',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(8, 145, 178, 0.6)';
              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            }}
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
        )}

        {/* Video Cards Container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          style={{
            display: 'flex',
            gap: '1rem',
            overflowX: 'auto',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE and Edge
            overflowY: 'hidden',
            width: '100%',
            paddingRight: '1rem',
          }}
          // Hide scrollbar for Chrome, Safari, etc.
          className="hide-scrollbar"
        >
          {videos && videos.length > 0 ? (
            videos.map(video => (
              <div
                key={video.id}
                style={{
                  flexShrink: 0,
                  width: '320px',
                }}
              >
                <VideoCard
                  video={video}
                  onPlay={onVideoPlay}
                  onEdit={onVideoEdit}
                  onDelete={onVideoDelete}
                  onToggleFeatured={onToggleFeatured}
                  showAdminControls={showAdminControls}
                />
              </div>
            ))
          ) : (
            <div style={{
              width: '100%',
              padding: '2rem',
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: '0.875rem',
            }}>
              No videos in this category yet.
            </div>
          )}
        </div>

        {/* Right Arrow Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            style={{
              position: 'absolute',
              right: '-2.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '48px',
              height: '48px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              color: '#ffffff',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(8, 145, 178, 0.6)';
              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            }}
          >
            <ChevronRight size={24} strokeWidth={3} />
          </button>
        )}
      </div>

      {/* CSS for hiding scrollbar */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
