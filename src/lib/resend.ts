import { Resend } from "resend";
import type { AuditResults } from "./types";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = () => process.env.RESEND_FROM_EMAIL || "ConvertIQ <onboarding@resend.dev>";
const APP_URL = () => process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ─── Shared email wrapper ────────────────────────────
function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#09090b;color:#fafafa;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="margin-bottom:32px;">
      <span style="display:inline-flex;align-items:center;gap:8px;">
        <span style="display:inline-block;width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#a855f7,#7c3aed);text-align:center;line-height:32px;font-weight:bold;font-size:14px;color:white;">C</span>
        <span style="font-size:18px;font-weight:600;">Convert<span style="color:#c084fc;">IQ</span></span>
      </span>
    </div>
    ${content}
    <p style="margin-top:40px;color:#52525b;font-size:11px;text-align:center;">
      ConvertIQ &middot; AI-Powered Conversion Audits<br>
      <a href="${APP_URL()}/dashboard" style="color:#71717a;text-decoration:underline;">Dashboard</a> &middot;
      <a href="mailto:support@convertiq.io" style="color:#71717a;text-decoration:underline;">Support</a>
    </p>
  </div>
</body>
</html>`;
}

function ctaButton(text: string, href: string): string {
  return `<div style="margin-top:24px;text-align:center;">
    <a href="${href}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#a855f7,#7c3aed);color:white;text-decoration:none;border-radius:12px;font-weight:600;font-size:16px;">${text}</a>
  </div>`;
}

function card(content: string): string {
  return `<div style="background:#18181b;border-radius:16px;padding:24px;margin-bottom:16px;border:1px solid #3f3f46;">${content}</div>`;
}

// ─── 1. Audit Complete Email ─────────────────────────
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
  const reportUrl = `${APP_URL()}/audit/${auditId}`;
  const topFindings = results.findings.slice(0, 3);

  const resend = getResend();

  await resend.emails.send({
    from: FROM(),
    to,
    subject: `Your ConvertIQ Audit is Ready — Score: ${results.overallScore}/100`,
    html: emailWrapper(`
    <h1 style="font-size:28px;font-weight:700;margin:0 0 8px;">Your audit is ready</h1>
    <p style="color:#a1a1aa;font-size:16px;margin:0 0 24px;">
      We've analysed <strong style="color:#fafafa;">${url}</strong> and found actionable ways to improve your conversions.
    </p>

    ${card(`
      <div style="text-align:center;margin-bottom:16px;">
        <div style="font-size:48px;font-weight:800;color:#c084fc;">${results.overallScore}<span style="font-size:20px;color:#a1a1aa;">/100</span></div>
        <div style="color:#a1a1aa;font-size:14px;">Overall Conversion Score</div>
      </div>
      <p style="color:#a1a1aa;font-size:14px;line-height:1.6;margin:0;">${results.summary}</p>
    `)}

    <h2 style="font-size:18px;font-weight:600;margin:0 0 12px;">Top findings</h2>
    ${topFindings
      .map(
        (f) => card(`
      <div style="margin-bottom:4px;">
        <span style="display:inline-block;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:600;background:${f.severity === "critical" ? "#7f1d1d" : f.severity === "warning" ? "#78350f" : "#1e3a5f"};color:${f.severity === "critical" ? "#fca5a5" : f.severity === "warning" ? "#fde68a" : "#93c5fd"};">${f.severity}</span>
      </div>
      <div style="font-weight:600;font-size:15px;margin-bottom:4px;">${f.title}</div>
      <div style="color:#a1a1aa;font-size:13px;line-height:1.5;">${f.recommendation}</div>
    `)
      )
      .join("")}

    ${ctaButton("View Full Report →", reportUrl)}
    `),
  });
}

// ─── 2. Low Credit Warning Email ─────────────────────
export async function sendLowCreditEmail({
  to,
  balance,
}: {
  to: string;
  balance: number;
}) {
  const resend = getResend();

  await resend.emails.send({
    from: FROM(),
    to,
    subject: `⚠️ Low credits — ${balance} remaining on ConvertIQ`,
    html: emailWrapper(`
    <h1 style="font-size:28px;font-weight:700;margin:0 0 8px;">You're running low on credits</h1>
    <p style="color:#a1a1aa;font-size:16px;margin:0 0 24px;">
      You have <strong style="color:#fde68a;">${balance} credit${balance !== 1 ? "s" : ""}</strong> remaining.
      Top up now so you don't lose momentum on your optimization work.
    </p>

    ${card(`
      <div style="text-align:center;">
        <div style="font-size:48px;font-weight:800;color:#fde68a;">${balance}</div>
        <div style="color:#a1a1aa;font-size:14px;">credits remaining</div>
      </div>
    `)}

    ${card(`
      <p style="font-size:13px;font-weight:600;color:#4ade80;margin:0 0 8px;">💡 Remember: one audit pays for itself</p>
      <p style="color:#a1a1aa;font-size:13px;line-height:1.6;margin:0;">
        A single CRO fix typically lifts conversions 0.5–2%. On a page with 10K monthly visitors
        and $50 avg. order value, that's <strong style="color:#4ade80;">$2,500–$10,000/mo</strong> in new revenue
        — from an audit that costs less than a coffee.
      </p>
    `)}

    <div style="margin-top:16px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr>
          <td style="padding:8px;text-align:center;">
            <div style="background:#18181b;border-radius:12px;padding:16px;border:1px solid #3f3f46;">
              <div style="font-size:18px;font-weight:700;">5 Credits</div>
              <div style="font-size:24px;font-weight:800;color:#c084fc;">$19</div>
              <div style="color:#71717a;font-size:11px;">$3.80/audit</div>
            </div>
          </td>
          <td style="padding:8px;text-align:center;">
            <div style="background:#18181b;border-radius:12px;padding:16px;border:2px solid #a855f7;">
              <div style="font-size:11px;font-weight:700;color:#a855f7;margin-bottom:4px;">POPULAR</div>
              <div style="font-size:18px;font-weight:700;">15 Credits</div>
              <div style="font-size:24px;font-weight:800;color:#c084fc;">$49</div>
              <div style="color:#4ade80;font-size:11px;">Save 14%</div>
            </div>
          </td>
          <td style="padding:8px;text-align:center;">
            <div style="background:#18181b;border-radius:12px;padding:16px;border:1px solid #3f3f46;">
              <div style="font-size:18px;font-weight:700;">50 Credits</div>
              <div style="font-size:24px;font-weight:800;color:#c084fc;">$129</div>
              <div style="color:#4ade80;font-size:11px;">Save 32%</div>
            </div>
          </td>
        </tr>
      </table>
    </div>

    ${ctaButton("Buy More Credits →", `${APP_URL()}/pricing`)}
    `),
  });
}

// ─── 3. Welcome / Purchase Confirmation Email ────────
export async function sendWelcomePurchaseEmail({
  to,
  creditsAdded,
  newBalance,
}: {
  to: string;
  creditsAdded: number;
  newBalance: number;
}) {
  const resend = getResend();

  await resend.emails.send({
    from: FROM(),
    to,
    subject: `🎉 ${creditsAdded} credits added to your ConvertIQ account`,
    html: emailWrapper(`
    <h1 style="font-size:28px;font-weight:700;margin:0 0 8px;">Payment confirmed!</h1>
    <p style="color:#a1a1aa;font-size:16px;margin:0 0 24px;">
      Your credits have been added to your account and are ready to use.
    </p>

    ${card(`
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="text-align:center;padding:8px;">
            <div style="font-size:36px;font-weight:800;color:#4ade80;">+${creditsAdded}</div>
            <div style="color:#a1a1aa;font-size:13px;">credits added</div>
          </td>
          <td style="text-align:center;padding:8px;">
            <div style="font-size:36px;font-weight:800;color:#c084fc;">${newBalance}</div>
            <div style="color:#a1a1aa;font-size:13px;">total balance</div>
          </td>
        </tr>
      </table>
    `)}

    ${card(`
      <p style="font-size:14px;font-weight:600;margin:0 0 8px;">What to do next:</p>
      <div style="color:#a1a1aa;font-size:13px;line-height:1.8;">
        <div>✅ Run an audit on your highest-traffic page first</div>
        <div>✅ Implement the top 2-3 findings (start with "critical")</div>
        <div>✅ Re-audit after changes to track your score improvement</div>
        <div>✅ Share your referral link to earn free credits</div>
      </div>
    `)}

    ${ctaButton("Run an Audit Now →", `${APP_URL()}/dashboard/new-audit`)}
    `),
  });
}

// ─── 4. Referral Reward Email ────────────────────────
export async function sendReferralRewardEmail({
  to,
  creditsEarned,
  referredEmail,
}: {
  to: string;
  creditsEarned: number;
  referredEmail: string;
}) {
  const resend = getResend();

  // Mask email for privacy
  const maskedEmail = referredEmail.replace(
    /^(.{2})(.*)(@.*)$/,
    (_, start, middle, domain) => start + "*".repeat(Math.min(middle.length, 5)) + domain
  );

  await resend.emails.send({
    from: FROM(),
    to,
    subject: `🎁 You earned ${creditsEarned} free credits from a referral!`,
    html: emailWrapper(`
    <h1 style="font-size:28px;font-weight:700;margin:0 0 8px;">You earned free credits! 🎉</h1>
    <p style="color:#a1a1aa;font-size:16px;margin:0 0 24px;">
      Someone you referred (<strong style="color:#fafafa;">${maskedEmail}</strong>) just made their first purchase.
    </p>

    ${card(`
      <div style="text-align:center;">
        <div style="font-size:48px;font-weight:800;color:#4ade80;">+${creditsEarned}</div>
        <div style="color:#a1a1aa;font-size:14px;">free credits added to your account</div>
      </div>
    `)}

    ${card(`
      <p style="font-size:14px;font-weight:600;margin:0 0 4px;">Keep sharing, keep earning</p>
      <p style="color:#a1a1aa;font-size:13px;line-height:1.5;margin:0;">
        Every friend who signs up and purchases earns you <strong style="color:#c084fc;">2 more free credits</strong>.
        There's no limit — share your link as much as you want.
      </p>
    `)}

    ${ctaButton("View Your Referrals →", `${APP_URL()}/dashboard`)}
    `),
  });
}

// ─── 5. Welcome Email (new signup) ───────────────────
export async function sendWelcomeEmail({
  to,
  referralCredit,
}: {
  to: string;
  referralCredit?: boolean;
}) {
  const resend = getResend();

  await resend.emails.send({
    from: FROM(),
    to,
    subject: referralCredit
      ? "Welcome to ConvertIQ — you've got 1 free credit! 🎁"
      : "Welcome to ConvertIQ — your conversion optimization co-pilot",
    html: emailWrapper(`
    <h1 style="font-size:28px;font-weight:700;margin:0 0 8px;">Welcome to ConvertIQ!</h1>
    <p style="color:#a1a1aa;font-size:16px;margin:0 0 24px;">
      ${referralCredit
        ? "You were referred by a friend and received <strong style='color:#4ade80;'>1 free credit</strong> to try a full audit."
        : "You're all set to start optimizing your landing pages for better conversions."
      }
    </p>

    ${card(`
      <p style="font-size:14px;font-weight:600;margin:0 0 12px;">How ConvertIQ works:</p>
      <div style="color:#a1a1aa;font-size:13px;line-height:2;">
        <div><strong style="color:#fafafa;">1.</strong> Paste any landing page URL</div>
        <div><strong style="color:#fafafa;">2.</strong> Our AI analyzes 6 conversion factors in 60 seconds</div>
        <div><strong style="color:#fafafa;">3.</strong> Get your score, specific findings, and ready-to-use copy rewrites</div>
        <div><strong style="color:#fafafa;">4.</strong> Implement the fixes and re-audit to track improvement</div>
      </div>
    `)}

    ${card(`
      <p style="font-size:13px;font-weight:600;color:#4ade80;margin:0 0 4px;">💰 The ROI math</p>
      <p style="color:#a1a1aa;font-size:13px;line-height:1.5;margin:0;">
        A single CRO fix on a page with 10K visitors can add
        <strong style="color:#4ade80;">$5,000+/month</strong> in revenue.
        A CRO agency charges $5,000/mo for the same insights.
        ConvertIQ does it for <strong style="color:#c084fc;">$2.58/audit</strong>.
      </p>
    `)}

    ${referralCredit
      ? ctaButton("Use Your Free Credit →", `${APP_URL()}/dashboard/new-audit`)
      : ctaButton("Try a Free Audit →", `${APP_URL()}/#free-audit`)
    }
    `),
  });
}
