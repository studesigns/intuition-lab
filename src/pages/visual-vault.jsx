import { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { VideoContext, INDUSTRIES } from '../context/VideoContext';
import VideoHeader from '../components/VideoHeader';
import VideoRow from '../components/VideoRow';
import VideoModal from '../components/VideoModal';
import TechNodes from '../components/TechNodes';

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

  // Debug: log when selectedVideo changes
  useEffect(() => {
    console.log('selectedVideo changed:', selectedVideo?.title || 'null');
  }, [selectedVideo]);

  // Wrapper function for debugging
  const handleVideoPlay = (video) => {
    console.log('VisualVault.handleVideoPlay called with:', video?.title);
    try {
      setSelectedVideo(video);
      console.log('setSelectedVideo called successfully');
    } catch (err) {
      console.error('Error in handleVideoPlay:', err);
    }
  };

  // Group videos by industry
  const videosByIndustry = INDUSTRIES.reduce((acc, industry) => {
    acc[industry] = videos.filter(v => v.industries?.includes(industry));
    return acc;
  }, {});

  return (
    <>
      {/* Aurora Background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -10,
          background: 'radial-gradient(ellipse at 20% 50%, rgba(8, 145, 178, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Tech Nodes */}
      <TechNodes />

      {/* Header */}
      <VideoHeader />

      {/* Main Content */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '3rem 2rem',
        }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Loading State */}
        {loading && (
          <motion.div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
            }}
            variants={itemVariants}
          >
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
          </motion.div>
        )}

        {!loading && videos.length === 0 && (
          <motion.div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'rgba(30, 41, 59, 0.4)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            variants={itemVariants}
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

        {!loading && videos.length > 0 && (
          <>
            {/* Hero Section - Featured Videos */}
            {featuredVideos.length > 0 && (
              <motion.section variants={itemVariants} style={{ marginBottom: '4rem' }}>
                {/* Hero Container with Overlay */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    background: '#000000',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid rgba(8, 145, 178, 0.3)',
                    cursor: 'pointer',
                    position: 'relative',
                    minHeight: '500px',
                    boxShadow: '0 20px 60px rgba(8, 145, 178, 0.2)',
                  }}
                  onClick={() => handleVideoPlay(featuredVideos[0])}
                >
                  {/* Background Image / Video */}
                  <img
                    src={featuredVideos[0].thumbnailUrl}
                    alt={featuredVideos[0].title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      zIndex: 1,
                    }}
                  />

                  {/* Dark Gradient Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)',
                      zIndex: 2,
                    }}
                  />

                  {/* Content Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      padding: '3rem',
                      background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
                      zIndex: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      minHeight: '250px',
                    }}
                  >
                    <div>
                      {/* Industries */}
                      {featuredVideos[0].industries && featuredVideos[0].industries.length > 0 && (
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.75rem',
                          marginBottom: '1rem',
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
                          fontSize: '2.5rem',
                          fontWeight: 'bold',
                          color: '#ffffff',
                          margin: '0 0 0.5rem 0',
                          letterSpacing: '-1px',
                        }}
                      >
                        {featuredVideos[0].title}
                      </h1>

                      {/* Client Name */}
                      <p
                        style={{
                          fontSize: '1.25rem',
                          color: '#22d3ee',
                          margin: '0 0 1rem 0',
                          fontWeight: '500',
                        }}
                      >
                        {featuredVideos[0].clientName}
                      </p>

                      {/* Description */}
                      {featuredVideos[0].description && (
                        <p
                          style={{
                            fontSize: '1rem',
                            color: '#cbd5e1',
                            margin: '0 0 1.5rem 0',
                            lineHeight: '1.6',
                            maxWidth: '600px',
                          }}
                        >
                          {featuredVideos[0].description}
                        </p>
                      )}

                      {/* Watch Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVideoPlay(featuredVideos[0]);
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.875rem 2rem',
                          background: '#0891b2',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 8px 20px rgba(8, 145, 178, 0.4)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#06b6d4';
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 12px 30px rgba(8, 145, 178, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#0891b2';
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(8, 145, 178, 0.4)';
                        }}
                      >
                        ▶ Watch Project
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.section>
            )}

            {/* Video Rows by Industry */}
            <motion.div variants={containerVariants}>
              {INDUSTRIES.map(industry => {
                const industryVideos = videosByIndustry[industry];
                if (!industryVideos || industryVideos.length === 0) return null;

                return (
                  <motion.div key={industry} variants={itemVariants}>
                    <VideoRow
                      title={industry}
                      videos={industryVideos}
                      onVideoPlay={handleVideoPlay}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </motion.div>

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
