import { useState } from 'react';

export default function AdminAvatar({ imageUrl, name = "Admin User" }) {
  const [isHovered, setIsHovered] = useState(false);

  // Extract initials
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      style={{
        position: 'relative',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Main Avatar Container with Rings & Glow */}
      <div
        style={{
          position: 'relative',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid rgba(6, 182, 212, 0.5)',
          boxShadow: isHovered
            ? '0 0 15px rgba(6, 182, 212, 0.6), inset 0 0 0 2px rgba(15, 23, 42, 0.8)'
            : '0 0 10px rgba(6, 182, 212, 0.5), inset 0 0 0 2px rgba(15, 23, 42, 0.8)',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'scale(1.08)' : 'scale(1)',
        }}
      >
        {/* Avatar Content */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #06b6d4 0%, #0369a1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              color: '#ffffff',
              letterSpacing: '0.05em',
            }}
          >
            {initials}
          </div>
        )}
      </div>

      {/* 2. Status Dot (Online Indicator) */}
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          right: '0',
          width: '12px',
          height: '12px',
          backgroundColor: '#10b981',
          border: '2px solid #0f172a',
          borderRadius: '50%',
          zIndex: 10,
          boxShadow: '0 0 6px rgba(16, 185, 129, 0.6)',
        }}
      />
    </div>
  );
}
