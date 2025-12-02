import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TechNodes from '../components/TechNodes';
import '../styles/AuroraBackground.css';

export default function Compliance() {
  const navigate = useNavigate();

  return (
    <>
      <div className="aurora-container">
        <div className="aurora-orb-3"></div>
      </div>

      <TechNodes />

      <div style={{ minHeight: '100vh', padding: '3rem 2rem', position: 'relative', zIndex: 10 }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            color: '#e5e7eb',
            cursor: 'pointer',
            fontSize: '1rem',
            marginBottom: '2rem',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#e5e7eb'}
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <div style={{ color: '#fff', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem' }}>Compliance Risk Engine</h1>
          <p style={{ fontSize: '1.2rem', color: '#9ca3af', lineHeight: '1.6' }}>
            This page is coming soon...
          </p>
        </div>
      </div>
    </>
  );
}
