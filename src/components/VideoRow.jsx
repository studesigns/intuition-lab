import { useRef, useState, useEffect, useCallback } from 'react';
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
  const rowContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isRowHovered, setIsRowHovered] = useState(false);

  // Check scroll position to show/hide arrows
  const checkScroll = useCallback(() => {
    if (!scrollRef.current) {
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

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
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      checkScroll();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [checkScroll, videos]);

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

      {/* Scroll Container with Netflix-Style Vignette Buttons */}
      <div
        ref={rowContainerRef}
        onMouseEnter={() => setIsRowHovered(true)}
        onMouseLeave={() => setIsRowHovered(false)}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'stretch',
          overflow: 'hidden',
          borderRadius: '0.5rem',
        }}
      >
        {/* Left Vignette Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '56px',
              background: 'linear-gradient(to right, rgba(0, 0, 0, 0.7), transparent)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 40,
              opacity: isRowHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            <ChevronLeft
              size={32}
              strokeWidth={3}
              color="#ffffff"
              style={{
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
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

        {/* Right Vignette Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '56px',
              background: 'linear-gradient(to left, rgba(0, 0, 0, 0.7), transparent)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 40,
              opacity: isRowHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            <ChevronRight
              size={32}
              strokeWidth={3}
              color="#ffffff"
              style={{
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
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
