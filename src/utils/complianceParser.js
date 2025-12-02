/**
 * Compliance Response Parser
 * Extracts granular risk information from API responses
 */

/**
 * Parse compliance status and extract rule details
 * ROBUST PARSER: Handles raw JSON, markdown JSON, and text fallback
 *
 * @param {Object} response - API response object
 * @returns {Object} Parsed compliance data
 */
export function parseComplianceResponse(response) {
  try {
    // ===== ROBUST PARSING: Try to extract JSON from backend =====
    let jsonData = null;
    let riskLevel = 'moderate'; // default
    let ruleTriggered = 'Compliance assessment pending...';
    let details = '';
    let status = 'REQUIRES REVIEW';
    const sources = response.sources || [];

    // Strategy 1: Check if response contains raw JSON structure
    if (response.risk_level) {
      // Backend returned JSON fields directly
      const level = String(response.risk_level).toLowerCase();
      if (['critical', 'high', 'moderate', 'low'].includes(level)) {
        riskLevel = level;
      }
      ruleTriggered = response.violation_summary || 'Compliance decision';
      details = response.detailed_analysis || response.answer || '';
      status = response.compliance_status || status;
    }
    // Strategy 2: Check for risk_classification nested object
    else if (response.risk_classification && response.risk_classification.risk_level) {
      const level = String(response.risk_classification.risk_level).toLowerCase();
      if (['critical', 'high', 'moderate', 'low'].includes(level)) {
        riskLevel = level;
      }
      ruleTriggered = response.violation_summary || 'Compliance decision';
      details = response.detailed_analysis || response.answer || '';
      status = response.compliance_status || status;
    }
    // Strategy 3: Fallback to text parsing (legacy format)
    else {
      const answer = response.answer || '';
      riskLevel = determineRiskLevel(answer, response.compliance_status || 'REQUIRES REVIEW');
      ruleTriggered = response.violation_summary || extractRuleTriggered(answer);
      details = cleanupDetails(answer);
      status = response.compliance_status || 'REQUIRES REVIEW';
    }

    return {
      riskLevel: riskLevel,  // CRITICAL, HIGH, MODERATE, LOW - drives card color
      ruleTriggered: ruleTriggered,
      details: details,
      sources: sources,
      rawStatus: status
    };
  } catch (err) {
    console.error('Parse error:', err);
    // Graceful fallback
    return {
      riskLevel: 'moderate',
      ruleTriggered: 'Error processing compliance data',
      details: 'Please try again',
      sources: [],
      rawStatus: 'REQUIRES REVIEW'
    };
  }
}

/**
 * Determine risk level from compliance status and answer content
 * Now uses the 4-tier Risk Taxonomy: CRITICAL, HIGH, MODERATE, LOW
 * @returns {string} 'critical' | 'high' | 'moderate' | 'low'
 */
function determineRiskLevel(answer, status) {
  const answerLower = answer.toLowerCase();

  // CRITICAL (Red) - Federal/local law violations, forbidden categories
  if (
    answerLower.includes('bribery') ||
    answerLower.includes('money laundering') ||
    answerLower.includes('embezzlement') ||
    answerLower.includes('fraud') ||
    answerLower.includes('illegal') ||
    answerLower.includes('federal') ||
    answerLower.includes('law violation') ||
    answerLower.includes('criminal') ||
    answerLower.includes('gambling') ||
    answerLower.includes('adult entertainment') ||
    answerLower.includes('explicitly forbidden') ||
    answerLower.includes('strictly prohibited') ||
    status === 'CRITICAL'
  ) {
    return 'critical';
  }

  // HIGH (Orange) - Hard limit violations, regulatory violations
  if (
    (answerLower.includes('violat') && answerLower.includes('hard limit')) ||
    answerLower.includes('exceeds limit') ||
    answerLower.includes('over 20%') ||
    answerLower.includes('business class') ||
    answerLower.includes('vp approval') ||
    answerLower.includes('regulatory') ||
    answerLower.includes('significant risk') ||
    answerLower.includes('requires vp') ||
    answerLower.includes('escalate to vp') ||
    status === 'HIGH'
  ) {
    return 'high';
  }

  // MODERATE (Yellow) - Missing documentation, minor errors
  if (
    answerLower.includes('requires review') ||
    answerLower.includes('documentation') ||
    answerLower.includes('receipt') ||
    answerLower.includes('missing form') ||
    answerLower.includes('affidavit') ||
    answerLower.includes('procedural') ||
    answerLower.includes('missing approval') ||
    answerLower.includes('lost receipt') ||
    answerLower.includes('wrong channel') ||
    answerLower.includes('requires docs') ||
    answerLower.includes('remedial') ||
    status === 'MODERATE'
  ) {
    return 'moderate';
  }

  // LOW (Green) - Fully compliant
  if (
    answerLower.includes('compliant') ||
    answerLower.includes('allowed') ||
    answerLower.includes('permitted') ||
    answerLower.includes('approved') ||
    answerLower.includes('within limits') ||
    answerLower.includes('no issues') ||
    status === 'LOW'
  ) {
    return 'low';
  }

  // Default - when unclear, be conservative
  return 'moderate';
}

/**
 * Extract the main rule/reason from the response
 * Returns a one-sentence summary
 */
function extractRuleTriggered(answer) {
  const lines = answer.split('\n').filter(line => line.trim());

  // Look for specific patterns
  const patterns = [
    /(?:exceeds|exceeding|over)\s+(?:the\s+)?(.+?)(?:\.|,|;)/i,
    /(?:violat|prohibit|not allow|restrict).+?(?:because|due to|for)\s+(.+?)(?:\.|,|;)/i,
    /(?:risk|concern|issue).*?:\s*(.+?)(?:\.|,|;)/i,
    /^(?:analysis|compliance\s+status|risk):\s*(.+?)(?:\.|,|;)/i,
  ];

  for (const pattern of patterns) {
    for (const line of lines) {
      const match = line.match(pattern);
      if (match && match[1]) {
        let rule = match[1].trim();
        // Capitalize first letter
        rule = rule.charAt(0).toUpperCase() + rule.slice(1);
        // Limit to reasonable length
        if (rule.length > 80) {
          rule = rule.substring(0, 77) + '...';
        }
        return rule;
      }
    }
  }

  // Fallback: use first meaningful line
  for (const line of lines) {
    if (
      line.length > 10 &&
      !line.startsWith('COMPLIANCE') &&
      !line.startsWith('ANALYSIS') &&
      !line.includes('http')
    ) {
      let rule = line.trim();
      // Remove bold markers if any
      rule = rule.replace(/\*\*/g, '').replace(/\*\*/g, '');
      // Limit length
      if (rule.length > 80) {
        rule = rule.substring(0, 77) + '...';
      }
      return rule;
    }
  }

  return 'Compliance assessment in progress...';
}

/**
 * Clean up and format the response details
 * Removes headers and formats for display
 */
function cleanupDetails(answer) {
  // Remove multiple newlines
  let cleaned = answer.replace(/\n\n+/g, '\n\n');

  // Remove common headers that will be shown separately
  cleaned = cleaned.replace(/^COMPLIANCE STATUS:.*?\n/gim, '');
  cleaned = cleaned.replace(/^ANALYSIS:/m, '');

  // Remove markdown formatting
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, '$1');
  cleaned = cleaned.replace(/\*(.+?)\*/g, '$1');

  // Limit length
  const maxLength = 400;
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength) + '...';
  }

  return cleaned.trim();
}

/**
 * Format compliance action for logging/tracking
 * Supports all 4-tier Risk Taxonomy action types
 */
export function formatComplianceAction(actionType, metadata) {
  const timestamp = new Date(metadata.timestamp).toLocaleString();

  const actionMap = {
    // Low (Approved) Risk Actions
    accept: 'Accepted Compliance',

    // Moderate (Flagged) Risk Actions
    generateAffidavit: 'Generated Affidavit',
    requestApproval: 'Requested Manager Approval',

    // High (Escalate) Risk Actions
    escalateVP: 'Escalated to VP for Approval',
    requestOverride: 'Requested VP Override',

    // Critical (Blocked) Risk Actions
    escalate: 'Escalated to Compliance Officer',
    viewReport: 'Viewed Risk Report'
  };

  return {
    action: actionMap[actionType] || actionType,
    riskLevel: metadata.riskLevel,
    timestamp,
    rule: metadata.ruleTriggered
  };
}

/**
 * Get color scheme for a risk level
 * Supports 4-tier Risk Taxonomy: critical, high, moderate, low
 */
export function getRiskColorScheme(riskLevel) {
  const schemes = {
    low: {
      primary: '#22c55e',
      light: '#86efac',
      bg: 'rgba(34, 197, 94, 0.1)',
      badge: 'green'
    },
    moderate: {
      primary: '#eab308',
      light: '#facc15',
      bg: 'rgba(234, 179, 8, 0.1)',
      badge: 'yellow'
    },
    high: {
      primary: '#ea580c',
      light: '#fed7aa',
      bg: 'rgba(234, 88, 12, 0.1)',
      badge: 'orange'
    },
    critical: {
      primary: '#ef4444',
      light: '#fca5a5',
      bg: 'rgba(239, 68, 68, 0.1)',
      badge: 'red'
    },
    // Legacy support for old naming
    approved: {
      primary: '#22c55e',
      light: '#86efac',
      bg: 'rgba(34, 197, 94, 0.1)',
      badge: 'green'
    },
    flagged: {
      primary: '#eab308',
      light: '#facc15',
      bg: 'rgba(234, 179, 8, 0.1)',
      badge: 'yellow'
    },
    blocked: {
      primary: '#ef4444',
      light: '#fca5a5',
      bg: 'rgba(239, 68, 68, 0.1)',
      badge: 'red'
    }
  };

  return schemes[riskLevel] || schemes.moderate;
}
