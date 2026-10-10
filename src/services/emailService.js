import { sendMail } from "./smtp.js";
import { env } from "../config/env.js";

function stripHtml(str) {
  return String(str || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();
}

/**
 * Foundational generic email sending service for Loan CRM.
 * Specific Loan CRM transactional email methods (approval, onboarding, OTP, etc.)
 * will be added here in subsequent phases as workflows are defined.
 */
export async function sendCustomEmail(payload) {
  const to = String(payload.to || payload.email || "")
    .trim()
    .toLowerCase();
  const subject = String(payload.subject || "").trim();
  const html = String(payload.html || "").trim();
  const text = String(payload.text || "").trim() || stripHtml(html);
  const senderName = String(payload.senderName || "").trim().slice(0, 100);

  if (!to) return { success: false, error: "Recipient email is required." };
  if (!subject) return { success: false, error: "Subject is required." };
  if (!html && !text) {
    return { success: false, error: "Email body is required." };
  }

  try {
    const result = await sendMail({
      to,
      subject,
      html: html || undefined,
      text,
      replyTo: payload.replyTo || env.EMAIL_REPLY_TO,
      senderName: senderName || undefined,
      attachments: Array.isArray(payload.attachments) ? payload.attachments : [],
    });

    console.log(`[Loan CRM Email Service] Sent email to ${to} | MessageID: ${result.messageId}`);
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send email";
    console.error(`[Loan CRM Email Service] Send failed to ${to}:`, message);
    return { success: false, error: message };
  }
}
