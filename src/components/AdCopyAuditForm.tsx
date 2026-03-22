"use client";

import { useState } from "react";
import OutOfCreditsModal from "./OutOfCreditsModal";

export default function AdCopyAuditForm({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [adContent, setAdContent] = useState("");
  const [platform, setPlatform] = useState("");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adContent.trim() || adContent.trim().length < 10) {
      setError("Please paste at least 10 characters of ad copy.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/audit/ad-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adContent: adContent.trim(),
          context: showContext ? { platform, audience, goal } : undefined,
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
        <label htmlFor="ad-content" className="block text-sm font-medium mb-2">
          Ad Copy
        </label>
        <textarea
          id="ad-content"
          value={adContent}
          onChange={(e) => setAdContent(e.target.value)}
          placeholder={"Headline: Stop Wasting Money on Ads That Don't Convert\n\nPrimary Text: Most landing pages lose 95% of visitors. Our AI audit tells you exactly why — and gives you the fix.\n\n✅ Score your page in 60 seconds\n✅ Get specific copy rewrites\n✅ Free, no signup required\n\nCTA: Get Your Free Audit →\n\n[Paste your full ad copy here]"}
          rows={10}
          disabled={loading}
          className={`${inputClass} resize-y font-mono`}
        />
        <p className="text-xs text-muted mt-1">{adContent.length} characters</p>
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
            <label htmlFor="ad-platform" className="block text-xs text-muted mb-1">Platform</label>
            <select
              id="ad-platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              disabled={loading}
              className={inputClass}
            >
              <option value="">Select platform...</option>
              <option value="meta">Meta (Facebook/Instagram)</option>
              <option value="google">Google Ads</option>
              <option value="tiktok">TikTok</option>
              <option value="linkedin">LinkedIn</option>
              <option value="x">X (Twitter)</option>
              <option value="youtube">YouTube</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="ad-audience" className="block text-xs text-muted mb-1">Target Audience</label>
            <input
              id="ad-audience"
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g., CMOs at B2B SaaS companies, 35-55"
              disabled={loading}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="ad-goal" className="block text-xs text-muted mb-1">Campaign Goal</label>
            <input
              id="ad-goal"
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Drive free trial signups, Generate leads"
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
        disabled={loading || adContent.trim().length < 10}
        className="w-full rounded-xl bg-gradient-to-r from-accent to-accent-dim px-6 py-4 text-base font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            Analyzing ad copy...
          </span>
        ) : isLoggedIn ? (
          "Run Ad Audit (1 Credit) →"
        ) : (
          "Get Free Ad Audit →"
        )}
      </button>

      <OutOfCreditsModal
        open={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
      />
    </form>
  );
}
