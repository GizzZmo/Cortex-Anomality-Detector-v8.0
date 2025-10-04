# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 8.0.x   | :white_check_mark: |
| < 8.0   | :x:                |

## Reporting a Vulnerability

We take the security of CORTEX Anomaly Detector seriously. If you have discovered a security vulnerability, please report it to us as described below.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via:
- **Email**: Create an issue with "SECURITY" in the title and we'll provide a private channel
- **GitHub Security Advisory**: Use the "Security" tab to create a private security advisory

### What to Include

Please include the following information in your report:
- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity and complexity

## Security Best Practices

### For Users

1. **API Keys**
   - Never commit API keys to version control
   - Use environment variables for sensitive data
   - Rotate API keys regularly

2. **Docker Security**
   - Keep Docker and Docker Compose updated
   - Use official base images
   - Regularly update dependencies

3. **Network Security**
   - Use HTTPS in production
   - Implement proper CORS policies
   - Restrict access to internal services

4. **Data Protection**
   - Implement user authentication in production
   - Encrypt sensitive data at rest
   - Use secure WebSocket connections (WSS)

### For Developers

1. **Dependencies**
   - Regularly update all dependencies
   - Use `npm audit` and `pip-audit` to check for vulnerabilities
   - Review security advisories

2. **Code Review**
   - Conduct security-focused code reviews
   - Use static analysis tools
   - Validate all user inputs

3. **Secrets Management**
   - Never hardcode secrets
   - Use `.env.example` files for documentation
   - Add `.env` to `.gitignore`

## Known Security Considerations

### Current Implementation

⚠️ **This is a development/prototype implementation. Before production deployment:**

1. **Authentication & Authorization**
   - Implement user authentication
   - Add role-based access control
   - Secure API endpoints

2. **CORS Configuration**
   - Currently allows all origins (`origin: "*"`)
   - Restrict to specific domains in production

3. **Input Validation**
   - Add comprehensive input validation
   - Implement rate limiting
   - Sanitize user inputs

4. **Database Security**
   - Use proper database encryption
   - Implement backup strategies
   - Use connection pooling safely

5. **API Key Handling**
   - Currently stored in browser localStorage
   - Consider server-side session management
   - Implement key rotation

## Security Updates

We will announce security updates through:
- GitHub Security Advisories
- Release notes
- README updates

## Compliance

This project follows:
- OWASP Top 10 security guidelines
- Docker security best practices
- Node.js security best practices
- Python security guidelines

## License

This security policy is part of the CORTEX Anomaly Detector project and is licensed under the MIT License.
