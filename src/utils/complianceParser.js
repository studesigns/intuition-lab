/**
 * Compliance Response Parser
 * Extracts granular risk information from API responses
 */

/**
 * Parse compliance status and extract rule details
 *
 * @param {Object} response - API response object
 * @returns {Object} Parsed compliance data
 */
export function parseComplianceResponse(response) {
  const answer = response.answer || '';
  const status = response.compliance_status || 'REQUIRES REVIEW';
  const sources = response.sources || [];

  return {
    riskLevel: determineRiskLevel(answer, status),
    ruleTriggered: extractRuleTriggered(answer),
    details: cleanupDetails(answer),
    sources: sources,
    rawStatus: status
  };
}

/**
 * Determine risk level from compliance status and answer content
 * @returns {string} 'approved' | 'flagged' | 'blocked'
 */
function determineRiskLevel(answer, status) {
  const answerLower = answer.toLowerCase();

  // Hard violations - Red (Blocked)
  if (
    answerLower.includes('prohibited') ||
    answerLower.includes('not allowed') ||
    answerLower.includes('banned') ||
    answerLower.includes('violat') ||
    answerLower.includes('risk detected') ||
    status === 'RISK DETECTED'
  ) {
    return 'blocked';
  }

  // Requires documentation - Yellow (Flagged)
  if (
    answerLower.includes('requires review') ||
    answerLower.includes('documentation') ||
    answerLower.includes('approval') ||
    answerLower.includes('receipt') ||
    answerLower.includes('flagged') ||
    answerLower.includes('requires') ||
    answerLower.includes('manager approval') ||
    answerLower.includes('compliance review') ||
    status === 'REQUIRES REVIEW'
  ) {
    return 'flagged';
  }

  // Fully compliant - Green (Approved)
  if (
    answerLower.includes('compliant') ||
    answerLower.includes('allowed') ||
    answerLower.includes('permitted') ||
    answerLower.includes('approved') ||
    status === 'COMPLIANT'
  ) {
    return 'approved';
  }

  // Default
  return 'flagged';
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
 */
export function formatComplianceAction(actionType, metadata) {
  const timestamp = new Date(metadata.timestamp).toLocaleString();

  const actionMap = {
    accept: 'Accepted Compliance',
    generateAffidavit: 'Generated Affidavit',
    requestApproval: 'Requested Manager Approval',
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
 */
export function getRiskColorScheme(riskLevel) {
  const schemes = {
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

  return schemes[riskLevel] || schemes.flagged;
}
