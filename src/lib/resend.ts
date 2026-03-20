import { Resend } from "resend";
import type { AuditResults } from "./types";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendAuditEmail({
  to,
  auditId,
  url,
  results,
}: {
  to: string;
  auditId: string;
  url: string;
  results: AuditResults;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const reportUrl = `${appUrl}/audit/${auditId}`;
  const topFindings = results.findings.slice(0, 3);

  const resend = getResend();

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "ConvertIQ <onboarding@resend.dev>",
    to,
    subject: `Your ConvertIQ Audit is Ready — Score: ${results.overallScore}/100`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#09090b;color:#fafafa;font-family:system-ui,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="margin-bottom:32px;">
      <span style="display:inline-flex;align-items:center;gap:8px;">
        <span style="display:inline-block;width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#a855f7,#7c3aed);text-align:center;line-height:32px;font-weight:bold;font-size:14px;color:white;">C</span>
        <span style="font-size:18px;font-weight:600;">Convert<span style="color:#c084fc;">IQ</span></span>
      </span>
    </div>

    <h1 style="font-size:28px;font-weight:700;margin:0 0 8px;">Your audit is ready</h1>
    <p style="color:#a1a1aa;font-size:16px;margin:0 0 24px;">
      We've analysed <strong style="color:#fafafa;">${url}</strong> and found actionable ways to improve your conversions.
    </p>

    <div style="background:#18181b;border-radius:16px;padding:24px;margin-bottom:24px;border:1px solid #3f3f46;">
      <div style="text-align:center;margin-bottom:16px;">
        <div style="font-size:48px;font-weight:800;color:#c084fc;">${results.overallScore}<span style="font-size:20px;color:#a1a1aa;">/100</span></div>
        <div style="color:#a1a1aa;font-size:14px;">Overall Conversion Score</div>
      </div>
      <p style="color:#a1a1aa;font-size:14px;line-height:1.6;margin:0;">${results.summary}</p>
    </div>

    <h2 style="font-size:18px;font-weight:600;margin:0 0 12px;">Top findings</h2>
    ${topFindings
      .map(
        (f) => `
    <div style="background:#18181b;border-radius:12px;padding:16px;margin-bottom:8px;border:1px solid #3f3f46;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
        <span style="display:inline-block;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:600;background:${f.severity === "critical" ? "#7f1d1d" : f.severity === "warning" ? "#78350f" : "#1e3a5f"};color:${f.severity === "critical" ? "#fca5a5" : f.severity === "warning" ? "#fde68a" : "#93c5fd"};">${f.severity}</span>
      </div>
      <div style="font-weight:600;font-size:15px;margin-bottom:4px;">${f.title}</div>
      <div style="color:#a1a1aa;font-size:13px;line-height:1.5;">${f.recommendation}</div>
    </div>`
      )
      .join("")}

    <div style="margin-top:24px;text-align:center;">
      <a href="${reportUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#a855f7,#7c3aed);color:white;text-decoration:none;border-radius:12px;font-weight:600;font-size:16px;">View Full Report</a>
    </div>

    <p style="margin-top:32px;color:#52525b;font-size:12px;text-align:center;">
      You received this because you requested a free audit on ConvertIQ.
    </p>
  </div>
</body>
</html>`,
  });
}
