import { Trash2, Edit2 } from 'lucide-react';

export default function AdminVoicesTable({ voices, onEditVoice, onDeleteVoice, onToggleFeatured, loading }) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800/80 border-b border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Language / Accent</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Tags</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {voices.map(voice => (
              <tr key={voice.id} className="hover:bg-gray-800/30 transition-colors">
                {/* Featured Toggle Button with Star Icon */}
                <td className="px-6 py-4">
                  <button
                    onClick={() => onToggleFeatured(voice.id, voice.featured)}
                    className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-700 transition-colors"
                    title={voice.featured ? "Remove from Featured" : "Mark as Featured"}
                  >
                    {voice.featured ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                        <polygon points="12 2 15.09 10.26 24 10.26 17.55 16.53 19.64 24.74 12 18.47 4.36 24.74 6.45 16.53 0 10.26 8.91 10.26 12 2"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
                        <polygon points="12 2 15.09 10.26 24 10.26 17.55 16.53 19.64 24.74 12 18.47 4.36 24.74 6.45 16.53 0 10.26 8.91 10.26 12 2"/>
                      </svg>
                    )}
                  </button>
                </td>

                {/* Name */}
                <td className="px-6 py-4 text-sm font-medium text-gray-100">{voice.name}</td>

                {/* Category */}
                <td className="px-6 py-4 text-sm text-gray-400">{voice.category}</td>

                {/* Language / Accent */}
                <td className="px-6 py-4 text-sm text-gray-400">
                  {voice.language && <span>{voice.language}</span>}
                  {voice.language && voice.accent && <span> • </span>}
                  {voice.accent && <span>{voice.accent}</span>}
                </td>

                {/* Tags */}
                <td className="px-6 py-4 text-sm">
                  <div className="flex flex-wrap gap-1">
                    {voice.tags?.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">{tag}</span>
                    ))}
                    {voice.tags?.length > 2 && (
                      <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">+{voice.tags.length - 2}</span>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {/* Edit Button with Pencil Icon */}
                    <button
                      onClick={() => onEditVoice(voice)}
                      className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>

                    {/* Delete Button with Trash Icon */}
                    <button
                      onClick={() => onDeleteVoice(voice)}
                      className="flex items-center justify-center w-8 h-8 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {voices.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">No voices found. Create your first voice to get started.</p>
        </div>
      )}
    </div>
  );
}
