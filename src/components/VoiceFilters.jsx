import { CATEGORIES, SOURCES } from '../context/VoiceContext';

export default function VoiceFilters({ activeCategory, setActiveCategory, activeSource, setActiveSource }) {
  return (
    <>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              background: activeCategory === cat ? '#0891b2' : 'transparent',
              color: activeCategory === cat ? '#ffffff' : '#d1d5db',
              border: activeCategory === cat ? '1px solid rgba(8, 145, 178, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              if (activeCategory !== cat) {
                e.currentTarget.style.background = 'rgba(8, 145, 178, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(8, 145, 178, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeCategory !== cat) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Source Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSource('all')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            background: activeSource === 'all' ? '#22d3ee' : 'transparent',
            color: activeSource === 'all' ? '#0c4a6e' : '#d1d5db',
            border: activeSource === 'all' ? '1px solid rgba(34, 211, 238, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            if (activeSource !== 'all') {
              e.currentTarget.style.background = 'rgba(34, 211, 238, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeSource !== 'all') {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }
          }}
        >
          All Sources
        </button>

        {SOURCES.map(source => (
          <button
            key={source.id}
            onClick={() => setActiveSource(source.id)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              background: activeSource === source.id ? 'rgba(34, 211, 238, 0.3)' : 'transparent',
              color: activeSource === source.id ? '#e0f2fe' : '#d1d5db',
              border: activeSource === source.id ? '1px solid rgba(34, 211, 238, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              if (activeSource !== source.id) {
                e.currentTarget.style.background = 'rgba(34, 211, 238, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeSource !== source.id) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }
            }}
          >
            {source.name}
          </button>
        ))}
      </div>
    </>
  );
}
