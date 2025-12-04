import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { VideoContext } from '../context/VideoContext';
import { VoiceContext } from '../context/VoiceContext';
import VideoHeader from '../components/VideoHeader';
import CompactUploadPanel from '../components/CompactUploadPanel';
import CompactVideoList from '../components/CompactVideoList';
import VideoModal from '../components/VideoModal';
import LoginModal from '../components/LoginModal';
import TechNodes from '../components/TechNodes';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export default function VisualVaultAdmin() {
  const navigate = useNavigate();
  const { isAdmin, setShowLoginModal } = useContext(VoiceContext);
  const { videos, loading, addVideo, updateVideo, deleteVideo, toggleFeatured } = useContext(VideoContext);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Show login modal if not authenticated
  useEffect(() => {
    if (!isAdmin) {
      setShowLoginModal(true);
    }
  }, [isAdmin, setShowLoginModal]);

  // Handle video upload
  const handleUploadSuccess = async (videoData) => {
    setUploading(true);
    setError(null);

    try {
      const result = await addVideo(videoData);
      if (result.success) {
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        setError(result.error || 'Failed to save video metadata');
      }
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Handle video edit
  const handleEditVideo = (video) => {
    setEditingVideo(video);
  };

  // Handle video update
  const handleUpdateVideo = async (videoId, updatedData) => {
    setUploading(true);
    setError(null);

    try {
      const result = await updateVideo(videoId, updatedData);
      if (result.success) {
        setUploadSuccess(true);
        setEditingVideo(null);
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        setError(result.error || 'Failed to update video');
      }
    } catch (err) {
      setError(err.message || 'Update failed');
    } finally {
      setUploading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id, cloudinaryPublicId) => {
    const result = await deleteVideo(id, cloudinaryPublicId);
    if (!result.success) {
      setError(result.error || 'Failed to delete video');
    }
  };

  // Handle featured toggle
  const handleToggleFeatured = async (id, currentStatus) => {
    await toggleFeatured(id, currentStatus);
  };

  return (
    <>
      {/* Aurora Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -10,
        background: 'radial-gradient(ellipse at 20% 50%, rgba(8, 145, 178, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      {/* Tech Nodes */}
      <TechNodes />

      {/* Login Modal */}
      <LoginModal
        subtitle="Sign in to manage videos"
        onCancel={() => navigate('/visual-vault')}
      />

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
        {/* Title */}
        <motion.div variants={itemVariants} style={{ marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#ffffff',
            margin: 0,
            letterSpacing: '-1px',
          }}>
            Visual Vault Admin
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#9ca3af',
            margin: '0.5rem 0 0 0',
          }}>
            Manage your video portfolio
          </p>
        </motion.div>

        {/* Success Message */}
        {uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '2rem',
              color: '#86efac',
              fontSize: '0.875rem',
            }}
          >
            Video uploaded successfully!
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '2rem',
              color: '#fca5a5',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fca5a5',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              ×
            </button>
          </motion.div>
        )}

        {/* Upload Section */}
        <div style={{ marginBottom: '2rem' }}>
          <CompactUploadPanel
            onUploadSuccess={handleUploadSuccess}
            editingVideo={editingVideo}
            onEditModeChange={setIsEditMode}
            onUpdateVideo={handleUpdateVideo}
          />
        </div>

        {/* Library Section */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.4)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          <div style={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1.5rem',
            background: 'rgba(30, 41, 59, 0.6)',
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#ffffff',
              margin: 0,
            }}>
              Library ({videos.length})
            </h2>
          </div>

          {loading && (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
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
                marginTop: '0.75rem',
                fontSize: '0.875rem',
              }}>Loading videos...</p>

              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}

          {!loading && (
            <CompactVideoList
              videos={videos}
              onDelete={handleDelete}
              onToggleFeatured={handleToggleFeatured}
              onPreview={(video) => setSelectedVideo(video)}
              onEdit={handleEditVideo}
            />
          )}
        </div>
      </motion.div>

      {/* Video Preview Modal */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </>
  );
}
