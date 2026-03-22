"use client";

import { useState } from "react";

export default function CheckoutAuditForm({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [url, setUrl] = useState("");
  const [industry, setIndustry] = useState("");
  const [avgOrderValue, setAvgOrderValue] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`;
    if (!cleanUrl || cleanUrl.length < 10) {
      setError("Please enter a valid checkout URL.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/audit/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: cleanUrl,
          context: showContext ? { industry, avgOrderValue } : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Audit failed");
      window.location.href = `/audit/${data.auditId}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-2">Checkout Page URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://yourstore.com/checkout"
          className="w-full rounded-xl border border-border/50 bg-surface px-4 py-3.5 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50"
        />
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
            <label className="block text-xs text-muted mb-1">Industry</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm"
            >
              <option value="">Select industry...</option>
              <option value="ecommerce">E-commerce / DTC</option>
              <option value="saas">SaaS / Software</option>
              <option value="health">Health & Wellness</option>
              <option value="fashion">Fashion & Apparel</option>
              <option value="food">Food & Beverage</option>
              <option value="electronics">Electronics</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Average Order Value ($)</label>
            <input
              type="number"
              value={avgOrderValue}
              onChange={(e) => setAvgOrderValue(e.target.value)}
              placeholder="e.g., 75"
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
        disabled={loading || !url.trim()}
        className="w-full rounded-xl bg-gradient-to-r from-accent to-accent-dim px-6 py-4 text-base font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            Analyzing checkout flow...
          </span>
        ) : isLoggedIn ? (
          "Run Checkout Audit (1 Credit) →"
        ) : (
          "Get Free Checkout Audit →"
        )}
      </button>
    </form>
  );
}
