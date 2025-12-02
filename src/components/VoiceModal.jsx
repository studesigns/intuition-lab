import { useState, useContext } from 'react';
import { VoiceContext, CATEGORIES, SOURCES, LANGUAGES, ACCENTS } from '../context/VoiceContext';

export default function VoiceModal({ onClose, voice = null }) {
  const { addVoice, updateVoice } = useContext(VoiceContext);
  const isEditing = !!voice;

  const [formData, setFormData] = useState(
    voice || {
      name: '',
      category: 'Narration',
      source: 'wellsaid',
      language: 'English',
      accent: 'American',
      description: '',
      audioUrl: '',
      tags: '',
    }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const voiceData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (isEditing) {
        await updateVoice(voice.id, voiceData);
      } else {
        await addVoice(voiceData);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '1rem',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#0f172a',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2 className="text-2xl font-bold text-white mb-1">
          {isEditing ? 'Edit Voice' : 'Add New Voice'}
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          {isEditing ? 'Update voice details' : 'Add a new voice to your library'}
        </p>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            marginBottom: '1rem',
            color: '#fca5a5',
            fontSize: '0.875rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Voice Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.25rem' }}>Voice Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = '#334155';
                e.target.style.borderColor = '#0891b2';
                e.target.style.boxShadow = '0 0 12px rgba(8, 145, 178, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#1e293b';
                e.target.style.borderColor = '#475569';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="e.g., Sarah - Professional"
            />
          </div>

          {/* Category */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.25rem' }}>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = '#334155';
                e.target.style.borderColor = '#0891b2';
                e.target.style.boxShadow = '0 0 12px rgba(8, 145, 178, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#1e293b';
                e.target.style.borderColor = '#475569';
                e.target.style.boxShadow = 'none';
              }}
            >
              {CATEGORIES.filter(cat => cat !== 'All').map(cat => (
                <option key={cat} value={cat} style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Source */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.25rem' }}>Source *</label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = '#334155';
                e.target.style.borderColor = '#0891b2';
                e.target.style.boxShadow = '0 0 12px rgba(8, 145, 178, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#1e293b';
                e.target.style.borderColor = '#475569';
                e.target.style.boxShadow = 'none';
              }}
            >
              {SOURCES.map(source => (
                <option key={source.id} value={source.id} style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>{source.name}</option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.25rem' }}>Language *</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = '#334155';
                e.target.style.borderColor = '#0891b2';
                e.target.style.boxShadow = '0 0 12px rgba(8, 145, 178, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#1e293b';
                e.target.style.borderColor = '#475569';
                e.target.style.boxShadow = 'none';
              }}
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.name} style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>{lang.name}</option>
              ))}
            </select>
          </div>

          {/* Accent */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.25rem' }}>Accent</label>
            <select
              name="accent"
              value={formData.accent}
              onChange={handleChange}
              style={{
                width: '100%',
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = '#334155';
                e.target.style.borderColor = '#0891b2';
                e.target.style.boxShadow = '0 0 12px rgba(8, 145, 178, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#1e293b';
                e.target.style.borderColor = '#475569';
                e.target.style.boxShadow = 'none';
              }}
            >
              {ACCENTS.map(accent => (
                <option key={accent} value={accent} style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>{accent}</option>
              ))}
            </select>
          </div>

          {/* Audio URL */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.25rem' }}>Audio URL *</label>
            <input
              type="url"
              name="audioUrl"
              value={formData.audioUrl}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = '#334155';
                e.target.style.borderColor = '#0891b2';
                e.target.style.boxShadow = '0 0 12px rgba(8, 145, 178, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#1e293b';
                e.target.style.borderColor = '#475569';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="https://..."
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.25rem' }}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={{
                width: '100%',
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
                minHeight: '80px',
                resize: 'vertical',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = '#334155';
                e.target.style.borderColor = '#0891b2';
                e.target.style.boxShadow = '0 0 12px rgba(8, 145, 178, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#1e293b';
                e.target.style.borderColor = '#475569';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="Describe this voice..."
            />
          </div>

          {/* Tags */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.25rem' }}>Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              style={{
                width: '100%',
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = '#334155';
                e.target.style.borderColor = '#0891b2';
                e.target.style.boxShadow = '0 0 12px rgba(8, 145, 178, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#1e293b';
                e.target.style.borderColor = '#475569';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="e.g., friendly, natural, warm"
            />
          </div>

          {/* Buttons - Using Grid to force separation */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginTop: '24px',
            width: '100%'
          }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                fontWeight: 'bold',
                borderRadius: '8px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                opacity: loading ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#b91c1c';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626';
              }}
            >
              {loading ? 'Saving...' : (isEditing ? 'Update' : 'Add')}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'transparent',
                color: '#cbd5e1',
                fontWeight: '600',
                borderRadius: '8px',
                border: '1px solid #475569',
                cursor: 'pointer',
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
          </div>
        </form>
      </div>
    </div>
  );
}
