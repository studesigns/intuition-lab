import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Send,
  Zap,
  Download,
  Clock
} from 'lucide-react';
import { useState } from 'react';

/**
 * Compliance Confidence Scorecard Component
 * Displays risk level with granular compliance information and dynamic actions
 *
 * Supports 4-tier Risk Taxonomy:
 *   - 'critical' (RED): Federal/local law violations, forbidden categories → BLOCKED
 *   - 'high' (ORANGE): Hard limit violations, regulatory violations → ESCALATE TO VP
 *   - 'moderate' (YELLOW): Missing documentation, procedural errors → REQUIRES REMEDIAL ACTION
 *   - 'low' (GREEN): Fully compliant → AUTO-APPROVED
 *
 * Props:
 *   - riskLevel: 'critical' | 'high' | 'moderate' | 'low'
 *   - ruleTriggered: string (one-sentence summary of the rule)
 *   - details: string (full compliance analysis)
 *   - sources: string[] (policy sources)
 *   - onAction: function (callback for action button click)
 */
export default function ComplianceConfidenceScorecard({
  riskLevel = 'moderate',
  ruleTriggered = 'Risk assessment pending...',
  details = '',
  sources = [],
  onAction = () => {}
}) {
  const [showDetails, setShowDetails] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);

  // Risk configuration with colors, icons, and actions for 4-tier system
  const RISK_CONFIG = {
    low: {
      badge: 'Approved',
      bgColor: 'rgba(34, 197, 94, 0.15)',
      borderColor: 'rgba(34, 197, 94, 0.3)',
      badgeBg: 'rgba(34, 197, 94, 0.2)',
      badgeText: '#86efac',
      headerColor: '#22c55e',
      icon: CheckCircle2,
      iconColor: '#22c55e',
      actions: [
        {
          label: 'Accept Compliance',
          icon: CheckCircle2,
          color: '#22c55e',
          hoverColor: '#16a34a',
          onClick: 'accept'
        }
      ],
      description: 'This transaction meets all compliance requirements.',
      confidence: 100
    },
    moderate: {
      badge: 'Flagged',
      bgColor: 'rgba(234, 179, 8, 0.15)',
      borderColor: 'rgba(234, 179, 8, 0.3)',
      badgeBg: 'rgba(234, 179, 8, 0.2)',
      badgeText: '#facc15',
      headerColor: '#eab308',
      icon: AlertTriangle,
      iconColor: '#eab308',
      actions: [
        {
          label: 'Generate Affidavit',
          icon: FileText,
          color: '#eab308',
          hoverColor: '#ca8a04',
          onClick: 'generateAffidavit'
        },
        {
          label: 'Request Approval',
          icon: Send,
          color: '#0891b2',
          hoverColor: '#0e7490',
          onClick: 'requestApproval'
        }
      ],
      description: 'This transaction requires additional documentation or approval before proceeding.',
      confidence: 50
    },
    high: {
      badge: 'Escalate',
      bgColor: 'rgba(234, 88, 12, 0.15)',
      borderColor: 'rgba(234, 88, 12, 0.3)',
      badgeBg: 'rgba(234, 88, 12, 0.2)',
      badgeText: '#fed7aa',
      headerColor: '#ea580c',
      icon: AlertCircle,
      iconColor: '#ea580c',
      actions: [
        {
          label: 'Escalate to VP',
          icon: Zap,
          color: '#ea580c',
          hoverColor: '#c2410c',
          onClick: 'escalateVP'
        },
        {
          label: 'Request Override',
          icon: Send,
          color: '#ea580c',
          hoverColor: '#c2410c',
          onClick: 'requestOverride'
        }
      ],
      description: 'This transaction exceeds hard limits and requires VP approval to proceed.',
      confidence: 25
    },
    critical: {
      badge: 'Blocked',
      bgColor: 'rgba(239, 68, 68, 0.15)',
      borderColor: 'rgba(239, 68, 68, 0.3)',
      badgeBg: 'rgba(239, 68, 68, 0.2)',
      badgeText: '#fca5a5',
      headerColor: '#ef4444',
      icon: AlertCircle,
      iconColor: '#ef4444',
      actions: [
        {
          label: 'Escalate to Compliance',
          icon: Zap,
          color: '#ef4444',
          hoverColor: '#dc2626',
          onClick: 'escalate'
        },
        {
          label: 'View Risk Report',
          icon: FileText,
          color: '#ef4444',
          hoverColor: '#dc2626',
          onClick: 'viewReport'
        }
      ],
      description: 'This transaction violates federal/local law or explicitly forbidden policies and has been blocked.',
      confidence: 0
    }
  };

  const config = RISK_CONFIG[riskLevel] || RISK_CONFIG.moderate;
  const IconComponent = config.icon;

  const handleActionClick = (actionType) => {
    setActionInProgress(true);
    onAction(actionType, {
      riskLevel,
      ruleTriggered,
      details,
      timestamp: new Date().toISOString()
    });
    // Reset after action
    setTimeout(() => setActionInProgress(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        padding: '1.5rem',
        background: config.bgColor,
        border: `1px solid ${config.borderColor}`,
        borderRadius: '12px',
        marginBottom: '1rem',
      }}
    >
      {/* Header Section with Risk Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        marginBottom: '1rem',
      }}>
        <div style={{
          flexShrink: 0,
          marginTop: '0.25rem',
        }}>
          <IconComponent size={24} color={config.iconColor} />
        </div>

        <div style={{ flex: 1 }}>
          {/* Risk Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            background: config.badgeBg,
            border: `1px solid ${config.borderColor}`,
            borderRadius: '6px',
            marginBottom: '0.75rem',
          }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: config.headerColor,
              }}
            />
            <span style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: config.badgeText,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {config.badge}
            </span>
          </div>

          {/* Rule Triggered Header */}
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '700',
            color: '#f1f5f9',
            margin: '0 0 0.5rem 0',
            lineHeight: '1.4',
          }}>
            {ruleTriggered}
          </h3>

          {/* Description */}
          <p style={{
            fontSize: '0.875rem',
            color: '#cbd5e1',
            margin: '0 0 1rem 0',
            lineHeight: '1.5',
          }}>
            {config.description}
          </p>
        </div>
      </div>

      {/* Details Section (Collapsible) */}
      {details && (
        <>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                marginBottom: '1rem',
                paddingBottom: '1rem',
                borderBottom: `1px solid ${config.borderColor}`,
              }}
            >
              <div style={{
                fontSize: '0.875rem',
                color: '#cbd5e1',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                maxHeight: '200px',
                overflowY: 'auto',
              }}>
                {details}
              </div>
            </motion.div>
          )}

          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              background: 'none',
              border: 'none',
              color: '#0891b2',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '1rem',
              textDecoration: 'underline',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => e.target.style.color = '#0e7490'}
            onMouseLeave={(e) => e.target.style.color = '#0891b2'}
          >
            {showDetails ? '▼ Hide Details' : '▶ Show Details'}
          </button>
        </>
      )}

      {/* Sources Section */}
      {sources && sources.length > 0 && (
        <div style={{
          marginBottom: '1rem',
          paddingBottom: '1rem',
          borderBottom: `1px solid ${config.borderColor}`,
        }}>
          <p style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            margin: '0 0 0.5rem 0',
          }}>
            Policy Sources
          </p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}>
            {sources.map((source, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.75rem',
                  background: config.badgeBg,
                  border: `1px solid ${config.borderColor}`,
                  borderRadius: '4px',
                  color: config.badgeText,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '150px',
                }}
                title={source}
              >
                📄 {source.substring(0, 40)}...
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: config.actions.length === 1 ? '1fr' : '1fr 1fr',
        gap: '0.75rem',
      }}>
        {config.actions.map((action, idx) => {
          const ActionIcon = action.icon;
          const [isHovering, setIsHovering] = useState(false);

          return (
            <motion.button
              key={idx}
              onClick={() => handleActionClick(action.onClick)}
              disabled={actionInProgress}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: action.color,
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.875rem',
                cursor: actionInProgress ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: actionInProgress ? 0.6 : 1,
                transform: isHovering && !actionInProgress ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isHovering && !actionInProgress
                  ? `0 0 20px ${action.color}40`
                  : 'none',
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              whileHover={!actionInProgress ? { scale: 1.02 } : {}}
              whileTap={!actionInProgress ? { scale: 0.98 } : {}}
            >
              <ActionIcon size={16} />
              <span>{actionInProgress ? 'Processing...' : action.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Risk Level Indicator Bar (Confidence Score) */}
      <div style={{
        marginTop: '1.5rem',
        height: '3px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <motion.div
          initial={{ width: '0%' }}
          animate={{
            width: config.confidence + '%'
          }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            height: '100%',
            background: config.headerColor,
            borderRadius: '2px',
          }}
        />
      </div>
    </motion.div>
  );
}
