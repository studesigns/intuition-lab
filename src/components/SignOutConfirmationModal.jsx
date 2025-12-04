import { useState } from 'react';

export default function SignOutConfirmationModal({ isOpen, onConfirm, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '1rem',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: '#0f172a',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          maxWidth: '400px',
          width: '100%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '0.5rem',
            margin: 0,
          }}
        >
          Sign Out?
        </h2>
        <p
          style={{
            color: '#9ca3af',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            margin: '0.5rem 0 1.5rem 0',
          }}
        >
          Are you sure you want to sign out? You will return to the gallery view.
        </p>

        {/* Buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginTop: '1.5rem',
          }}
        >
          <button
            onClick={onCancel}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'transparent',
              color: '#cbd5e1',
              fontWeight: '600',
              borderRadius: '8px',
              border: '1px solid #475569',
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              fontWeight: '600',
              borderRadius: '8px',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              transition: 'background-color 0.2s',
              opacity: isLoading ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#b91c1c';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626';
            }}
          >
            {isLoading ? 'Signing Out...' : 'Sign Out'}
          </button>
        </div>
      </div>
    </div>
  );
}
