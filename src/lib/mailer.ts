import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

// Outgoing email. SMTP through nodemailer is the primary route (for Gmail use smtp.gmail.com, port 465 and an
// App Password). If SMTP is not configured, Resend is used when its keys are set. Failures never throw to callers.

export type Mail = { to: string | string[]; subject: string; html: string; replyTo?: string };

/** Where new leads, bookings and orders are sent. */
export const notifyAddress = () => process.env.LEAD_NOTIFY_EMAIL || "bgeetechai@gmail.com";

let cached: { key: string; t: Transporter } | null = null;

function smtp(): { t: Transporter; from: string } | null {
  const { SMTP_HOST: host, SMTP_USER: user, SMTP_PASS: pass } = process.env;
  if (!host || !user || !pass) return null;
  const port = Number(process.env.SMTP_PORT || 465);
  const key = `${host}:${port}:${user}`;
  if (!cached || cached.key !== key) {
    cached = {
      key,
      t: nodemailer.createTransport({
        host,
        port,
        secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
        auth: { user, pass },
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 15_000,
      }),
    };
  }
  const name = process.env.SMTP_FROM_NAME || "BGeetech";
  return { t: cached.t, from: process.env.SMTP_FROM || `"${name}" <${user}>` };
}

export const mailConfigured = () => Boolean(smtp() || (process.env.RESEND_API_KEY && process.env.LEAD_FROM_EMAIL));

export async function deliver(mail: Mail): Promise<boolean> {
  try {
    const s = smtp();
    if (s) {
      await s.t.sendMail({ from: s.from, to: mail.to, subject: mail.subject, html: mail.html, ...(mail.replyTo ? { replyTo: mail.replyTo } : {}) });
      return true;
    }
    const { RESEND_API_KEY: key, LEAD_FROM_EMAIL: from } = process.env;
    if (!key || !from) return false;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: Array.isArray(mail.to) ? mail.to : [mail.to], ...(mail.replyTo ? { reply_to: mail.replyTo } : {}), subject: mail.subject, html: mail.html }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false; // never log the message: it contains personal data
  }
}
