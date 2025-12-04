import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Edit2, Trash2 } from 'lucide-react';
import { VoiceContext } from '../context/VoiceContext';

export default function VoiceCard({ voice, isPlaying, onTogglePlay, onEdit }) {
  const { isAdmin, deleteVoice } = useContext(VoiceContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAdminButtons, setShowAdminButtons] = useState(false);

  return (
    <motion.div
      style={{
        position: 'relative',
        aspectRatio: '1 / 1',
        background: 'rgba(30, 41, 59, 0.3)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      whileHover={{ scale: 1.05, y: -10 }}
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

      {/* Centered Play/Pause Button */}
      <motion.button
        onClick={() => onTogglePlay(voice)}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
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

      {/* Metadata Section - Bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent)',
          padding: '1.5rem 1rem 1rem 1rem',
          zIndex: 3,
          minHeight: '100px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        {/* Voice Name */}
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

        {/* Details */}
        <p
          style={{
            fontSize: '0.75rem',
            color: '#9ca3af',
            margin: '0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {voice.accent} • {voice.language}
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
