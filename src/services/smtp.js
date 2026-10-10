import nodemailer from "nodemailer";
import { env } from "../config/env.js";

function createTransporter() {
  const config = {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 1000,
    rateLimit: 15,
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 15000,
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === "production",
    },
  };

  return nodemailer.createTransport(config);
}

const transporter = createTransporter();

/**
 * Verify connection to the configured SMTP server.
 */
export async function verifySmtp() {
  try {
    await transporter.verify();
    return { success: true, message: "SMTP connection verified successfully" };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, error: errorMsg };
  }
}

/**
 * Low-level SMTP mail dispatch helper.
 */
export async function sendMail({
  to,
  subject,
  html,
  text,
  replyTo,
  senderName,
  attachments,
}) {
  const info = await transporter.sendMail({
    from: {
      name: String(senderName || "").trim() || env.EMAIL_FROM_NAME,
      address: env.EMAIL_FROM_ADDRESS,
    },
    to,
    replyTo: replyTo || env.EMAIL_REPLY_TO,
    subject,
    html,
    text,
    attachments: Array.isArray(attachments)
      ? attachments
          .filter((a) => a && (a.content || a.path))
          .map((a) => ({
            filename: a.filename || "attachment",
            contentType: a.contentType || "application/octet-stream",
            content: a.content
              ? Buffer.from(String(a.content), "base64")
              : undefined,
            path: a.path,
          }))
      : undefined,
    headers: {
      "X-Mailer": "Loan CRM Email Service",
    },
  });

  return {
    success: true,
    messageId: info.messageId || "",
  };
}
