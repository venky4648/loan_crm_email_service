import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import emailRouter from "./routes/email.js";
import { verifySmtp } from "./services/smtp.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/", (_req, res) => {
  res.json({
    service: "loan-crm-email-service",
    status: "ok",
    from: env.EMAIL_FROM_ADDRESS,
  });
});

app.get("/api/v1/health", (_req, res) => {
  res.json({ ok: true, service: "loan-crm-email-service" });
});

app.use("/api/v1/email", emailRouter);

async function start() {
  console.log(`[Loan CRM Email Service] Initializing on port ${env.PORT}...`);
  
  if (env.EMAIL_PROVIDER === "smtp") {
    const smtpCheck = await verifySmtp();
    if (smtpCheck.success) {
      console.log(`[Loan CRM Email Service] SMTP connection verified for ${env.SMTP_USER}`);
    } else {
      console.warn(`[Loan CRM Email Service] Note: SMTP verification check returned: ${smtpCheck.error}`);
    }
  }

  app.listen(env.PORT, "0.0.0.0", () => {
    console.log(`[Loan CRM Email Service] Service running at http://0.0.0.0:${env.PORT}`);
  });
}

start().catch((err) => {
  console.error("[Loan CRM Email Service] Failed to start:", err);
  process.exit(1);
});
