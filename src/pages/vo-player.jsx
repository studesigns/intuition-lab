import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceProvider, VoiceContext, CATEGORIES } from '../context/VoiceContext';
import VoiceCard from '../components/VoiceCard';
import AdminVoicesTable from '../components/AdminVoicesTable';
import VoiceModal from '../components/VoiceModal';
import LoginModal from '../components/LoginModal';
import Header from '../components/Header';
import '../styles/AuroraBackground.css';

// Animation variants
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

// Main Library Component
function Library() {
  const { voices, loading, isAdmin, deleteVoice, toggleFeatured } = useContext(VoiceContext);
  const [playingVoiceId, setPlayingVoiceId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVoice, setEditingVoice] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showTableView, setShowTableView] = useState(false);
  const [deleteConfirmVoice, setDeleteConfirmVoice] = useState(null);
  const categoryRefs = useRef({});
  const audioRef = useRef(new Audio());

  // Handle play/pause toggle
  const handleTogglePlay = (voice) => {
    const audio = audioRef.current;
    if (playingVoiceId === voice.id) {
      audio.pause();
      setPlayingVoiceId(null);
    } else {
      if (playingVoiceId) audio.pause();
      audio.src = voice.audioUrl;
      audio.volume = 0.5;
      audio.play()
        .then(() => setPlayingVoiceId(voice.id))
        .catch(error => {
          console.error("Playback failed:", error);
          alert("Could not play audio.");
          setPlayingVoiceId(null);
        });
    }
  };

  // Handle audio end
  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => setPlayingVoiceId(null);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Handle edit voice
  const handleEditVoice = (voice) => {
    setEditingVoice(voice);
    setShowAddModal(true);
  };

  // Group voices by category (tag) and filter by active category
  const voicesByCategory = () => {
    const grouped = {};
    voices.forEach(voice => {
      const category = voice.category || 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(voice);
    });
    return grouped;
  };

  const allVoiceGroups = voicesByCategory();

  // For table view - all voices
  const filteredVoices = voices;

  // Filter based on active category
  let voiceGroups = {};
  let categories = [];

  if (activeCategory === 'All') {
    voiceGroups = allVoiceGroups;
    categories = Object.keys(allVoiceGroups);
  } else {
    // Only show voices from the active category
    if (allVoiceGroups[activeCategory]) {
      voiceGroups[activeCategory] = allVoiceGroups[activeCategory];
      categories = [activeCategory];
    }
  }

  // Get all unique categories for the pill buttons
  const allCategories = Object.keys(allVoiceGroups);

  // Get featured voice (first one or random)
  const featuredVoice = voices.length > 0 ? voices[0] : null;

  return (
    <div style={{
      minHeight: '100vh',
      paddingBottom: '5rem',
      position: 'relative',
      zIndex: 10,
      background: 'transparent !important',
    }}>
      {/* Header */}
      <Header />

      {/* Login Modal */}
      <LoginModal />

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        paddingTop: '80px',
      }}>
        {/* Hero Section - Featured Voice */}
        {featuredVoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'relative',
              width: '100%',
              minHeight: '28vh',
              overflow: 'hidden',
              marginBottom: '2rem',
            }}
          >
            {/* Hero Background - Sound Wave Gradient */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(8, 145, 178, 0.3) 0%, rgba(14, 116, 144, 0.2) 50%, rgba(6, 78, 87, 0.1) 100%)',
                zIndex: 0,
              }}
            />

            {/* Sound Wave Animation Background */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(34, 211, 238, 0.2) 0%, transparent 70%)',
                borderRadius: '50%',
                zIndex: 1,
              }}
            />

            {/* Microphone Icon Area */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '120px',
                zIndex: 2,
                opacity: 0.3,
              }}
            >
              🎙️
            </div>

            {/* Dark Overlay Gradient */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%), linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
                zIndex: 2,
              }}
            />

            {/* Hero Content */}
            <div
              style={{
                position: 'relative',
                zIndex: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '2rem 3rem 1.5rem 3rem',
                maxWidth: '900px',
              }}
            >
              {/* Featured Label */}
              <span
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
                  marginBottom: '1.5rem',
                  width: 'fit-content',
                }}
              >
                Featured Voice of the Month
              </span>

              {/* Voice Name */}
              <h1
                style={{
                  fontSize: '3.5rem',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  margin: '0 0 0.5rem 0',
                  letterSpacing: '-1px',
                }}
              >
                {featuredVoice.name}
              </h1>

              {/* Category + Details */}
              <p
                style={{
                  fontSize: '1.5rem',
                  color: '#22d3ee',
                  margin: '0 0 1.5rem 0',
                  fontWeight: '500',
                }}
              >
                {featuredVoice.category} • {featuredVoice.accent} • {featuredVoice.language}
              </p>

              {/* Description */}
              {featuredVoice.description && (
                <p
                  style={{
                    fontSize: '1.125rem',
                    color: '#cbd5e1',
                    margin: '0 0 2rem 0',
                    lineHeight: '1.6',
                    maxWidth: '600px',
                  }}
                >
                  {featuredVoice.description}
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
                  onClick={() => handleTogglePlay(featuredVoice)}
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
                  🎵 Listen to Demo
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

        {/* Category Filter Pills - Sticky Sub-navbar */}
        {(allCategories.length > 0 || isAdmin) && (
          <div
            style={{
              position: 'sticky',
              top: '80px',
              zIndex: 45,
              background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.8), transparent)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              padding: '1.5rem 2rem',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'flex',
                gap: '0.75rem',
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              className="hide-scrollbar"
            >
              {/* Admin Toggle Button - Right Side */}
              {isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTableView(!showTableView)}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '9999px',
                    border: showTableView ? 'none' : '1px solid rgba(255, 255, 255, 0.4)',
                    backgroundColor: showTableView ? '#ffffff' : 'transparent',
                    color: showTableView ? '#000000' : '#ffffff',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    marginLeft: 'auto',
                  }}
                  onMouseEnter={(e) => {
                    if (!showTableView) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!showTableView) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                    }
                  }}
                >
                  {showTableView ? 'Card View' : 'Admin View'}
                </motion.button>
              )}
            </div>

            {/* Category Pills - Scrollable */}
            {allCategories.length > 0 && !showTableView && (
            <div
              style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'flex',
                gap: '0.75rem',
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
              className="hide-scrollbar"
            >
              {/* "All" Pill */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory('All')}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '9999px',
                  border: activeCategory === 'All' ? 'none' : '1px solid rgba(255, 255, 255, 0.4)',
                  backgroundColor: activeCategory === 'All' ? '#ffffff' : 'transparent',
                  color: activeCategory === 'All' ? '#000000' : '#ffffff',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== 'All') {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== 'All') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                  }
                }}
              >
                All
              </motion.button>

              {/* Category Pills */}
              {allCategories.map(category => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(category)}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '9999px',
                    border: activeCategory === category ? 'none' : '1px solid rgba(255, 255, 255, 0.4)',
                    backgroundColor: activeCategory === category ? '#ffffff' : 'transparent',
                    color: activeCategory === category ? '#000000' : '#ffffff',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (activeCategory !== category) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeCategory !== category) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                    }
                  }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
            )}
          </div>
        )}

        {/* Main Content Area */}
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 2rem 4rem 2rem',
          }}
        >
          {/* Loading State */}
          {loading && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '5rem',
              paddingBottom: '5rem',
            }}>
              <span style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>⏳</span>
            </div>
          )}

          {/* Admin Table View */}
          {!loading && isAdmin && showTableView && (
            <>
              <div style={{ marginBottom: '2rem' }}>
                {isAdmin && showTableView && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddModal(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      background: '#ffffff',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Plus size={18} />
                    Add Voice
                  </motion.button>
                )}
              </div>
              <AdminVoicesTable
                voices={filteredVoices}
                onEditVoice={(voice) => { setEditingVoice(voice); setShowAddModal(true); }}
                onDeleteVoice={(voice) => setDeleteConfirmVoice(voice)}
                onToggleFeatured={toggleFeatured}
                loading={loading}
              />
            </>
          )}

          {/* Voice Categories */}
          {!loading && categories.length > 0 && (!isAdmin || !showTableView) && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {categories.map(category => (
                <motion.div key={category} variants={itemVariants} style={{ marginBottom: '3rem' }}>
                  {/* Category Title */}
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '1rem',
                    marginLeft: '0',
                  }}>
                    {category}
                  </h2>

                  {/* Voice Cards Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '1.5rem',
                  }}>
                    {voiceGroups[category].map(voice => (
                      <VoiceCard
                        key={voice.id}
                        voice={voice}
                        isPlaying={playingVoiceId === voice.id}
                        onTogglePlay={handleTogglePlay}
                        onEdit={handleEditVoice}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty State - No voices in selected category */}
          {!loading && activeCategory !== 'All' && categories.length === 0 && (
            <div style={{
              textAlign: 'center',
              paddingTop: '5rem',
              paddingBottom: '5rem',
            }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}>
                <span style={{ fontSize: '1.75rem' }}>🎤</span>
              </div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#ffffff',
                marginBottom: '0.5rem',
              }}>
                No voices in this category
              </h3>
              <p style={{
                color: '#9ca3af',
                fontSize: '0.875rem',
              }}>
                Nothing here yet... stay tuned.
              </p>
            </div>
          )}

          {/* Empty State - No voices at all */}
          {!loading && voices.length === 0 && (
            <div style={{
              textAlign: 'center',
              paddingTop: '5rem',
              paddingBottom: '5rem',
            }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}>
                <span style={{ fontSize: '1.75rem' }}>🎤</span>
              </div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#ffffff',
                marginBottom: '0.5rem',
              }}>
                No voices yet
              </h3>
              <p style={{
                color: '#9ca3af',
                fontSize: '0.875rem',
              }}>
                Get started by adding your first voice sample.
              </p>
            </div>
          )}
        </div>

        {/* Add/Edit Voice Modal */}
        {showAddModal && (
          <VoiceModal
            voice={editingVoice}
            onClose={() => {
              setShowAddModal(false);
              setEditingVoice(null);
            }}
            onSave={(savedVoice) => {
              // Optional: Handle save callback for immediate UI updates
              // The real-time Firestore listener will handle the bulk of the update
              if (editingVoice) {
                console.log('Voice updated:', savedVoice);
              } else {
                console.log('Voice added:', savedVoice);
              }
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmVoice && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
            onClick={() => setDeleteConfirmVoice(null)}
          >
            <div
              style={{
                background: '#1f2937',
                borderRadius: '1rem',
                padding: '2rem',
                maxWidth: '28rem',
                width: '100%',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '0.5rem',
              }}>
                Delete Voice
              </h2>
              <p style={{
                color: '#d1d5db',
                marginBottom: '1.5rem',
              }}>
                Are you sure you want to delete <strong>{deleteConfirmVoice.name}</strong>? This action cannot be undone.
              </p>
              <div style={{
                display: 'flex',
                gap: '0.75rem',
              }}>
                <button
                  onClick={() => setDeleteConfirmVoice(null)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await deleteVoice(deleteConfirmVoice.id);
                    setDeleteConfirmVoice(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: '#dc2626',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#b91c1c';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#dc2626';
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

// Main VoPlayer Component - The Page Component
export default function VoPlayer() {
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

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Voice Provider Wrapper */}
        <VoiceProvider>
          <Library />
        </VoiceProvider>
      </div>
    </>
  );
}
