# Compliance Confidence Scorecard - Implementation Guide

## Overview

The **Compliance Confidence Scorecard** is a granular risk assessment component that replaces generic compliance alerts. It provides users with clear, actionable compliance decisions using a **4-tier Risk Taxonomy** traffic light system and context-specific action buttons.

**4-Tier Risk Taxonomy**:
- **🔴 CRITICAL (Red)**: Federal/local law violations, forbidden categories → BLOCKED
- **🟠 HIGH (Orange)**: Hard limit violations, regulatory violations → ESCALATE TO VP
- **🟡 MODERATE (Yellow)**: Missing documentation, minor procedural errors → REQUIRES REMEDIAL ACTION
- **🟢 LOW (Green)**: Fully compliant, within acceptable discretionary thresholds → AUTO-APPROVED

---

## 🎨 Component Architecture

### ComplianceConfidenceScorecard.jsx
**Location**: `/src/components/ComplianceConfidenceScorecard.jsx`

A React component that displays compliance risk assessments with:
- **4-tier traffic light system** (Low/Moderate/High/Critical)
- Dynamic risk-specific action buttons (1-2 per risk level)
- Collapsible details and source citations
- Animated progress bar showing confidence level (0-100%)

### Risk Levels Explained (4-Tier Risk Taxonomy)

#### 🟢 **LOW** (Green) - Approved
- **Status**: Fully compliant, no issues
- **Badge**: Green background with checkmark icon
- **Confidence Score**: 100% ✓
- **Description**: "This transaction meets all compliance requirements."
- **Available Actions**:
  - ✓ Accept Compliance (confirm acceptance)
- **When It Appears**: Response contains "compliant", "allowed", "permitted", "approved", "within limits", "no issues" or status = 'LOW'

#### 🟡 **MODERATE** (Yellow) - Flagged
- **Status**: Compliant but requires documentation/approval to proceed
- **Badge**: Yellow background with warning triangle icon
- **Confidence Score**: 50%
- **Description**: "This transaction requires additional documentation or approval before proceeding."
- **Available Actions**:
  - 📄 Generate Affidavit (for missing documentation)
  - 📨 Request Approval (for manager sign-off)
- **When It Appears**: Response contains "documentation", "requires review", "approval", "receipt", "missing form", "affidavit", "procedural", "remedial" or status = 'MODERATE'

#### 🟠 **HIGH** (Orange) - Escalate
- **Status**: Hard limit violation, requires VP approval to proceed
- **Badge**: Orange background with alert icon
- **Confidence Score**: 25%
- **Description**: "This transaction exceeds hard limits and requires VP approval to proceed."
- **Available Actions**:
  - ⚡ Escalate to VP (request VP override approval)
  - 📨 Request Override (formal override request)
- **When It Appears**: Response contains "violates hard limit", "exceeds limit", "over 20%", "business class", "vp approval", "regulatory", "significant risk", "requires vp", "escalate to vp" or status = 'HIGH'

#### 🔴 **CRITICAL** (Red) - Blocked
- **Status**: Federal/local law violation or explicitly forbidden, transaction immediately rejected
- **Badge**: Red background with alert icon
- **Confidence Score**: 0%
- **Description**: "This transaction violates federal/local law or explicitly forbidden policies and has been blocked."
- **Available Actions**:
  - ⚡ Escalate to Compliance (notify Compliance Officer, create high-priority ticket)
  - 📊 View Risk Report (detailed violation analysis with policy references)
- **When It Appears**: Response contains "bribery", "money laundering", "embezzlement", "fraud", "illegal", "federal", "law violation", "criminal", "gambling", "adult entertainment", "explicitly forbidden", "strictly prohibited" or status = 'CRITICAL'

---

## 📊 Component Props

```javascript
<ComplianceConfidenceScorecard
  riskLevel="low|moderate|high|critical"     // Required (4-tier system)
  ruleTriggered="One-sentence rule summary"  // Required
  details="Full compliance analysis text"    // Optional
  sources={["policy section", "..."]}       // Optional array
  onAction={(actionType, metadata) => {}}   // Optional callback
/>
```

### Prop Details

| Prop | Type | Description |
|------|------|-------------|
| **riskLevel** | 'low' \| 'moderate' \| 'high' \| 'critical' | 4-tier Risk Taxonomy classification. Determines badge color, icon, and available actions |
| **ruleTriggered** | string | One-sentence summary of specific rule triggered (e.g., "Exceeds hard limit for purchase approval") |
| **details** | string | Full compliance analysis - shown in collapsible section |
| **sources** | string[] | Policy document sections referenced in the analysis |
| **onAction** | function | Callback when user clicks action button. Receives (actionType, metadata) parameters |

---

## 🔍 Risk Detection Logic

### Compliance Parser (`complianceParser.js`)

The `parseComplianceResponse()` function intelligently extracts risk levels from LLM responses:

```javascript
import { parseComplianceResponse } from '../utils/complianceParser';

const apiResponse = {
  answer: "COMPLIANCE STATUS: RISK DETECTED\n\nANALYSIS: ...",
  compliance_status: "RISK DETECTED",
  sources: [...]
};

const parsed = parseComplianceResponse(apiResponse);
// Returns: {
//   riskLevel: 'critical',  // or 'high', 'moderate', 'low'
//   ruleTriggered: 'Violates federal law - gift for business influence prohibited',
//   details: 'cleaned analysis text',
//   sources: [...],
//   rawStatus: 'CRITICAL'
// }
```

### Risk Level Determination Algorithm (4-Tier Risk Taxonomy)

The system analyzes both the `compliance_status` and response content using strict classification:

```javascript
// CRITICAL (Red) - Federal/local law violations - Highest priority
if (answer includes 'bribery' OR 'money laundering' OR 'embezzlement'
    OR 'fraud' OR 'illegal' OR 'federal' OR 'law violation' OR 'criminal'
    OR 'gambling' OR 'adult entertainment' OR 'explicitly forbidden'
    OR 'strictly prohibited' OR status === 'CRITICAL')
  → 'critical'

// HIGH (Orange) - Hard limit violations - Requires VP approval
else if (answer includes ('violates' AND 'hard limit') OR 'exceeds limit'
         OR 'over 20%' OR 'business class' OR 'vp approval' OR 'regulatory'
         OR 'significant risk' OR 'requires vp' OR 'escalate to vp'
         OR status === 'HIGH')
  → 'high'

// MODERATE (Yellow) - Missing documentation/procedural - Requires remedial action
else if (answer includes 'requires review' OR 'documentation' OR 'receipt'
         OR 'missing form' OR 'affidavit' OR 'procedural' OR 'missing approval'
         OR 'lost receipt' OR 'wrong channel' OR 'requires docs' OR 'remedial'
         OR status === 'MODERATE')
  → 'moderate'

// LOW (Green) - Fully compliant - Lowest priority
else if (answer includes 'compliant' OR 'allowed' OR 'permitted'
         OR 'approved' OR 'within limits' OR 'no issues'
         OR status === 'LOW')
  → 'low'

// Default - When unclear, be conservative
else → 'moderate'
```

### Rule Extraction

The parser uses pattern matching to extract the specific rule:

```javascript
// Patterns checked in order:
1. "exceeds/violates [rule]"
2. "[violation] because/due to/for [reason]"
3. "risk/concern: [issue]"
4. "analysis: [detail]"

// Example:
Input: "ANALYSIS: Violates gift limit because amount exceeds $100 USD per year"
Output: "Violates gift limit because amount exceeds $100 USD per year"
```

---

## 🎯 Action Button Behavior

### Green (Approved) Actions

**Accept Compliance**
- Confirms the transaction is acceptable
- Logs acceptance with timestamp
- Shows confirmation: "Compliance accepted. Document archived."
- Suitable for routine approvals

### Yellow (Flagged) Actions

**Generate Affidavit**
- Triggers document generation workflow
- Creates legal declaration of compliance intent
- Suitable for missing receipts, gift notifications
- System logs: "Generating affidavit form..."

**Request Approval**
- Sends request to manager/supervisor
- Creates workflow task for approval
- Suitable for items needing sign-off
- System logs: "Approval request sent to manager..."

### Red (Blocked) Actions

**Escalate to Compliance**
- Immediately escalates to Compliance Officer
- Creates high-priority ticket
- Blocks transaction pending review
- System logs: "Case escalated to Compliance Officer..."

**View Risk Report**
- Generates detailed violation analysis
- Includes specific policy sections violated
- Suitable for understanding root causes
- System logs: "Generating detailed risk report..."

---

## 💻 Integration in Compliance.jsx

### 1. Import the Component

```javascript
import ComplianceConfidenceScorecard from '../components/ComplianceConfidenceScorecard';
import { parseComplianceResponse, formatComplianceAction } from '../utils/complianceParser';
```

### 2. Parse API Response

```javascript
const data = await response.json();

// Parse for granular risk details
const parsedCompliance = parseComplianceResponse(data);

const aiMessage = {
  id: conversation.length + 3,
  type: 'ai',
  message: data.answer,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  compliance: parsedCompliance.riskLevel,      // 'low'|'moderate'|'high'|'critical' (4-tier system)
  sources: data.sources,
  ruleTriggered: parsedCompliance.ruleTriggered,
  details: parsedCompliance.details,
  rawStatus: parsedCompliance.rawStatus
};
```

### 3. Render the Scorecard

```javascript
{msg.type === 'ai' && (
  <>
    <ComplianceConfidenceScorecard
      riskLevel={msg.compliance}
      ruleTriggered={msg.ruleTriggered}
      details={msg.details}
      sources={msg.sources}
      onAction={handleScorecardAction}
    />
    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
      {msg.timestamp}
    </p>
  </>
)}
```

### 4. Handle Actions

```javascript
const handleScorecardAction = (actionType, metadata) => {
  // Format the action for logging
  const formattedAction = formatComplianceAction(actionType, metadata);
  console.log('Compliance Action:', formattedAction);

  // Show confirmation message
  const confirmationMessages = {
    accept: 'Compliance accepted. Document archived.',
    generateAffidavit: 'Generating affidavit form...',
    requestApproval: 'Approval request sent to manager...',
    escalate: 'Case escalated to Compliance Officer...',
    viewReport: 'Generating detailed risk report...'
  };

  const confirmationMsg = {
    id: conversation.length + 1,
    type: 'system',
    message: confirmationMessages[actionType],
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    action: actionType,
    metadata
  };

  setConversation(prev => [...prev, confirmationMsg]);
};
```

### 5. Display System Messages

```javascript
{msg.type === 'system' && (
  <div style={{
    padding: '0.875rem 1rem',
    background: 'rgba(8, 145, 178, 0.1)',
    borderRadius: '8px',
    color: '#cbd5e1',
    fontSize: '0.875rem'
  }}>
    <p>✓ {msg.message}</p>
    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
      {msg.timestamp}
    </p>
  </div>
)}
```

---

## 🎨 Visual Design

### Color Scheme

```
Approved (Green):
  Primary:    #22c55e
  Light:      #86efac
  Background: rgba(34, 197, 94, 0.15)
  Border:     rgba(34, 197, 94, 0.3)

Flagged (Yellow):
  Primary:    #eab308
  Light:      #facc15
  Background: rgba(234, 179, 8, 0.15)
  Border:     rgba(234, 179, 8, 0.3)

Blocked (Red):
  Primary:    #ef4444
  Light:      #fca5a5
  Background: rgba(239, 68, 68, 0.15)
  Border:     rgba(239, 68, 68, 0.3)
```

### Responsive Layout

- **Desktop**: Single column card with full action buttons
- **Tablet**: Card adjusts to 70% width with 2-column action grid
- **Mobile**: Full width with responsive action buttons

### Animations

- **Entrance**: Fade + slide up (0.4s)
- **Details Toggle**: Smooth expand/collapse
- **Action Buttons**: Hover scale (1.02x) with glow effect
- **Progress Bar**: Animated fill (0.6s) with 0.2s delay

---

## 🧪 Testing the Component

### Test Scenario 1: Approved Transaction

**Query**: "Can I give $50 to an employee as a thank you gift?"

**Expected Response**:
```
Risk Level:     🟢 Approved
Rule Triggered: "Gift amount within policy limits"
Action:         Accept Compliance
```

### Test Scenario 2: Flagged Transaction

**Query**: "Can I give a gift to a public official?"

**Expected Response**:
```
Risk Level:     🟡 Flagged
Rule Triggered: "Gift to public official requires documentation"
Actions:        Generate Affidavit, Request Approval
```

### Test Scenario 3: Blocked Transaction

**Query**: "Can I provide a gift to a vendor to influence a contract?"

**Expected Response**:
```
Risk Level:     🔴 Blocked
Rule Triggered: "Bribes and gifts for influence are prohibited"
Actions:        Escalate to Compliance, View Risk Report
```

---

## 📋 User Workflow

```
1. Upload Compliance Policies
   ↓
2. Ask Compliance Question
   ↓
3. System Analyzes with AI
   ↓
4. Compliance Scorecard Displays
   ├─ Risk Level Badge
   ├─ Specific Rule Triggered
   ├─ Detailed Analysis
   └─ Action Buttons
   ↓
5. User Selects Action
   ├─ Accept (Low - Green)
   ├─ Generate/Request (Moderate - Yellow)
   ├─ Escalate VP/Override (High - Orange)
   └─ Escalate/Report (Critical - Red)
   ↓
6. System Logs Action
   ├─ Timestamp
   ├─ Risk Level
   └─ Action Type
   ↓
7. Confirmation Message
   ↓
8. Continue or Ask Next Question
```

---

## 🔒 Security & Audit Trail

The Scorecard component logs compliance actions for audit purposes:

```javascript
// Example audit log for CRITICAL (Red) transaction
{
  action: "Escalated to Compliance Officer",
  riskLevel: "critical",
  color: "RED",
  rule: "Bribes and gifts for influence are prohibited",
  timestamp: "Dec 2, 2025, 2:30:45 PM",
  questionAsked: "Can I provide a gift to a vendor to influence contract...",
  complianceStatus: "BLOCKED"
}

// Example audit log for HIGH (Orange) transaction
{
  action: "Escalated to VP for Approval",
  riskLevel: "high",
  color: "ORANGE",
  rule: "Purchase amount exceeds VP spending limit by 25%",
  timestamp: "Dec 2, 2025, 2:25:30 PM",
  questionAsked: "Can I approve a $15,000 marketing purchase?",
  complianceStatus: "REQUIRES_VP_APPROVAL"
}
```

All actions are:
- Timestamped
- Linked to the specific rule
- Associated with the user's question
- Suitable for compliance audit logs

---

## 🚀 Advanced Usage

### Custom Risk Color Schemes

```javascript
const customScheme = getRiskColorScheme('blocked');
// Returns:
{
  primary: '#ef4444',
  light: '#fca5a5',
  bg: 'rgba(239, 68, 68, 0.1)',
  badge: 'red'
}
```

### Parsing Custom Responses

```javascript
// If API returns non-standard format:
const customParsed = parseComplianceResponse({
  answer: customAnswer,
  compliance_status: customStatus,
  sources: customSources
});
```

### Integration with External Systems

The `onAction` callback can trigger:
- Workflow management systems
- Document generation services
- Notification systems
- Audit logging databases

---

## 📊 Component Statistics

| Metric | Value |
|--------|-------|
| Component Size | ~42 KB (minified) |
| Lines of Code | 250+ |
| Risk Levels | 3 (Approved, Flagged, Blocked) |
| Actions per Level | 1-2 |
| Parser Patterns | 4 intelligent matching patterns |
| Supported Keywords | 20+ compliance indicators |

---

## 🎯 Future Enhancements

1. **Risk Scoring**: Add confidence percentage (0-100%)
2. **Historical Tracking**: Show past similar decisions
3. **Policy References**: Link directly to policy documents
4. **AI Explanation**: Click to see LLM reasoning
5. **Mobile Actions**: Swipe-to-action for mobile devices
6. **Multi-language**: Support for international compliance rules
7. **Export**: Download compliance decision as PDF

---

## 📞 Troubleshooting

### "Component not rendering"
- Verify `riskLevel` is one of: 'low', 'moderate', 'high', or 'critical'
- Check that `parseComplianceResponse()` is called correctly
- Ensure imports are correct
- Check console for any missing prop warnings

### "Actions not triggering"
- Verify `onAction` callback is provided
- Check browser console for errors
- Confirm `actionType` matches expected values: 'accept', 'generateAffidavit', 'requestApproval', 'escalateVP', 'requestOverride', 'escalate', 'viewReport'
- Ensure Compliance.jsx action handler includes all action types

### "Wrong risk level detected"
- Check API response includes `compliance_status` field
- Verify response content matches Risk Taxonomy keywords:
  - CRITICAL: bribery, money laundering, illegal, federal law, gambling, adult entertainment
  - HIGH: violates hard limit, exceeds limit, business class, vp approval, regulatory
  - MODERATE: documentation, receipt, missing form, affidavit, procedural, remedial
  - LOW: compliant, allowed, permitted, approved, within limits
- Test with explicit risk level override by passing riskLevel prop directly

### "Backend API not returning new 4-tier format"
- Verify backend system prompt in main.py includes 4-tier Risk Taxonomy (lines 62-161)
- Check that API response includes `compliance_status` with values: 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'
- Ensure parser can handle both new 4-tier and legacy 3-tier responses

---

## 📚 Reference

- **Component**: `/src/components/ComplianceConfidenceScorecard.jsx`
- **Parser**: `/src/utils/complianceParser.js`
- **Integration**: `/src/pages/Compliance.jsx` (lines 609-627)
- **API**: Expects `compliance_status` and `answer` fields

---

**Version**: 1.0
**Last Updated**: December 2, 2025
**Status**: Production Ready
