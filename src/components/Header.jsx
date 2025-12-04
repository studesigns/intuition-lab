import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoiceContext } from '../context/VoiceContext';
import { Mic, User, LogOut, Settings, Search } from 'lucide-react';

export default function Header({ searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const { isAdmin, logout, setShowLoginModal } = useContext(VoiceContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await logout();
    setIsDropdownOpen(false);
    // Redirect to non-admin Voice Vault page
    navigate('/vo-player');
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        width: '100%',
        background: isScrolled
          ? '#0a0a0a'
          : 'linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4), transparent)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: 'none',
        transition: 'background-color 0.3s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '1rem 2rem',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
        }}
      >
        {/* Left: Branding + Home Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            flexShrink: 0,
          }}
        >
          {/* Branding */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            {/* Logo Icon */}
            <div
              style={{
                width: '2.25rem',
                height: '2.25rem',
                background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onClick={() => navigate('/vo-player')}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(8, 145, 178, 0.6)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Mic size={18} color="white" />
            </div>

            {/* Title - Minimalist */}
            <h1
              style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                color: '#ffffff',
                margin: 0,
                letterSpacing: '-0.5px',
                cursor: 'pointer',
                transition: 'color 0.3s ease',
              }}
              onClick={() => navigate('/vo-player')}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#22d3ee';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#ffffff';
              }}
            >
              Voice Vault
            </h1>
          </div>

          {/* Home Button */}
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#b0b9c3',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: '0.5rem 0',
              borderBottom: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#b0b9c3';
            }}
          >
            Home
          </button>
        </div>

        {/* Center: Glassmorphic Search Bar */}
        <div
          style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            maxWidth: '400px',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              size={16}
              color="#9ca3af"
              style={{
                position: 'absolute',
                left: '0.75rem',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Search voices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '9999px',
                paddingLeft: '2.5rem',
                paddingRight: '1rem',
                paddingTop: '0.625rem',
                paddingBottom: '0.625rem',
                fontSize: '0.875rem',
                color: '#ffffff',
                outline: 'none',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(0, 0, 0, 0.4)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            />
            <style>{`
              input::placeholder {
                color: #9ca3af;
              }
            `}</style>
          </div>
        </div>

        {/* Right: User Avatar with Dropdown */}
        {isAdmin ? (
          // Admin: User Avatar with Dropdown Menu
          <div
            ref={dropdownRef}
            style={{
              position: 'relative',
              flexShrink: 0,
            }}
          >
            {/* Avatar Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(8, 145, 178, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <User size={20} color="white" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.75rem',
                  background: '#1a1a1a',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                  minWidth: '180px',
                  zIndex: 1000,
                  overflow: 'hidden',
                }}
              >
                {/* Dashboard */}
                <button
                  onClick={() => {
                    navigate('/');
                    setIsDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'none',
                    border: 'none',
                    color: '#b0b9c3',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(8, 145, 178, 0.1)';
                    e.currentTarget.style.color = '#22d3ee';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.color = '#b0b9c3';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span>Dashboard</span>
                </button>

                {/* Sign Out */}
                <button
                  onClick={handleSignOut}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'none',
                    border: 'none',
                    color: '#b0b9c3',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    e.currentTarget.style.color = '#ef4444';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.color = '#b0b9c3';
                  }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          // Guest: Simple "Sign In" Button
          <button
            onClick={() => setShowLoginModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'rgba(8, 145, 178, 0.2)',
              border: '1px solid rgba(8, 145, 178, 0.4)',
              borderRadius: '6px',
              color: '#22d3ee',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(8, 145, 178, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(8, 145, 178, 0.6)';
              e.currentTarget.style.boxShadow = '0 0 12px rgba(8, 145, 178, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(8, 145, 178, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(8, 145, 178, 0.4)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <User size={16} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
