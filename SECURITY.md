# Security Policy

## 🔒 Supported Versions

Commuto actively maintains the following components:

| Component | Version / Branch | Supported |
| :--- | :--- | :--- |
| Commuto Backend (Spring Boot 3.4) | Java 21 / `main` | :white_check_mark: |
| Commuto Frontend (Next.js 16) | React 19 / `main` | :white_check_mark: |

---

## 🛡️ Security Features in Commuto

- **Cryptographic Google OAuth Verification**: Server-side validation with Google Public Key Certificates (`GoogleIdTokenVerifier`).
- **Stateless JWT Authentication**: HMAC-SHA256 token verification with user privilege enforcement.
- **Strict Role-Based Access Control (RBAC)**: Enforced segregation between `PASSENGER`, `DRIVER`, and `ADMIN` roles.
- **SQL Injection Prevention**: Safe parameterization using Spring Data JPA & Hibernate ORM.
- **CORS Protection**: Restricted origins and headers configured in Spring Security.
- **Emergency SOS Dispatch**: Live broadcast coordinates to designated safety emergency contacts.

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability in Commuto:

1. **Do not create a public issue** on GitHub.
2. Send an email to the repository owner or submit a private security advisory via GitHub Security tab.
3. Include details of the vulnerability, steps to reproduce, and any proof-of-concept code.
4. We will acknowledge receipt within 48 hours and work on a prompt patch.
