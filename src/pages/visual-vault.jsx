import { useState, useContext } from 'react';
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
                <h1 style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  marginBottom: '2rem',
                  letterSpacing: '-1px',
                }}>
                  Featured Work
                </h1>

                {/* Hero Video Player */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    background: '#000000',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid rgba(8, 145, 178, 0.2)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedVideo(featuredVideos[0])}
                >
                  <video
                    src={featuredVideos[0].cloudinaryUrl}
                    poster={featuredVideos[0].thumbnailUrl}
                    controls
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      maxHeight: '600px',
                    }}
                  />
                </motion.div>

                {/* Featured Video Info */}
                <div style={{
                  marginTop: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '2rem',
                }}>
                  <div>
                    <h2 style={{
                      fontSize: '1.75rem',
                      fontWeight: '700',
                      color: '#ffffff',
                      margin: '0 0 0.5rem 0',
                    }}>
                      {featuredVideos[0].title}
                    </h2>
                    <p style={{
                      fontSize: '1.125rem',
                      color: '#22d3ee',
                      margin: '0 0 1rem 0',
                      fontWeight: '500',
                    }}>
                      {featuredVideos[0].clientName}
                    </p>
                    {featuredVideos[0].description && (
                      <p style={{
                        fontSize: '0.95rem',
                        color: '#cbd5e1',
                        margin: 0,
                        lineHeight: '1.6',
                      }}>
                        {featuredVideos[0].description}
                      </p>
                    )}
                  </div>

                  {/* Industries */}
                  {featuredVideos[0].industries && featuredVideos[0].industries.length > 0 && (
                    <div>
                      <h3 style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#cbd5e1',
                        margin: '0 0 1rem 0',
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
                        {featuredVideos[0].industries.map(industry => (
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
                      onVideoPlay={(video) => setSelectedVideo(video)}
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
