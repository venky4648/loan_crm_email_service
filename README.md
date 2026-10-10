# Loan CRM Email Service

Standalone microservice for delivering emails (SMTP/API) for the **Loan CRM** project.

## Features
- Independent, isolated microservice for Loan CRM email workflows.
- Environment-driven configuration (strict validation via `.env`).
- Nodemailer pool with TLS 1.2/1.3 security and customizable sender names.
- Express API with header authentication (`X-Service-Auth`).
- Built-in SMTP connection testing script (`npm run test:connection`).
- Docker container ready (`Dockerfile` included).

## Directory Structure
```
loan_crm_email_service/
├── .env                  # Environment configuration (gitignored)
├── .env.example          # Environment variable template with placeholders
├── .gitignore            # Git ignore configuration
├── Dockerfile            # Container build configuration
├── package.json          # Node.js dependencies and run scripts
├── README.md             # Project documentation
└── src/
    ├── index.js          # Main Express server entry point
    ├── config/
    │   └── env.js        # Strict environment validation logic
    ├── middleware/
    │   └── serviceAuth.js# Service authentication middleware
    ├── routes/
    │   └── email.js      # API routes (/health, /send)
    └── services/
        ├── emailService.js # Foundational generic dispatch logic
        └── smtp.js       # Nodemailer transporter & SMTP connection verifier
```

## Quick Start (Local Setup)

1. Navigate to directory:
   ```bash
   cd loan_crm_email_service
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update `.env` with actual Loan CRM client credentials when available:
   ```env
   SERVICE_AUTH_TOKEN=your_loan_crm_service_auth_token
   SMTP_HOST=smtp.yourclientprovider.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your_client_email@loancrm.com
   SMTP_PASS=your_client_app_password
   EMAIL_FROM_ADDRESS=noreply@loancrm.com
   EMAIL_FROM_NAME=Loan CRM Workspace
   ```

4. Test SMTP Connection:
   ```bash
   npm run test:connection
   ```

5. Run in development mode:
   ```bash
   npm run dev
   ```

## Endpoints

- `GET /` - Root status output.
- `GET /api/v1/health` - Health check & dynamic SMTP connection status.
- `POST /api/v1/email/send` - Send transactional email (requires `X-Service-Auth` header).

### Sample Request (`POST /api/v1/email/send`)
**Header**: `X-Service-Auth: <SERVICE_AUTH_TOKEN>`  
**Body**:
```json
{
  "to": "customer@example.com",
  "subject": "Loan Application Update",
  "html": "<p>Dear Customer, your application status has been updated.</p>",
  "text": "Dear Customer, your application status has been updated."
}
```
