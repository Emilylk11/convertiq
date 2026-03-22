"use client";

import { useState } from "react";
import OutOfCreditsModal from "./OutOfCreditsModal";

export default function EmailAuditForm({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [emailContent, setEmailContent] = useState("");
  const [emailType, setEmailType] = useState("");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailContent.trim() || emailContent.trim().length < 20) {
      setError("Please paste at least 20 characters of email content.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/audit/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailContent: emailContent.trim(),
          context: showContext ? { emailType, audience, goal } : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          setShowCreditsModal(true);
          setLoading(false);
          return;
        }
        throw new Error(data.error || "Audit failed");
      }

      window.location.href = `/audit/${data.auditId}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border/50 bg-surface px-4 py-3 text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email-content" className="block text-sm font-medium mb-2">
          Email Content
        </label>
        <textarea
          id="email-content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          placeholder={"Subject: Your weekly growth report is ready\n\nHi {{first_name}},\n\nYour landing page scored 47/100 this week...\n\n[Paste your full email here — subject line, body, CTA, everything]"}
          rows={12}
          disabled={loading}
          className={`${inputClass} resize-y font-mono`}
        />
        <p className="text-xs text-muted mt-1">{emailContent.length} characters</p>
      </div>

      <button
        type="button"
        onClick={() => setShowContext(!showContext)}
        disabled={loading}
        className="flex items-center gap-1.5 text-xs text-accent-bright hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          className={`transition-transform ${showContext ? "rotate-45" : ""}`}
        >
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {showContext ? "Hide context" : "Add context for a smarter audit"}
      </button>

      {showContext && (
        <div className="space-y-3 rounded-xl border border-border/30 bg-surface/50 p-4">
          <div>
            <label htmlFor="email-type" className="block text-xs text-muted mb-1">Email Type</label>
            <select
              id="email-type"
              value={emailType}
              onChange={(e) => setEmailType(e.target.value)}
              disabled={loading}
              className={inputClass}
            >
              <option value="">Select type...</option>
              <option value="welcome">Welcome / Onboarding</option>
              <option value="nurture">Nurture Sequence</option>
              <option value="sales">Sales / Promotional</option>
              <option value="abandoned-cart">Abandoned Cart</option>
              <option value="re-engagement">Re-engagement</option>
              <option value="newsletter">Newsletter</option>
              <option value="transactional">Transactional</option>
              <option value="cold-outreach">Cold Outreach</option>
            </select>
          </div>
          <div>
            <label htmlFor="email-audience" className="block text-xs text-muted mb-1">Target Audience</label>
            <input
              id="email-audience"
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g., SaaS founders, e-commerce store owners"
              disabled={loading}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="email-goal" className="block text-xs text-muted mb-1">Primary Goal</label>
            <input
              id="email-goal"
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Book a demo, Purchase product, Read blog post"
              disabled={loading}
              className={inputClass}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || emailContent.trim().length < 20}
        className="w-full rounded-xl bg-gradient-to-r from-accent to-accent-dim px-6 py-4 text-base font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            Analyzing email...
          </span>
        ) : isLoggedIn ? (
          "Run Email Audit (1 Credit) →"
        ) : (
          "Get Free Email Audit →"
        )}
      </button>

      <OutOfCreditsModal
        open={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
      />
    </form>
  );
}
