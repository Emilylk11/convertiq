"use client";

import { useState } from "react";
import OutOfCreditsModal from "./OutOfCreditsModal";

export default function CheckoutAuditForm({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [url, setUrl] = useState("");
  const [industry, setIndustry] = useState("");
  const [avgOrderValue, setAvgOrderValue] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCreditsModal, setShowCreditsModal] = useState(false);

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
    "w-full rounded-xl border border-border/50 bg-surface px-4 py-3.5 text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="checkout-url" className="block text-sm font-medium mb-2">
          Checkout Page URL
        </label>
        <input
          id="checkout-url"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://yourstore.com/checkout"
          disabled={loading}
          className={inputClass}
        />
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
            <label htmlFor="checkout-industry" className="block text-xs text-muted mb-1">Industry</label>
            <select
              id="checkout-industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              disabled={loading}
              className={inputClass}
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
            <label htmlFor="checkout-aov" className="block text-xs text-muted mb-1">Average Order Value ($)</label>
            <input
              id="checkout-aov"
              type="number"
              value={avgOrderValue}
              onChange={(e) => setAvgOrderValue(e.target.value)}
              placeholder="e.g., 75"
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
        disabled={loading || !url.trim()}
        className="w-full rounded-xl bg-gradient-to-r from-accent to-accent-dim px-6 py-4 text-base font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            Analyzing checkout flow...
          </span>
        ) : isLoggedIn ? (
          "Run Checkout Audit (1 Credit) →"
        ) : (
          "Get Free Checkout Audit →"
        )}
      </button>

      <OutOfCreditsModal
        open={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
      />
    </form>
  );
}
