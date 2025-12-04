import { useState, useEffect, useContext } from 'react';
import { VoiceContext } from '../context/VoiceContext';

export default function InactivityWarning() {
  const { showInactivityWarning, setShowInactivityWarning, logout } = useContext(VoiceContext);
  const [countdown, setCountdown] = useState(30);

  // Update countdown
  useEffect(() => {
    if (!showInactivityWarning) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showInactivityWarning]);

  const handleStaySignedIn = () => {
    setShowInactivityWarning(false);
    setCountdown(30);
  };

  const handleSignOut = async () => {
    await logout();
    setShowInactivityWarning(false);
  };

  if (!showInactivityWarning) return null;

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
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '1rem',
      }}
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
          textAlign: 'center',
        }}
      >
        {/* Header */}
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#ffffff',
            margin: '0 0 0.5rem 0',
          }}
        >
          Session Inactive
        </h2>

        {/* Message */}
        <p
          style={{
            fontSize: '0.875rem',
            color: '#cbd5e1',
            margin: '0 0 1.5rem 0',
            lineHeight: '1.5',
          }}
        >
          Your session will expire due to inactivity. Do you want to stay signed in?
        </p>

        {/* Countdown */}
        <div
          style={{
            background: 'rgba(8, 145, 178, 0.1)',
            border: '1px solid rgba(8, 145, 178, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <p
            style={{
              fontSize: '0.75rem',
              color: '#9ca3af',
              margin: '0 0 0.5rem 0',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Auto-logout in
          </p>
          <p
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#22d3ee',
              margin: 0,
            }}
          >
            {countdown}s
          </p>
        </div>

        {/* Buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
          }}
        >
          <button
            onClick={handleStaySignedIn}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: '#0891b2',
              color: '#ffffff',
              fontWeight: 'bold',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '0.875rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#06b6d4';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#0891b2';
            }}
          >
            Stay Signed In
          </button>

          <button
            onClick={handleSignOut}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: 'transparent',
              color: '#cbd5e1',
              fontWeight: '600',
              borderRadius: '8px',
              border: '1px solid #475569',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '0.875rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
