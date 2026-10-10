import "dotenv/config";

function required(name) {
  const value = process.env[name];
  if (!value || !String(value).trim()) {
    throw new Error(`[Loan CRM Email Service] Missing required environment variable: ${name}`);
  }
  return String(value).trim();
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 4008,
  SERVICE_AUTH_TOKEN: required("SERVICE_AUTH_TOKEN"),
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER || "smtp",
  SMTP_HOST: process.env.SMTP_HOST || "smtp.example.com",
  SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
  SMTP_SECURE: String(process.env.SMTP_SECURE || "false") === "true",
  SMTP_USER: required("SMTP_USER"),
  SMTP_PASS: required("SMTP_PASS"),
  EMAIL_FROM_ADDRESS: required("EMAIL_FROM_ADDRESS"),
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || "Loan CRM Workspace",
  EMAIL_REPLY_TO: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM_ADDRESS,
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
};
