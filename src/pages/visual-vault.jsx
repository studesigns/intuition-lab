import { useState, useContext, useCallback } from 'react';
import { motion } from 'framer-motion';
import { VideoContext, INDUSTRIES } from '../context/VideoContext';
import VideoHeader from '../components/VideoHeader';
import VideoRow from '../components/VideoRow';
import VideoModal from '../components/VideoModal';
import { Play, Info } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function VisualVault() {
  const { videos, featuredVideos, loading } = useContext(VideoContext);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  // Callback to handle video selection
  const handleVideoPlay = useCallback((video) => {
    console.log('Opening Theatre Mode for:', video.title);
    setSelectedVideo(video);
  }, []);

  // Create category structure with dummy data for demo
  const createCategoryRows = () => {
    const rows = {};

    // If we have featured videos, create special categories
    if (featuredVideos.length > 0) {
      rows['Trending'] = [featuredVideos[0]];
      rows['New Releases'] = [featuredVideos[0]];
    }

    // Group videos by industry
    INDUSTRIES.forEach(industry => {
      const industryVideos = videos.filter(v => v.industries?.includes(industry));
      if (industryVideos.length > 0) {
        rows[industry] = industryVideos;
      }
    });

    return rows;
  };

  const categoryRows = createCategoryRows();
  const categories = Object.keys(categoryRows);

  if (loading) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #0a0a0a 50%, #000000 100%)',
      }}>
        <div style={{
          textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid rgba(8, 145, 178, 0.2)',
            borderTopColor: '#0891b2',
            animation: 'spin 1s linear infinite',
          }} />
          <p style={{
            color: '#9ca3af',
            marginTop: '1rem',
            fontSize: '0.875rem',
          }}>Loading portfolio...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Cinematic Gradient Background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          background: 'radial-gradient(ellipse at center, #1f2937 0%, #0a0a0a 50%, #000000 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <VideoHeader />

      {/* Main Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Hero Section */}
        {featuredVideos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'relative',
              width: '100%',
              minHeight: '70vh',
              overflow: 'hidden',
            }}
          >
            {/* Hero Background Image */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${featuredVideos[0].thumbnailUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 0,
              }}
            />

            {/* Dark Overlay Gradient */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%), linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent)',
                zIndex: 1,
              }}
            />

            {/* Hero Content */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '4rem 3rem',
                maxWidth: '900px',
              }}
            >
              {/* Industries */}
              {featuredVideos[0].industries && featuredVideos[0].industries.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '1.5rem',
                }}>
                  {featuredVideos[0].industries.map(industry => (
                    <span
                      key={industry}
                      style={{
                        display: 'inline-block',
                        background: 'rgba(8, 145, 178, 0.9)',
                        color: '#ffffff',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1
                style={{
                  fontSize: '3.5rem',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  margin: '0 0 0.5rem 0',
                  letterSpacing: '-1px',
                  maxWidth: '100%',
                }}
              >
                {featuredVideos[0].title}
              </h1>

              {/* Client Name */}
              <p
                style={{
                  fontSize: '1.5rem',
                  color: '#22d3ee',
                  margin: '0 0 1.5rem 0',
                  fontWeight: '500',
                }}
              >
                {featuredVideos[0].clientName}
              </p>

              {/* Description */}
              {featuredVideos[0].description && (
                <p
                  style={{
                    fontSize: '1.125rem',
                    color: '#cbd5e1',
                    margin: '0 0 2rem 0',
                    lineHeight: '1.6',
                    maxWidth: '600px',
                  }}
                >
                  {featuredVideos[0].description}
                </p>
              )}

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
              }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleVideoPlay(featuredVideos[0])}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem 2.5rem',
                    background: '#ffffff',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Play size={20} fill="#000000" />
                  Play
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleVideoPlay(featuredVideos[0])}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem 2.5rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  <Info size={20} />
                  More Info
                </motion.button>
              </div>
            </div>

            {/* Fade to Black at Bottom */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '200px',
                background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.9))',
                zIndex: 1,
                pointerEvents: 'none',
              }}
            />
          </motion.div>
        )}

        {/* Category Filter Navigation */}
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              paddingX: '3rem',
              paddingY: '2rem',
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              maxWidth: '1400px',
              margin: '0 auto',
            }}
          >
            {categories.map(category => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category)}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '9999px',
                  border: activeCategory === category ? 'none' : '2px solid rgba(255, 255, 255, 0.5)',
                  backgroundColor: activeCategory === category ? '#ffffff' : 'transparent',
                  color: activeCategory === category ? '#000000' : '#ffffff',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Category Rows */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 2rem 4rem 2rem',
          }}
        >
          {categories.map(category => (
            <motion.div key={category} variants={itemVariants}>
              <VideoRow
                title={category}
                videos={categoryRows[category]}
                onVideoPlay={handleVideoPlay}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {videos.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              maxWidth: '1400px',
              margin: '0 auto',
            }}
          >
            <p style={{
              fontSize: '1.125rem',
              color: '#9ca3af',
              margin: 0,
            }}>
              No videos yet. Check back soon for our client work portfolio!
            </p>
          </motion.div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </>
  );
}
