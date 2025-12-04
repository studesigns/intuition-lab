import { Trash2, Star, Edit2 } from 'lucide-react';
import { formatDuration } from '../utils/cloudinaryHelper';

export default function CompactVideoList({
  videos,
  onDelete,
  onToggleFeatured,
  onPreview,
  onEdit,
}) {
  if (!videos || videos.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem 2rem',
        color: '#9ca3af',
      }}>
        <p style={{ fontSize: '0.875rem', margin: 0 }}>
          No videos uploaded yet
        </p>
      </div>
    );
  }

  return (
    <div style={{
      overflowX: 'auto',
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.875rem',
      }}>
        <thead>
          <tr style={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(30, 41, 59, 0.3)',
          }}>
            <th style={{
              padding: '0.75rem',
              textAlign: 'left',
              fontWeight: '600',
              color: '#cbd5e1',
              width: '60px',
            }}>
              Thumbnail
            </th>
            <th style={{
              padding: '0.75rem',
              textAlign: 'left',
              fontWeight: '600',
              color: '#cbd5e1',
            }}>
              Title
            </th>
            <th style={{
              padding: '0.75rem',
              textAlign: 'left',
              fontWeight: '600',
              color: '#cbd5e1',
              width: '120px',
            }}>
              Client
            </th>
            <th style={{
              padding: '0.75rem',
              textAlign: 'left',
              fontWeight: '600',
              color: '#cbd5e1',
              width: '100px',
            }}>
              Duration
            </th>
            <th style={{
              padding: '0.75rem',
              textAlign: 'left',
              fontWeight: '600',
              color: '#cbd5e1',
              flex: 1,
            }}>
              Tags
            </th>
            <th style={{
              padding: '0.75rem',
              textAlign: 'center',
              fontWeight: '600',
              color: '#cbd5e1',
              width: '100px',
            }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video, index) => (
            <tr
              key={video.id}
              style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(30, 41, 59, 0.2)',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(8, 145, 178, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'transparent' : 'rgba(30, 41, 59, 0.2)';
              }}
            >
              {/* Thumbnail */}
              <td style={{
                padding: '0.75rem',
              }}>
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  style={{
                    width: '50px',
                    height: '40px',
                    borderRadius: '4px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                  }}
                  onClick={() => onPreview && onPreview(video)}
                />
              </td>

              {/* Title */}
              <td style={{
                padding: '0.75rem',
                color: '#e2e8f0',
                maxWidth: '200px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
                onClick={() => onPreview && onPreview(video)}
              >
                {video.title}
              </td>

              {/* Client */}
              <td style={{
                padding: '0.75rem',
                color: '#cbd5e1',
                maxWidth: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {video.clientName}
              </td>

              {/* Duration */}
              <td style={{
                padding: '0.75rem',
                color: '#9ca3af',
                fontSize: '0.8rem',
              }}>
                {formatDuration(video.duration)}
              </td>

              {/* Tags */}
              <td style={{
                padding: '0.75rem',
              }}>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                }}>
                  {video.industries && video.industries.slice(0, 2).map(industry => (
                    <span
                      key={industry}
                      style={{
                        background: 'rgba(8, 145, 178, 0.2)',
                        color: '#22d3ee',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {industry}
                    </span>
                  ))}
                  {video.industries && video.industries.length > 2 && (
                    <span style={{
                      color: '#64748b',
                      fontSize: '0.7rem',
                      paddingTop: '0.2rem',
                    }}>
                      +{video.industries.length - 2}
                    </span>
                  )}
                </div>
              </td>

              {/* Actions */}
              <td style={{
                padding: '0.75rem',
                display: 'flex',
                gap: '0.5rem',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                {/* Featured Toggle */}
                <button
                  onClick={() => onToggleFeatured && onToggleFeatured(video.id, video.isFeatured)}
                  style={{
                    minWidth: '32px',
                    width: '32px',
                    height: '32px',
                    padding: '0',
                    background: video.isFeatured ? '#fbbf24' : 'rgba(100, 116, 139, 0.5)',
                    border: 'none',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 0 8px rgba(8, 145, 178, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  title={video.isFeatured ? 'Remove from featured' : 'Add to featured'}
                >
                  <Star size={18} color={video.isFeatured ? '#000000' : '#ffffff'} fill={video.isFeatured ? '#fbbf24' : 'none'} strokeWidth={2} />
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => onEdit && onEdit(video)}
                  style={{
                    minWidth: '32px',
                    width: '32px',
                    height: '32px',
                    padding: '0',
                    background: '#0891b2',
                    border: 'none',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#06b6d4';
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 0 8px rgba(8, 145, 178, 0.8)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#0891b2';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  title="Edit video"
                >
                  <Edit2 size={18} color="#ffffff" strokeWidth={2} />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => {
                    if (window.confirm(`Delete "${video.title}"? This action cannot be undone.`)) {
                      onDelete && onDelete(video.id, video.cloudinaryPublicId);
                    }
                  }}
                  style={{
                    minWidth: '32px',
                    width: '32px',
                    height: '32px',
                    padding: '0',
                    background: '#dc2626',
                    border: 'none',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#b91c1c';
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 0 8px rgba(220, 38, 38, 0.8)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#dc2626';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  title="Delete video"
                >
                  <Trash2 size={18} color="#ffffff" strokeWidth={2} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
