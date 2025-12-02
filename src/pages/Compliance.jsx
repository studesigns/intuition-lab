import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, Send, ArrowLeft, CheckCircle2, AlertTriangle, Loader } from 'lucide-react';
import TechNodes from '../components/TechNodes';
import '../styles/AuroraBackground.css';

// API Configuration
const API_URL = 'https://intuition-api.onrender.com';

export default function Compliance() {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [querying, setQuerying] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Check API status on mount
  useEffect(() => {
    const checkAPI = async () => {
      try {
        const response = await fetch(`${API_URL}/status`);
        if (response.ok) {
          setError(null);
        }
      } catch (err) {
        setError('Unable to connect to compliance server. Please refresh.');
      }
    };
    checkAPI();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    if (policies.length === 0) {
      setError('Please upload policy documents first');
      return;
    }

    const userMessage = {
      id: conversation.length + 1,
      type: 'user',
      message: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversation(prev => [...prev, userMessage]);
    const question = inputValue;
    setInputValue('');
    setError(null);

    // Add thinking bubble
    const thinkingMessage = {
      id: conversation.length + 2,
      type: 'ai',
      message: 'Analyzing policies...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      compliance: 'reviewing',
      sources: []
    };

    setConversation(prev => [...prev, thinkingMessage]);
    setQuerying(true);

    try {
      const response = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      // Determine compliance status from response
      let complianceStatus = 'reviewing';
      if (data.compliance_status === 'RISK DETECTED') {
        complianceStatus = 'risk';
      } else if (data.compliance_status === 'COMPLIANT') {
        complianceStatus = 'safe';
      }

      const aiMessage = {
        id: conversation.length + 3,
        type: 'ai',
        message: data.answer || 'Unable to analyze policies',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        compliance: complianceStatus,
        sources: data.sources || []
      };

      setConversation(prev => {
        // Replace thinking message with real response
        const updated = prev.slice(0, -1);
        return [...updated, aiMessage];
      });
    } catch (err) {
      console.error('Query error:', err);
      setError('Connecting to secure server... please retry.');

      // Replace thinking message with error
      setConversation(prev => {
        const updated = prev.slice(0, -1);
        return [...updated, {
          id: prev.length,
          type: 'ai',
          message: 'Error: Unable to process your question. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          compliance: 'error',
          sources: []
        }];
      });
    } finally {
      setQuerying(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    // Filter for PDF files only
    const pdfFiles = Array.from(files).filter(f => f.type === 'application/pdf');
    if (pdfFiles.length === 0) {
      setError('Please drop PDF files only');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      pdfFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Add uploaded files to policies list
      const newPolicies = pdfFiles.map((file, idx) => ({
        id: policies.length + idx,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedDate: new Date().toLocaleDateString()
      }));

      setPolicies(prev => [...prev, ...newPolicies]);
      setError(null);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Connecting to secure server... please retry.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="aurora-container">
        <div className="aurora-orb-3"></div>
      </div>

      <TechNodes />

      {/* Back to Dashboard Button */}
      <motion.button
        onClick={() => navigate('/')}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          color: '#cbd5e1',
          fontSize: '0.875rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          zIndex: 100,
        }}
        whileHover={{
          background: 'rgba(30, 41, 59, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(30, 41, 59, 0.95)';
          e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
          e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        }}
      >
        <ArrowLeft size={16} />
        Dashboard
      </motion.button>

      {/* Main Container */}
      <div style={{
        height: 'calc(100vh - 100px)',
        display: 'flex',
        gap: '0px',
        padding: '0px',
        maxWidth: '100%',
        margin: '0 auto',
        marginTop: '100px',
      }}>

        {/* Left Panel: Document Vault (30%) */}
        <motion.div
          style={{
            width: '30%',
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 20,
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Header */}
          <div style={{
            padding: '2rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.5rem',
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#ffffff',
                margin: 0,
              }}>
                Active Policies
              </h2>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.25rem 0.75rem',
                background: 'rgba(34, 197, 94, 0.2)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '9999px',
              }}>
                <CheckCircle2 size={14} style={{ color: '#22c55e' }} />
                <span style={{
                  fontSize: '0.75rem',
                  color: '#86efac',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Ready
                </span>
              </div>
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: '#94a3b8',
              margin: 0,
            }}>
              {policies.length} document{policies.length !== 1 ? 's' : ''} loaded
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '0.75rem 1rem',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '6px',
                margin: '0.5rem 1rem',
                fontSize: '0.75rem',
                color: '#fca5a5',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertTriangle size={14} />
              {error}
            </motion.div>
          )}

          {/* Policy List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            {policies.length === 0 && !uploading && (
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                textAlign: 'center',
                padding: '2rem 1rem',
                fontStyle: 'italic',
              }}>
                No policies uploaded yet. Drop PDFs below to get started.
              </p>
            )}
            <AnimatePresence>
              {policies.map((policy, index) => (
                <motion.div
                  key={policy.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  style={{
                    padding: '1rem',
                    background: 'rgba(30, 41, 59, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
                    e.currentTarget.style.borderColor = 'rgba(8, 145, 178, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.4)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}>
                    <FileText size={18} style={{ color: '#0891b2', marginTop: '0.25rem', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#e2e8f0',
                        margin: '0 0 0.25rem 0',
                        fontWeight: '500',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {policy.name}
                      </p>
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        margin: 0,
                      }}>
                        {policy.size} • {policy.uploadedDate}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Upload Drop Zone */}
          <motion.div
            style={{
              margin: '1rem',
              padding: '2rem',
              border: dragActive ? '2px solid #0891b2' : uploading ? '2px solid rgba(8, 145, 178, 0.5)' : '2px dashed rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              background: dragActive ? 'rgba(8, 145, 178, 0.1)' : uploading ? 'rgba(8, 145, 178, 0.05)' : 'transparent',
              transition: 'all 0.3s ease',
              cursor: uploading ? 'not-allowed' : 'pointer',
              textAlign: 'center',
              opacity: uploading ? 0.7 : 1,
            }}
            onDragEnter={!uploading ? handleDrag : undefined}
            onDragLeave={!uploading ? handleDrag : undefined}
            onDragOver={!uploading ? handleDrag : undefined}
            onDrop={!uploading ? handleDrop : undefined}
            whileHover={!uploading ? {
              borderColor: 'rgba(8, 145, 178, 0.5)',
              background: 'rgba(8, 145, 178, 0.05)',
            } : {}}
          >
            {uploading ? (
              <Loader size={24} style={{
                color: '#0891b2',
                margin: '0 auto 0.75rem',
                display: 'block',
                animation: 'spin 1s linear infinite',
              }} />
            ) : (
              <Upload size={24} style={{
                color: '#0891b2',
                margin: '0 auto 0.75rem',
                display: 'block',
              }} />
            )}
            <p style={{
              fontSize: '0.875rem',
              color: '#cbd5e1',
              margin: '0 0 0.25rem 0',
              fontWeight: '500',
            }}>
              {uploading ? 'Uploading & Indexing...' : 'Drop policies here'}
            </p>
            <p style={{
              fontSize: '0.75rem',
              color: '#64748b',
              margin: 0,
            }}>
              {uploading ? 'Please wait...' : 'or click to browse'}
            </p>
          </motion.div>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </motion.div>

        {/* Right Panel: Intelligence Stream (70%) */}
        <motion.div
          style={{
            width: '70%',
            background: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        >
          {/* Chat Window */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}>
            {conversation.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  gap: '1.5rem',
                }}
              >
                <div style={{
                  padding: '2rem',
                  background: 'rgba(8, 145, 178, 0.1)',
                  border: '1px solid rgba(8, 145, 178, 0.2)',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#cbd5e1',
                    margin: '0 0 0.5rem 0',
                  }}>
                    Compliance Risk Engine Ready
                  </h3>
                  <p style={{
                    fontSize: '0.95rem',
                    color: '#94a3b8',
                    margin: 0,
                    lineHeight: '1.5',
                  }}>
                    {policies.length === 0
                      ? 'Upload compliance policies from the left panel to begin. Drop PDF files to index them, then ask questions about compliance requirements.'
                      : `${policies.length} policy document${policies.length !== 1 ? 's' : ''} loaded. Ask questions to analyze compliance risks.`}
                  </p>
                </div>
              </motion.div>
            )}
            <AnimatePresence>
              {conversation.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  style={{
                    display: 'flex',
                    justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div style={{
                    maxWidth: '70%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}>
                    {msg.type === 'user' && (
                      <>
                        <div style={{
                          padding: '1rem 1.5rem',
                          background: 'rgba(8, 145, 178, 0.2)',
                          border: '1px solid rgba(8, 145, 178, 0.3)',
                          borderRadius: '12px',
                          color: '#e2e8f0',
                          fontSize: '0.95rem',
                          lineHeight: '1.5',
                        }}>
                          {msg.message}
                        </div>
                        <p style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          margin: 0,
                          textAlign: 'right',
                        }}>
                          {msg.timestamp}
                        </p>
                      </>
                    )}

                    {msg.type === 'ai' && (
                      <>
                        {msg.compliance === 'risk' && (
                          <div style={{
                            padding: '1.25rem',
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '12px',
                            display: 'flex',
                            gap: '1rem',
                          }}>
                            <AlertTriangle size={20} style={{
                              color: '#ef4444',
                              flexShrink: 0,
                              marginTop: '0.1rem',
                            }} />
                            <div>
                              <p style={{
                                fontSize: '0.875rem',
                                fontWeight: '700',
                                color: '#fca5a5',
                                margin: '0 0 0.5rem 0',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                              }}>
                                Risk Detected
                              </p>
                              <p style={{
                                fontSize: '0.95rem',
                                color: '#f1f5f9',
                                margin: 0,
                                lineHeight: '1.5',
                              }}>
                                {msg.message}
                              </p>
                              {msg.sources && (
                                <div style={{
                                  display: 'flex',
                                  gap: '0.5rem',
                                  marginTop: '0.75rem',
                                  flexWrap: 'wrap',
                                }}>
                                  {msg.sources.map((source, i) => (
                                    <span key={i} style={{
                                      fontSize: '0.75rem',
                                      padding: '0.25rem 0.75rem',
                                      background: 'rgba(239, 68, 68, 0.2)',
                                      border: '1px solid rgba(239, 68, 68, 0.4)',
                                      borderRadius: '6px',
                                      color: '#fca5a5',
                                      whiteSpace: 'nowrap',
                                    }}>
                                      📄 {source}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {msg.compliance === 'safe' && (
                          <div style={{
                            padding: '1.25rem',
                            background: 'rgba(34, 197, 94, 0.15)',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            borderRadius: '12px',
                            display: 'flex',
                            gap: '1rem',
                          }}>
                            <CheckCircle2 size={20} style={{
                              color: '#22c55e',
                              flexShrink: 0,
                              marginTop: '0.1rem',
                            }} />
                            <div>
                              <p style={{
                                fontSize: '0.875rem',
                                fontWeight: '700',
                                color: '#86efac',
                                margin: '0 0 0.5rem 0',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                              }}>
                                Compliant
                              </p>
                              <p style={{
                                fontSize: '0.95rem',
                                color: '#f1f5f9',
                                margin: 0,
                                lineHeight: '1.5',
                              }}>
                                {msg.message}
                              </p>
                              {msg.sources && (
                                <div style={{
                                  display: 'flex',
                                  gap: '0.5rem',
                                  marginTop: '0.75rem',
                                  flexWrap: 'wrap',
                                }}>
                                  {msg.sources.map((source, i) => (
                                    <span key={i} style={{
                                      fontSize: '0.75rem',
                                      padding: '0.25rem 0.75rem',
                                      background: 'rgba(34, 197, 94, 0.2)',
                                      border: '1px solid rgba(34, 197, 94, 0.4)',
                                      borderRadius: '6px',
                                      color: '#86efac',
                                      whiteSpace: 'nowrap',
                                    }}>
                                      📄 {source}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {msg.compliance === 'reviewing' && (
                          <div style={{
                            padding: '1.25rem',
                            background: 'rgba(8, 145, 178, 0.15)',
                            border: '1px solid rgba(8, 145, 178, 0.3)',
                            borderRadius: '12px',
                            color: '#cbd5e1',
                            fontSize: '0.95rem',
                            lineHeight: '1.5',
                            fontStyle: 'italic',
                          }}>
                            {msg.message}
                          </div>
                        )}

                        <p style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          margin: 0,
                          paddingLeft: '1rem',
                        }}>
                          {msg.timestamp}
                        </p>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* Input Bar */}
          <div style={{
            padding: '2rem',
            background: 'rgba(15, 23, 42, 0.3)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-end',
          }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about compliance policies..."
              style={{
                flex: 1,
                padding: '0.875rem 1.25rem',
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#e2e8f0',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(30, 41, 59, 0.8)';
                e.target.style.borderColor = 'rgba(8, 145, 178, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(30, 41, 59, 0.6)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            />

            <motion.button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              style={{
                padding: '0.875rem 1.5rem',
                background: '#0891b2',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                opacity: inputValue.trim() ? 1 : 0.5,
              }}
              whileHover={inputValue.trim() ? {
                background: '#0e7490',
                boxShadow: '0 0 25px rgba(8, 145, 178, 0.5)',
              } : {}}
              onMouseEnter={(e) => {
                if (inputValue.trim()) {
                  e.currentTarget.style.background = '#0e7490';
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(8, 145, 178, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#0891b2';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Send size={16} />
              Analyze
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
