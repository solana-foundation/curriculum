# Week 12: Security Best Practices

## Overview

This week focuses on implementing comprehensive security measures for Solana dApps. Topics include protecting against common Web3 vulnerabilities, implementing secure key management, validating inputs, and establishing security monitoring practices.

## Learning Objectives

Learning outcomes for this week include:

1. Implement robust input validation and sanitization
2. Protect against XSS, CSRF, and Web3-specific attacks
3. Secure private key management and wallet interactions
4. Build audit logging and monitoring systems
5. Conduct security audits and penetration testing

## Lessons

### Lesson 1: Input Validation and Sanitization

**Topics Covered:**
- Web3-specific input validation
- Preventing injection attacks
- Validating Solana addresses and transactions
- Content Security Policy (CSP)
- Sanitizing user-generated content

**Lab Exercise: Input Validation and Sanitization**

**1. Input Validation Service:**

**Service Structure:**
- Create ValidationService class with static methods
- Implement Web3-specific validation functions
- Add content sanitization capabilities

**Core Methods:**
- **isValidPublicKey**:
  - Try creating PublicKey instance
  - Return boolean based on success
  - Handle invalid addresses gracefully

- **sanitizeContent**:
  - Use DOMPurify for HTML sanitization
  - Configure allowed tags and attributes
  - Add additional markdown validation
  - Remove dangerous patterns

- **validateTransactionParams**:
  - Define Zod schema for transaction data
  - Validate recipient as valid public key
  - Check amount constraints
  - Convert SOL to lamports

- **validateRateLimit**:
  - Track attempts by user and action
  - Check against configured limits
  - Return allowed status and reset time
  - Implement sliding window algorithm

- **validateFileUpload**:
  - Check file size limits (5MB)
  - Validate MIME types
  - Verify magic numbers
  - Prevent malicious uploads

**2. Secure Form Component:**

**Form Setup:**
- Define Zod schema with comprehensive validation
- Configure react-hook-form with Zod resolver
- Add regex patterns for input formats
- Transform content through sanitization

**Security Features:**
- Rate limit validation before submission
- CSRF token verification
- Secure error handling without exposing internals
- Input validation feedback

**3. Content Security Policy Middleware:**

**Security Headers:**
- Configure CSP directives:
  - Restrict script sources
  - Limit style sources
  - Control connection endpoints
  - Prevent framing attacks
- Add additional security headers:
  - X-Frame-Options
  - X-Content-Type-Options
  - Referrer-Policy
  - Permissions-Policy

**Key Concepts:**
- Input validation strategies
- Content sanitization
- Rate limiting
- CSRF protection
- Security headers

### Lesson 2: Web3 Security and Key Management

**Topics Covered:**
- Secure wallet interactions
- Private key protection
- Transaction verification
- Phishing prevention
- Smart contract interaction security

**Lab Exercise: Web3 Security and Key Management**

**1. Secure Wallet Service:**

**Service Structure:**
- Create class with transaction timeout constant
- Maintain map of pending transactions
- Implement verification and security methods

**Core Methods:**
- **verifyTransaction**:
  - Check transaction exists in pending map
  - Verify transaction hasn't expired
  - Validate known programs
  - Detect suspicious patterns
  - Compare expected vs actual amounts
  - Return detailed verification result

- **createSecureTransaction**:
  - Validate all instructions before creation
  - Add transaction to pending map
  - Generate unique transaction ID
  - Clean up expired transactions
  - Return secure transaction object

- **requestMessageSignature**:
  - Add domain and timestamp to message
  - Generate cryptographic nonce
  - Format message with security metadata
  - Store signature details for verification
  - Prevent replay attacks

**Security Checks:**
- **isKnownProgram**: Whitelist known Solana programs
- **isSuspiciousInstruction**: 
  - Check for wallet draining patterns
  - Detect ownership changes
  - Identify malicious instruction data

**2. Transaction Approval Modal:**

**Component Features:**
- Display transaction verification status
- Show security warnings and errors
- Provide approve/reject options
- Disable approval for unsafe transactions

**Verification Flow:**
- Verify transaction on mount
- Display loading state during verification
- Show color-coded warnings/errors
- Present transaction details
- Enable user decision buttons

**3. Phishing Detection Service:**

**Detection Methods:**
- **checkUrl**:
  - Parse and validate URL structure
  - Check against phishing patterns
  - Detect homograph attacks
  - Verify official wallet domains
  - Return safety assessment

**Pattern Detection:**
- Common misspellings (sol[ae]na)
- Fake wallet links
- URL shorteners
- Homograph characters
- Unofficial wallet domains

**Key Concepts:**
- Transaction verification
- Wallet security
- Phishing prevention
- Secure signing
- Program validation

### Lesson 3: Monitoring and Incident Response

**Topics Covered:**
- Security event logging
- Anomaly detection
- Incident response procedures
- Security metrics and dashboards
- Penetration testing basics

**Lab Exercise: Monitoring and Incident Response**

**1. Security Monitoring Service:**

**Service Structure:**
- Initialize with anomaly detector
- Maintain security event history
- Start automatic monitoring on construction

**Core Methods:**
- **logEvent**:
  - Add timestamp and unique ID
  - Check for anomalies
  - Persist to secure storage
  - Trigger alerts if needed

- **monitorWalletActivity**:
  - Fetch recent transactions
  - Check multiple suspicious patterns:
    - Rapid transaction frequency
    - Large transfer amounts
    - Unknown recipients
  - Log high-severity events

- **getSecurityMetrics**:
  - Filter events by time window
  - Group by type and severity
  - Count anomalies
  - Identify top threats
  - Return comprehensive metrics

**Anomaly Detection Patterns:**
- Rapid transactions (>5 per minute)
- Unusual transfer amounts
- New recipient addresses
- Failed authentication spikes
- Rate limit violations

**2. Security Dashboard Component:**

**Dashboard Features:**
- Real-time metric updates (5-second intervals)
- Alert subscription system
- Visual metric cards
- Event timeline display
- Threat analysis section

**UI Components:**
- Active alerts section (red background)
- Metric grid with status indicators
- Security event timeline
- Top threats list
- Auto-refresh functionality

**3. Incident Response System:**

**Response Workflow:**
1. **Isolate** - Enable emergency mode for critical incidents
2. **Log** - Record incident details
3. **Notify** - Alert administrators
4. **Act** - Take automated actions:
   - Block IP addresses for brute-force
   - Pause transactions for suspicious activity
   - Revoke sessions for data breaches
5. **Report** - Generate incident documentation

**Emergency Mode Features:**
- Disable critical functions
- Broadcast to all clients
- Store emergency state
- Log activation details

**4. Penetration Testing Utilities:**

**Testing Capabilities:**
- **Input Validation Tests**:
  - XSS payload testing
  - SQL injection attempts
  - Script injection patterns
  - Result verification

**Test Payloads:**
- Common XSS vectors
- SQL injection patterns
- JavaScript execution attempts
- Image-based attacks

**Test Results:**
- Track blocked vs allowed
- Compare sanitized output
- Record error messages
- Generate security report

**Key Concepts:**
- Security monitoring
- Anomaly detection
- Incident response
- Security metrics
- Penetration testing

## Practical Assignment

### Implement Comprehensive Security

Build a complete security system for your note-taking dApp:

1. **Input Security**
   - Validate all user inputs
   - Sanitize content properly
   - Implement rate limiting
   - Add CSRF protection

2. **Wallet Security**
   - Transaction verification
   - Phishing detection
   - Secure message signing
   - Wallet activity monitoring

3. **Monitoring System**
   - Security event logging
   - Real-time alerts
   - Anomaly detection
   - Security dashboard

4. **Incident Response**
   - Automated responses
   - Emergency procedures
   - Incident reporting
   - Recovery mechanisms

**Requirements:**
- Zero security warnings in audit
- All inputs validated
- Monitoring dashboard functional
- Incident response tested
- Documentation complete

**Security Checklist:**
- [ ] CSP headers configured
- [ ] Input validation on all forms
- [ ] Rate limiting implemented
- [ ] Transaction verification
- [ ] Security monitoring active
- [ ] Incident response plan
- [ ] Regular security audits

## Additional Resources

### Security Tools
- [OWASP ZAP](https://www.zaproxy.org/) - Security testing
- [Burp Suite](https://portswigger.net/burp) - Web vulnerability scanner
- [Mythril](https://github.com/ConsenSys/mythril) - Smart contract analysis
- [SonarQube](https://www.sonarqube.org/) - Code security analysis

### Security Standards
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web3 Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [Solana Security Guidelines](https://docs.solana.com/developing/on-chain-programs/developing-rust#security-considerations)

### Learning Resources
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [Immunefi Bug Bounty Platform](https://immunefi.com/)
- [Damn Vulnerable DeFi](https://www.damnvulnerabledefi.xyz/)

## Common Issues and Solutions

### Issue: CSP blocking legitimate resources
**Solution:** Whitelist specific domains:
```typescript
"connect-src 'self' https://api.solana.com https://*.ipfs.io"
```

### Issue: Rate limiting affecting legitimate users
**Solution:** Implement smart rate limiting:
```typescript
// Different limits for different actions
const limits = {
    read: { max: 100, window: 60000 },
    write: { max: 10, window: 60000 },
    delete: { max: 5, window: 300000 },
};
```

### Issue: False positive security alerts
**Solution:** Tune detection algorithms:
```typescript
// Add context awareness
if (user.reputation > 0.8) {
    threshold *= 1.5; // Higher threshold for trusted users
}
```

## Week 12 Quiz Questions

1. What are the main Web3-specific security risks?
2. How do you prevent transaction manipulation?
3. What's the purpose of CSP headers?
4. How do you detect anomalous behavior?
5. What should an incident response plan include?

## Hands-On Challenge

### Security Audit Challenge

Conduct a full security audit:
1. Run automated security scans
2. Perform manual penetration testing
3. Review all input validation
4. Test incident response
5. Document all findings

Create a report with:
- Executive summary
- Detailed findings
- Risk ratings
- Remediation steps
- Testing evidence

## Looking Ahead

Next week covers deployment and monitoring:
- Production deployment strategies
- CI/CD pipelines
- Monitoring and alerting
- Performance tracking
- A/B testing

Prerequisites include ensuring security measures are thoroughly tested before deployment.