import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoContext } from '../context/VideoContext';
import { VoiceContext } from '../context/VoiceContext';
import { Lock, LogOut, Film, ArrowLeft } from 'lucide-react';

export default function VideoHeader() {
  const navigate = useNavigate();
  const { isAdmin: videoIsAdmin } = useContext(VideoContext);
  const { isAdmin, logout, setShowLoginModal } = useContext(VoiceContext);

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      width: '100%',
      background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4), transparent)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: 'none',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem 1.5rem',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        {/* Logo Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.125rem',
              background: 'rgba(30, 41, 59, 0.8)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.5rem',
              color: '#cbd5e1',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(30, 41, 59, 0.95)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#cbd5e1';
            }}
          >
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>

          {/* Logo Icon */}
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(8, 145, 178, 0.3)',
          }}>
            <Film size={20} color="white" />
          </div>

          {/* Title */}
          <div>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#ffffff',
              margin: 0,
              letterSpacing: '-0.5px',
            }}>Visual Vault</h1>
            <p style={{
              fontSize: '0.75rem',
              color: '#9ca3af',
              margin: '0.25rem 0 0 0',
            }}>Client Work Portfolio</p>
          </div>

          {isAdmin && (
            <span style={{
              marginLeft: '0.5rem',
              padding: '0.25rem 0.5rem',
              background: 'rgba(34, 197, 94, 0.2)',
              color: '#86efac',
              fontSize: '0.75rem',
              fontWeight: '600',
              borderRadius: '9999px',
              border: '1px solid rgba(34, 197, 94, 0.3)',
            }}>Admin Mode</span>
          )}
        </div>

        {/* Auth Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          {isAdmin ? (
            <button
              onClick={logout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'none',
                color: '#9ca3af',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ef4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#9ca3af';
              }}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/visual-vault/admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1rem',
                background: '#dc2626',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '9999px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#b91c1c';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(220, 38, 38, 0.6)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#dc2626';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Lock size={16} />
              <span>Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
