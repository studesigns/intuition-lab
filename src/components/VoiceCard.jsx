import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { VoiceContext, SOURCES, LANGUAGES } from '../context/VoiceContext';

// Function to get language info
function getLanguageInfo(languageName) {
  const lang = LANGUAGES.find(l => l.name === languageName);
  return lang ? lang.countryCode : 'us';
}

// Flag emoji map
const FLAG_EMOJIS = {
  us: '🇺🇸',
  gb: '🇬🇧',
  jp: '🇯🇵',
  cn: '🇨🇳',
  de: '🇩🇪',
  in: '🇮🇳',
  fr: '🇫🇷',
  kr: '🇰🇷',
  pt: '🇵🇹',
  it: '🇮🇹',
  es: '🇪🇸',
  id: '🇮🇩',
  nl: '🇳🇱',
  tr: '🇹🇷',
  ph: '🇵🇭',
  pl: '🇵🇱',
  se: '🇸🇪',
  bg: '🇧🇬',
  ro: '🇷🇴',
  sa: '🇸🇦',
  cz: '🇨🇿',
  gr: '🇬🇷',
  fi: '🇫🇮',
  hr: '🇭🇷',
  my: '🇲🇾',
  sk: '🇸🇰',
  dk: '🇩🇰',
  ua: '🇺🇦',
  ru: '🇷🇺',
};

export default function VoiceCard({ voice, isPlaying, onTogglePlay, onEdit }) {
  const { isAdmin, deleteVoice } = useContext(VoiceContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAdminButtons, setShowAdminButtons] = useState(false);

  return (
    <motion.div
      className="group relative overflow-hidden transition-all duration-300"
      style={{
        background: 'rgba(30, 41, 59, 0.4)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      }}
      whileHover={{
        scale: 1.02,
        y: -5,
        boxShadow: '0 0 30px rgba(8, 145, 178, 0.4), 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.05)',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
        e.currentTarget.style.border = '1px solid rgba(8, 145, 178, 0.3)';
        setShowAdminButtons(true);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(30, 41, 59, 0.4)';
        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        setShowAdminButtons(false);
      }}
    >
      {/* Playing Indicator Bar */}
      {isPlaying && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />}

      {/* Card Header: Play Button + Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          <button
            onClick={() => onTogglePlay(voice)}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0"
            style={{
              background: '#0891b2',
              color: '#ffffff',
              transform: 'scale(1)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.5rem',
              boxShadow: '0 0 15px rgba(8, 145, 178, 0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(8, 145, 178, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(8, 145, 178, 0.4)';
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
            <h3 style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.25rem', margin: '0 0 0.5rem 0', lineHeight: '1.2', overflow: 'hidden', textOverflow: 'ellipsis' }}>{voice.name}</h3>
            <span style={{ fontSize: '0.7rem', color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>{voice.category}</span>
          </div>
        </div>

        {/* Source Badge */}
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.375rem 1rem',
          fontSize: '0.75rem',
          fontWeight: '600',
          borderRadius: '9999px',
          background: 'transparent',
          color: '#94a3b8',
          border: '1px solid #475569',
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}>
          {SOURCES.find(s => s.id === voice.source)?.name || 'Other'}
        </span>
      </div>

      {/* Language & Accent */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '0.375rem 0.75rem',
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{ fontSize: '0.9rem' }}>{FLAG_EMOJIS[getLanguageInfo(voice.language)] || '🌐'}</span>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{voice.language}</span>
          {voice.accent && <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '500' }}> • {voice.accent}</span>}
        </div>
      </div>

      {/* Description */}
      <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1rem', minHeight: '48px', margin: '0 0 1rem 0' }}>{voice.description}</p>

      {/* Tags */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        {voice.tags?.map(tag => (
          <span key={tag} style={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontWeight: '500',
            background: 'rgba(34, 211, 238, 0.1)',
            color: '#cbd5e1',
            border: '1px solid rgba(34, 211, 238, 0.2)',
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Admin Buttons (Edit & Delete) */}
      {isAdmin && (
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          display: 'flex',
          gap: '0.5rem',
          opacity: showAdminButtons ? 1 : 0,
          transition: 'opacity 0.2s ease',
          zIndex: 20,
          pointerEvents: showAdminButtons ? 'auto' : 'none',
        }}>
          {/* Edit Button */}
          <button
            onClick={() => onEdit(voice)}
            style={{
              padding: '0.5rem',
              background: '#3f464f',
              color: '#ffffff',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0891b2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#3f464f';
            }}
          >
            <Edit2 size={16} />
          </button>
          {/* Delete Button */}
          <button
            onClick={() => setShowDeleteModal(true)}
            style={{
              padding: '0.5rem',
              background: '#3f464f',
              color: '#ffffff',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#3f464f';
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      {/* Playing Animation Bars */}
      {isPlaying && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '32px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: '2px',
          padding: '0 1.5rem 4px 1.5rem',
        }}>
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              style={{
                width: '3px',
                backgroundColor: '#22d3ee',
                borderRadius: '9999px',
                height: '100%',
                animation: 'wave 0.8s ease-in-out infinite',
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Wave Animation CSS */}
      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.3); opacity: 0.6; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 50,
          }}
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
              maxWidth: '400px',
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#ffffff',
              margin: '0 0 0.5rem 0',
            }}>
              Delete Voice?
            </h3>

            {/* Confirmation Message */}
            <p style={{
              color: '#cbd5e1',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              margin: '0 0 1.5rem 0',
            }}>
              Are you sure you want to delete <strong>{voice.name}</strong>? This action cannot be undone.
            </p>

            {/* Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '1.5rem',
            }}>
              <button
                onClick={() => {
                  deleteVoice(voice.id);
                  setShowDeleteModal(false);
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
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
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'transparent',
                  color: '#cbd5e1',
                  border: '1px solid #475569',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = '#64748b';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = '#475569';
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
