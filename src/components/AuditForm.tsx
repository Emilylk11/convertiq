"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuditForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setStep("Submitting...");

    try {
      setStep("Scraping your page...");

      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        setStep("");
        return;
      }

      setStep("Redirecting to your report...");
      router.push(`/audit/${data.auditId}`);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
      setStep("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="website-url"
          className="block text-sm font-medium text-muted mb-1.5"
        >
          Website URL
        </label>
        <input
          id="website-url"
          name="url"
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://yoursite.com"
          disabled={loading}
          className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all disabled:opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-muted mb-1.5"
        >
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          disabled={loading}
          className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all disabled:opacity-50"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="pulse-glow w-full rounded-xl bg-gradient-to-r from-accent to-accent-dim px-6 py-4 text-base font-semibold text-white hover:opacity-90 transition-opacity mt-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:animate-none"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner />
            {step}
          </span>
        ) : (
          "Get Your Free Audit →"
        )}
      </button>

      <p className="text-center text-xs text-muted/60 mt-3">
        No spam. No credit card. Just actionable insights.
      </p>
    </form>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
