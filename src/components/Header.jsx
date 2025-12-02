import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoiceContext } from '../context/VoiceContext';
import { Lock, LogOut, Mic, ArrowLeft } from 'lucide-react';

export default function Header({ searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const { isAdmin, logout, setShowLoginModal } = useContext(VoiceContext);

  return (
    <header className="sticky top-0 z-50" style={{
      width: '100%',
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
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
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#22d3ee';
              e.currentTarget.style.backgroundColor = 'rgba(8, 145, 178, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#9ca3af';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <ArrowLeft size={18} />
          </button>
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
            <Mic size={20} color="white" />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#ffffff',
              margin: 0,
              letterSpacing: '-0.5px',
            }}>Voice Vault</h1>
            <p style={{
              fontSize: '0.75rem',
              color: '#9ca3af',
              margin: '0.25rem 0 0 0',
            }}>AI Voice Sample Library</p>
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

        {/* Search & Auth Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flex: '1',
          minWidth: '250px',
          justifyContent: 'flex-end',
        }}>
          {/* Search Bar */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '300px',
          }}>
            <input
              type="text"
              placeholder="Search voices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '9999px',
                paddingLeft: '0.75rem',
                paddingRight: '1rem',
                paddingTop: '0.625rem',
                paddingBottom: '0.625rem',
                fontSize: '0.875rem',
                color: '#ffffff',
                outline: 'none',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(15, 23, 42, 0.7)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(15, 23, 42, 0.5)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
            />
          </div>

          {/* Auth Button */}
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
              onClick={() => setShowLoginModal(true)}
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
