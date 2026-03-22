"use client";

import { useState, useEffect, useRef } from "react";
import { scoreColor } from "@/lib/audit-categories";
import OutOfCreditsModal from "./OutOfCreditsModal";

interface BulkResult {
  batchId: string;
  totalUrls: number;
  completed: number;
  failed: number;
  results: {
    auditId: string;
    url: string;
    status: "completed" | "failed";
    score: number | null;
    error?: string;
  }[];
}

export default function BulkAuditForm() {
  const [urlsText, setUrlsText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [result, setResult] = useState<BulkResult | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const urlCount = urlsText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0).length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);

    const urls = urlsText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (urls.length === 0) {
      setError("Please enter at least one URL");
      return;
    }

    if (urls.length > 10) {
      setError("Maximum 10 URLs per batch");
      return;
    }

    setLoading(true);

    // Dynamic progress steps based on URL count
    const steps = [
      { text: `Starting bulk audit of ${urls.length} URLs...`, delay: 0 },
    ];
    urls.forEach((url, i) => {
      const shortUrl = url.length > 40 ? url.slice(0, 40) + "..." : url;
      steps.push({
        text: `Processing ${i + 1}/${urls.length}: ${shortUrl}`,
        delay: 3000 + i * 12000,
      });
    });
    steps.push({
      text: "Finalizing all reports...",
      delay: 3000 + urls.length * 12000,
    });

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    steps.forEach(({ text, delay }) => {
      const timer = setTimeout(() => setStep(text), delay);
      timersRef.current.push(timer);
    });

    try {
      const response = await fetch("/api/audit/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });

      const data = await response.json();

      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];

      if (!response.ok) {
        if (response.status === 402) {
          setShowCreditsModal(true);
          setLoading(false);
          setStep("");
          return;
        }
        setError(data.error || "Something went wrong");
        setLoading(false);
        setStep("");
        return;
      }

      setStep("");
      setLoading(false);
      setResult(data);
    } catch {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      setError("Network error. Please try again.");
      setLoading(false);
      setStep("");
    }
  }

  if (result) {
    const completedResults = result.results.filter((r) => r.status === "completed");
    const avgScore =
      completedResults.length > 0
        ? Math.round(
            completedResults.reduce((sum, r) => sum + (r.score || 0), 0) /
              completedResults.length
          )
        : 0;

    return (
      <div className="space-y-6">
        {/* Summary */}
        <div className="rounded-2xl border border-border/50 bg-surface/30 p-6">
          <h2 className="text-lg font-semibold mb-4">Batch Summary</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-400">{result.completed}</p>
              <p className="text-xs text-muted">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">{result.failed}</p>
              <p className="text-xs text-muted">Failed</p>
            </div>
            <div>
              <p className={`text-2xl font-bold ${scoreColor(avgScore)}`}>{avgScore}</p>
              <p className="text-xs text-muted">Avg Score</p>
            </div>
          </div>
        </div>

        {/* Individual results */}
        <div className="space-y-2">
          {result.results.map((r) => (
            <div
              key={r.auditId}
              className="flex items-center gap-4 rounded-xl border border-border/50 bg-surface/30 p-4"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{r.url}</p>
                <p className="text-xs text-muted mt-0.5">
                  {r.status === "completed" ? (
                    <span className="text-green-400">Completed</span>
                  ) : (
                    <span className="text-red-400">Failed: {r.error}</span>
                  )}
                </p>
              </div>
              {r.score !== null && (
                <span className={`text-xl font-bold ${scoreColor(r.score)}`}>
                  {r.score}
                </span>
              )}
              {r.status === "completed" && (
                <a
                  href={`/audit/${r.auditId}`}
                  className="text-xs text-accent-bright hover:underline shrink-0"
                >
                  View &rarr;
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Run another batch */}
        <div className="text-center">
          <button
            onClick={() => {
              setResult(null);
              setUrlsText("");
            }}
            className="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white hover:bg-accent-bright transition-colors"
          >
            Run Another Batch
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="urls" className="block text-sm font-medium text-muted mb-1.5">
          URLs (one per line, max 10)
        </label>
        <textarea
          id="urls"
          required
          value={urlsText}
          onChange={(e) => setUrlsText(e.target.value)}
          placeholder={"https://client-site.com\nhttps://client-site.com/pricing\nhttps://client-site.com/features"}
          disabled={loading}
          rows={6}
          className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all disabled:opacity-50 font-mono text-sm resize-none"
        />
        <p className="text-xs text-muted mt-1">
          {urlCount} URL{urlCount !== 1 ? "s" : ""} entered
          {urlCount > 10 && <span className="text-red-400"> (max 10)</span>}
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || urlCount === 0 || urlCount > 10}
        className="w-full rounded-xl bg-gradient-to-r from-amber-600 to-accent px-6 py-4 text-base font-semibold text-white hover:opacity-90 transition-opacity mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {step}
          </span>
        ) : (
          `Run Bulk Audit (${urlCount} credit${urlCount !== 1 ? "s" : ""})`
        )}
      </button>

      <p className="text-center text-xs text-muted/60 mt-2">
        Each URL uses 1 credit. All audits run sequentially to ensure quality.
      </p>

      <OutOfCreditsModal
        open={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
      />
    </form>
  );
}
