import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceProvider, VoiceContext, CATEGORIES, SOURCES } from '../context/VoiceContext';
import VoiceCard from '../components/VoiceCard';
import VoiceModal from '../components/VoiceModal';
import LoginModal from '../components/LoginModal';
import Header from '../components/Header';
import TechNodes from '../components/TechNodes';
import '../styles/AuroraBackground.css';

// Animation variants for smooth entrance effects
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

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// Main Library Component - Adapted from original Library (lines 620-669)
function Library() {
  const { voices, loading, isAdmin } = useContext(VoiceContext);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSource, setActiveSource] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingVoiceId, setPlayingVoiceId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVoice, setEditingVoice] = useState(null);
  const audioRef = useRef(new Audio());

  // Handle play/pause toggle - EXACT logic from original (lines 629-638)
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

  // Handle audio end - EXACT logic from original (line 639)
  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => setPlayingVoiceId(null);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Handle edit voice - Lift state up to open modal at page level
  const handleEditVoice = (voice) => {
    setEditingVoice(voice);
    setShowAddModal(true);
  };

  // Filter voices - EXACT logic from original (lines 641-649)
  const filteredVoices = voices.filter(voice => {
    const matchesCategory = activeCategory === 'All' || voice.category === activeCategory;
    const matchesSource = activeSource === 'all' || voice.source === activeSource;
    const matchesSearch =
      voice.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.language?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.accent?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSource && matchesSearch;
  });

  return (
    <div style={{
      minHeight: '100vh',
      paddingBottom: '5rem',
      position: 'relative',
      zIndex: 10,
      background: 'transparent !important',
    }}>
      {/* Header - Original line 653 */}
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Login Modal - Original line 654 */}
      <LoginModal />

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1.5rem',
        paddingTop: '2rem',
      }}>
        {/* Category Buttons + Add Voice Button - Original lines 656-658 */}
        <motion.div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '3rem',
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        >
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  background: activeCategory === cat ? '#3f464f' : 'transparent',
                  color: activeCategory === cat ? '#ffffff' : '#9ca3af',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  cursor: 'pointer',
                  boxShadow: 'none',
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.background = '#4b5563';
                    e.currentTarget.style.color = '#cbd5e1';
                    e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.25)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#9ca3af';
                    e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.15)';
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Add Voice Button - Original line 658 */}
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                background: '#0891b2',
                color: '#ffffff',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 15px rgba(8, 145, 178, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#0e7490';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(8, 145, 178, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#0891b2';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(8, 145, 178, 0.3)';
              }}
            >
              <Plus size={18} />
              Add Voice
            </button>
          )}
        </motion.div>

        {/* Sources Filter Row */}
        <motion.div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '2rem',
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
        >
          <button
            onClick={() => setActiveSource('all')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.2s ease',
              background: activeSource === 'all' ? '#3f464f' : 'transparent',
              color: activeSource === 'all' ? '#ffffff' : '#9ca3af',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              if (activeSource !== 'all') {
                e.currentTarget.style.background = '#4b5563';
                e.currentTarget.style.color = '#cbd5e1';
                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.25)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeSource !== 'all') {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#9ca3af';
                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.15)';
              }
            }}
          >
            All Sources
          </button>
          {SOURCES.map(source => (
            <button
              key={source.id}
              onClick={() => setActiveSource(source.id)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.2s ease',
                background: activeSource === source.id ? '#3f464f' : 'transparent',
                color: activeSource === source.id ? '#ffffff' : '#9ca3af',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                if (activeSource !== source.id) {
                  e.currentTarget.style.background = '#4b5563';
                  e.currentTarget.style.color = '#cbd5e1';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.25)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSource !== source.id) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#9ca3af';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.15)';
                }
              }}
            >
              {source.name}
            </button>
          ))}
        </motion.div>

        {/* Loading State - Original line 661 */}
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

        {/* Voice Grid - Original line 662 */}
        {!loading && filteredVoices.length > 0 && (
          <AnimatePresence>
            <motion.div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '2rem',
              }}
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {filteredVoices.map(voice => (
                <motion.div
                  key={voice.id}
                  variants={cardVariants}
                >
                  <VoiceCard
                    voice={voice}
                    isPlaying={playingVoiceId === voice.id}
                    onTogglePlay={handleTogglePlay}
                    onEdit={handleEditVoice}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Empty State - Original line 663 */}
        {!loading && filteredVoices.length === 0 && (
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
              <span style={{ fontSize: '1.75rem' }}>🔊</span>
            </div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '0.5rem',
            }}>
              No voices found
            </h3>
            <p style={{
              color: '#9ca3af',
              fontSize: '0.875rem',
            }}>
              {voices.length === 0
                ? 'Get started by adding your first voice sample.'
                : 'Try adjusting your search or filters.'}
            </p>
          </div>
        )}

        {/* Add/Edit Voice Modal - Original line 666 */}
        {showAddModal && (
          <VoiceModal
            voice={editingVoice}
            onClose={() => {
              setShowAddModal(false);
              setEditingVoice(null);
            }}
          />
        )}
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Main VoPlayer Component - The Page Component
export default function VoPlayer() {
  const navigate = useNavigate();

  return (
    <>
      {/* Aurora Background */}
      <div className="aurora-container">
        <div className="aurora-orb-3"></div>
      </div>

      {/* Particle Effects */}
      <TechNodes />

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
