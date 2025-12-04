import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

const BUILD_VERSION = new Date().toISOString().split('T')[0]; // Use date as version

export default function VersionCheck() {
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(BUILD_VERSION);

  useEffect(() => {
    // Store the initial version
    const storedVersion = localStorage.getItem('appVersion');
    if (!storedVersion) {
      localStorage.setItem('appVersion', BUILD_VERSION);
      setCurrentVersion(BUILD_VERSION);
      return;
    }

    setCurrentVersion(storedVersion);

    // Check for updates every 30 seconds
    const checkInterval = setInterval(() => {
      // Fetch the index.html to check if there's a new version
      fetch('/index.html', { cache: 'no-store' })
        .then((response) => response.text())
        .then((html) => {
          // A simple version check - if the build hash changed, there's a new version
          // This works because Vite includes a unique hash in the asset filenames
          const newVersionMatch = html.match(/assets\/index-([a-zA-Z0-9]+)\.js/);
          if (newVersionMatch) {
            const newVersion = newVersionMatch[1];
            const storedBuildHash = localStorage.getItem('buildHash');

            if (storedBuildHash && storedBuildHash !== newVersion) {
              // New version detected
              setShowUpdateBanner(true);
              clearInterval(checkInterval);
            } else if (!storedBuildHash) {
              // First load, store the hash
              localStorage.setItem('buildHash', newVersion);
            }
          }
        })
        .catch((error) => {
          console.error('Version check failed:', error);
        });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkInterval);
  }, []);

  const handleRefresh = () => {
    // Clear cache and reload
    localStorage.removeItem('buildHash');
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdateBanner(false);
  };

  if (!showUpdateBanner) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999,
        backgroundColor: '#0891b2',
        border: '1px solid #06b6d4',
        borderRadius: '8px',
        padding: '1rem 1.5rem',
        boxShadow: '0 10px 25px rgba(8, 145, 178, 0.3)',
        maxWidth: '500px',
        width: 'calc(100% - 2rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        animation: 'slideDown 0.3s ease-out',
      }}
    >
      {/* Message */}
      <div style={{ flex: 1 }}>
        <p
          style={{
            color: '#ffffff',
            margin: 0,
            fontSize: '0.875rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <RefreshCw size={16} />
          New version available! Refresh to update.
        </p>
      </div>

      {/* Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          whiteSpace: 'nowrap',
        }}
      >
        <button
          onClick={handleRefresh}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ffffff',
            color: '#0891b2',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.75rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e0f2fe';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
          }}
        >
          Refresh
        </button>

        <button
          onClick={handleDismiss}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.75rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          Dismiss
        </button>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
