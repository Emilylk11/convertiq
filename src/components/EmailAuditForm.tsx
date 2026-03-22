"use client";

import { useState } from "react";

export default function EmailAuditForm({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [emailContent, setEmailContent] = useState("");
  const [emailType, setEmailType] = useState("");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<Record<string, unknown> | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailContent.trim() || emailContent.trim().length < 20) {
      setError("Please paste at least 20 characters of email content.");
      return;
    }

    setLoading(true);
    setError("");
    setResults(null);

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
      if (!res.ok) throw new Error(data.error || "Audit failed");

      // Redirect to audit report
      window.location.href = `/audit/${data.auditId}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-2">Email Content</label>
        <textarea
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          placeholder={"Subject: Your weekly growth report is ready\n\nHi {{first_name}},\n\nYour landing page scored 47/100 this week...\n\n[Paste your full email here — subject line, body, CTA, everything]"}
          rows={12}
          className="w-full rounded-xl border border-border/50 bg-surface px-4 py-3 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 resize-y font-mono"
        />
        <p className="text-xs text-muted mt-1">{emailContent.length} characters</p>
      </div>

      <button
        type="button"
        onClick={() => setShowContext(!showContext)}
        className="text-sm text-accent-bright hover:underline"
      >
        {showContext ? "− Hide context" : "+ Add context for a smarter audit"}
      </button>

      {showContext && (
        <div className="space-y-3 rounded-xl border border-border/30 bg-surface/50 p-4">
          <div>
            <label className="block text-xs text-muted mb-1">Email Type</label>
            <select
              value={emailType}
              onChange={(e) => setEmailType(e.target.value)}
              className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm"
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
            <label className="block text-xs text-muted mb-1">Target Audience</label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g., SaaS founders, e-commerce store owners"
              className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Primary Goal</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Book a demo, Purchase product, Read blog post"
              className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || emailContent.trim().length < 20}
        className="w-full rounded-xl bg-gradient-to-r from-accent to-accent-dim px-6 py-4 text-base font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            Analyzing email...
          </span>
        ) : isLoggedIn ? (
          "Run Email Audit (1 Credit) →"
        ) : (
          "Get Free Email Audit →"
        )}
      </button>
    </form>
  );
}
