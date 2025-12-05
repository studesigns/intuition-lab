import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Edit2, Trash2 } from 'lucide-react';
import { VoiceContext, LANGUAGES, SOURCES } from '../context/VoiceContext';

// Helper function to get SVG flag by country code
const FlagSVG = ({ countryCode }) => {
  if (!countryCode) return null;

  // Map of country codes to flag
  const flags = {
    'us': '🇺🇸', 'gb': '🇬🇧', 'jp': '🇯🇵', 'cn': '🇨🇳', 'de': '🇩🇪',
    'in': '🇮🇳', 'fr': '🇫🇷', 'kr': '🇰🇷', 'pt': '🇵🇹', 'it': '🇮🇹',
    'es': '🇪🇸', 'id': '🇮🇩', 'nl': '🇳🇱', 'tr': '🇹🇷', 'ph': '🇵🇭',
    'pl': '🇵🇱', 'se': '🇸🇪', 'bg': '🇧🇬', 'ro': '🇷🇴', 'sa': '🇸🇦',
    'cz': '🇨🇿', 'gr': '🇬🇷', 'fi': '🇫🇮', 'hr': '🇭🇷', 'my': '🇲🇾',
    'sk': '🇸🇰', 'dk': '🇩🇰', 'ua': '🇺🇦', 'ru': '🇷🇺',
  };

  return <span>{flags[countryCode.toLowerCase()] || '🌍'}</span>;
};

// Helper function to get source color
const getSourceColor = (sourceId) => {
  const source = SOURCES.find(s => s.id === sourceId);
  if (!source) return { bg: 'bg-gray-500', text: 'text-gray-100' };

  switch(sourceId) {
    case 'wellsaid':
      return { bg: 'bg-indigo-600', text: 'text-indigo-100' };
    case 'elevenlabs':
      return { bg: 'bg-emerald-600', text: 'text-emerald-100' };
    case 'synthesia':
      return { bg: 'bg-amber-600', text: 'text-amber-100' };
    default:
      return { bg: 'bg-gray-600', text: 'text-gray-100' };
  }
};

export default function VoiceCard({ voice, isPlaying, onTogglePlay, onEdit }) {
  const { isAdmin, deleteVoice } = useContext(VoiceContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAdminButtons, setShowAdminButtons] = useState(false);

  return (
    <motion.div
      style={{
        position: 'relative',
        aspectRatio: '1 / 1',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        border: '1px solid rgba(71, 85, 105, 0.5)',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      whileHover={{
        y: -4,
        borderColor: 'rgba(6, 182, 212, 0.5)',
      }}
      onMouseEnter={() => setShowAdminButtons(true)}
      onMouseLeave={() => setShowAdminButtons(false)}
    >
      {/* Background Gradient */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: isPlaying
            ? 'linear-gradient(135deg, rgba(8, 145, 178, 0.4) 0%, rgba(14, 116, 144, 0.3) 100%)'
            : 'linear-gradient(135deg, rgba(8, 145, 178, 0.2) 0%, rgba(14, 116, 144, 0.15) 100%)',
          zIndex: 0,
        }}
      />

      {/* Playing Indicator Ring */}
      {isPlaying && (
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '140px',
            height: '140px',
            border: '2px solid #0891b2',
            borderRadius: '50%',
            zIndex: 1,
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Centered Play/Pause Button with Sound Wave Bars */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <motion.button
          onClick={() => onTogglePlay(voice)}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#0891b2',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: isPlaying
              ? '0 0 30px rgba(8, 145, 178, 0.8)'
              : '0 0 15px rgba(8, 145, 178, 0.4)',
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#0e7490';
            e.currentTarget.style.boxShadow = '0 0 40px rgba(8, 145, 178, 1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#0891b2';
            e.currentTarget.style.boxShadow = isPlaying
              ? '0 0 30px rgba(8, 145, 178, 0.8)'
              : '0 0 15px rgba(8, 145, 178, 0.4)';
          }}
        >
          {isPlaying ? (
            <Pause size={32} color="#ffffff" fill="#ffffff" />
          ) : (
            <Play size={32} color="#ffffff" fill="#ffffff" />
          )}
        </motion.button>

        {/* Animated Sound Wave Bars - Only show when playing */}
        {isPlaying && (
          <div
            style={{
              display: 'flex',
              gap: '4px',
              alignItems: 'flex-end',
              height: '40px',
            }}
          >
            {[0, 1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                style={{
                  width: '3px',
                  background: '#0891b2',
                  borderRadius: '2px',
                }}
                animate={{
                  height: ['8px', '24px', '16px', '20px', '12px', '8px'],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: index * 0.1,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Top Left: Category Badge */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          zIndex: 5,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            fontSize: '0.7rem',
            fontWeight: '600',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            whiteSpace: 'nowrap',
          }}
        >
          {voice.category}
        </span>
      </div>

      {/* Top Right: Source Badge */}
      {voice.source && (
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 5,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.7rem',
              fontWeight: '600',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              whiteSpace: 'nowrap',
            }}
          >
            {SOURCES.find(s => s.id === voice.source)?.name.split(' ')[0]}
          </span>
        </div>
      )}

      {/* Metadata Section - Bottom (Simplified) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4), transparent)',
          padding: '2rem 1rem 1.25rem 1rem',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          gap: '0.5rem',
        }}
      >
        {/* Voice Name - Bold & White */}
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: '700',
            color: '#ffffff',
            margin: '0 0 0.25rem 0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {voice.name}
        </h3>

        {/* Flag + Language + Accent - Grey Secondary Text */}
        <p
          style={{
            fontSize: '0.75rem',
            color: '#94a3b8',
            margin: '0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          {(() => {
            // Find the language entry to get country code
            const langEntry = LANGUAGES.find(
              l => l.name.toLowerCase() === voice.language.toLowerCase()
            );
            const countryCode = langEntry?.countryCode || '';

            return (
              <>
                <FlagSVG countryCode={countryCode} />
                <span>{voice.language} • {voice.accent}</span>
              </>
            );
          })()}
        </p>
      </div>

      {/* Admin Buttons - Hover Overlay */}
      {showAdminButtons && isAdmin && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            zIndex: 4,
            display: 'flex',
            gap: '0.5rem',
          }}
        >
          {/* Edit Button */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(voice);
            }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(8, 145, 178, 0.8)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            whileHover={{ scale: 1.1 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0e7490';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(8, 145, 178, 0.8)';
            }}
          >
            <Edit2 size={16} color="#ffffff" />
          </motion.button>

          {/* Delete Button */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteModal(true);
            }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.8)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            whileHover={{ scale: 1.1 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#dc2626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.8)';
            }}
          >
            <Trash2 size={16} color="#ffffff" />
          </motion.button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
          }}
          onClick={() => setShowDeleteModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: '#1a1a1a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '400px',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem' }}>
              Delete Voice?
            </h3>
            <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  padding: '0.5rem 1.5rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteVoice(voice.id);
                  setShowDeleteModal(false);
                }}
                style={{
                  padding: '0.5rem 1.5rem',
                  background: '#ef4444',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ef4444';
                }}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
