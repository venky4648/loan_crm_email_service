import { Router } from "express";
import { serviceAuthMiddleware } from "../middleware/serviceAuth.js";
import { sendCustomEmail } from "../services/emailService.js";
import { verifySmtp } from "../services/smtp.js";

const router = Router();

/** Unauthenticated health check endpoint */
router.get("/health", async (_req, res) => {
  const smtpResult = await verifySmtp();
  if (smtpResult.success) {
    return res.json({ ok: true, status: "healthy", smtp: "connected" });
  } else {
    return res.status(503).json({
      ok: false,
      status: "degraded",
      smtp: "disconnected",
      error: smtpResult.error,
    });
  }
});

/** Enforce Service Auth for all transactional routes below */
router.use(serviceAuthMiddleware);

/** Generic / foundational email dispatch route */
router.post("/send", async (req, res) => {
  try {
    const { to, email, subject, html, text, attachments, replyTo, senderName } = req.body ?? {};

    const result = await sendCustomEmail({
      to: to || email,
      subject,
      html,
      text,
      attachments,
      replyTo,
      senderName,
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || "Failed to send email",
      });
    }

    return res.json({
      success: true,
      message: "Email sent successfully",
      messageId: result.messageId,
    });
  } catch (err) {
    console.error("[Loan CRM Email Service] Express handler error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal email service error",
    });
  }
});

export default router;
