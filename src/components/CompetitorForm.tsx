"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { scoreColor } from "@/lib/audit-categories";
import OutOfCreditsModal from "./OutOfCreditsModal";

const PROGRESS_STEPS = [
  { text: "Scraping both pages...", delay: 0 },
  { text: "Analyzing your page structure...", delay: 4000 },
  { text: "Analyzing competitor page...", delay: 8000 },
  { text: "Comparing CTAs & conversion signals...", delay: 14000 },
  { text: "Evaluating trust signals side by side...", delay: 20000 },
  { text: "Running AI analysis on both pages...", delay: 26000 },
  { text: "Building comparison report...", delay: 35000 },
  { text: "Almost there — finalizing results...", delay: 45000 },
];

interface ComparisonResult {
  yourAuditId: string;
  competitorAuditId: string;
  comparison: {
    yourUrl: string;
    competitorUrl: string;
    yourScore: number;
    competitorScore: number;
    yourCategories: Record<string, number>;
    competitorCategories: Record<string, number>;
    yourSummary: string;
    competitorSummary: string;
    yourFindingsCount: number;
    competitorFindingsCount: number;
  };
}

function ScoreRing({ score, label, size = 80 }: { score: number; label: string; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-border/30"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={scoreColor(score)}
        />
      </svg>
      <span className={`text-lg font-bold ${scoreColor(score)} -mt-[${size / 2 + 8}px] absolute`}>
        {score}
      </span>
      <span className="text-xs text-muted mt-1">{label}</span>
    </div>
  );
}

export default function CompetitorForm() {
  const router = useRouter();
  const [yourUrl, setYourUrl] = useState("");
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  function startProgressSteps() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    PROGRESS_STEPS.forEach(({ text, delay }) => {
      const timer = setTimeout(() => setStep(text), delay);
      timersRef.current.push(timer);
    });
  }

  function stopProgressSteps() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    startProgressSteps();

    try {
      const response = await fetch("/api/audit/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yourUrl, competitorUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        stopProgressSteps();
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

      stopProgressSteps();
      setStep("");
      setLoading(false);
      setResult(data);
    } catch {
      stopProgressSteps();
      setError("Network error. Please try again.");
      setLoading(false);
      setStep("");
    }
  }

  const categories = [
    { key: "cta", label: "CTAs" },
    { key: "copy", label: "Copy" },
    { key: "trust", label: "Trust" },
    { key: "ux", label: "UX" },
    { key: "speed", label: "Speed" },
    { key: "mobile", label: "Mobile" },
  ];

  if (result) {
    const { comparison } = result;
    const diff = comparison.yourScore - comparison.competitorScore;

    return (
      <div className="space-y-8">
        {/* Overall comparison */}
        <div className="rounded-2xl border border-border/50 bg-surface/30 p-6 sm:p-8">
          <h2 className="text-lg font-semibold mb-6 text-center">Overall Score Comparison</h2>
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="text-center">
              <p className="text-xs text-muted mb-2 truncate" title={comparison.yourUrl}>
                Your Page
              </p>
              <p className={`text-4xl font-bold ${scoreColor(comparison.yourScore)}`}>
                {comparison.yourScore}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted mb-2">Difference</p>
              <p
                className={`text-2xl font-bold ${
                  diff > 0 ? "text-green-400" : diff < 0 ? "text-red-400" : "text-muted"
                }`}
              >
                {diff > 0 ? "+" : ""}
                {diff}
              </p>
              <p className="text-xs text-muted mt-1">
                {diff > 0 ? "You're ahead!" : diff < 0 ? "Room to improve" : "Tied"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted mb-2 truncate" title={comparison.competitorUrl}>
                Competitor
              </p>
              <p className={`text-4xl font-bold ${scoreColor(comparison.competitorScore)}`}>
                {comparison.competitorScore}
              </p>
            </div>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="rounded-2xl border border-border/50 bg-surface/30 p-6 sm:p-8">
          <h2 className="text-lg font-semibold mb-6">Category Breakdown</h2>
          <div className="space-y-4">
            {categories.map(({ key, label }) => {
              const yourScore = comparison.yourCategories[key] || 0;
              const compScore = comparison.competitorCategories[key] || 0;
              const catDiff = yourScore - compScore;

              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium w-16">{label}</span>
                    <div className="flex-1 mx-4 flex items-center gap-2">
                      <span className={`text-xs font-mono w-8 text-right ${scoreColor(yourScore)}`}>
                        {yourScore}
                      </span>
                      <div className="flex-1 flex h-2 rounded-full overflow-hidden bg-border/20">
                        <div
                          className={`h-full transition-all ${
                            yourScore >= 70
                              ? "bg-green-400/60"
                              : yourScore >= 40
                                ? "bg-yellow-400/60"
                                : "bg-red-400/60"
                          }`}
                          style={{ width: `${yourScore}%` }}
                        />
                      </div>
                      <div className="flex-1 flex h-2 rounded-full overflow-hidden bg-border/20">
                        <div
                          className={`h-full transition-all ${
                            compScore >= 70
                              ? "bg-green-400/60"
                              : compScore >= 40
                                ? "bg-yellow-400/60"
                                : "bg-red-400/60"
                          }`}
                          style={{ width: `${compScore}%` }}
                        />
                      </div>
                      <span className={`text-xs font-mono w-8 ${scoreColor(compScore)}`}>
                        {compScore}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-mono w-10 text-right ${
                        catDiff > 0 ? "text-green-400" : catDiff < 0 ? "text-red-400" : "text-muted"
                      }`}
                    >
                      {catDiff > 0 ? "+" : ""}
                      {catDiff}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30 text-xs text-muted">
            <span>Your page</span>
            <span>Competitor</span>
          </div>
        </div>

        {/* Summaries */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border/50 bg-surface/30 p-6">
            <h3 className="text-sm font-semibold mb-3">Your Page Summary</h3>
            <p className="text-xs text-muted leading-relaxed">{comparison.yourSummary}</p>
            <a
              href={`/audit/${result.yourAuditId}`}
              className="inline-block mt-4 text-xs text-accent-bright hover:underline"
            >
              View full report &rarr;
            </a>
          </div>
          <div className="rounded-2xl border border-border/50 bg-surface/30 p-6">
            <h3 className="text-sm font-semibold mb-3">Competitor Summary</h3>
            <p className="text-xs text-muted leading-relaxed">{comparison.competitorSummary}</p>
            <a
              href={`/audit/${result.competitorAuditId}`}
              className="inline-block mt-4 text-xs text-accent-bright hover:underline"
            >
              View full report &rarr;
            </a>
          </div>
        </div>

        {/* Run another comparison */}
        <div className="text-center">
          <button
            onClick={() => {
              setResult(null);
              setYourUrl("");
              setCompetitorUrl("");
            }}
            className="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white hover:bg-accent-bright transition-colors"
          >
            Run Another Comparison
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="your-url" className="block text-sm font-medium text-muted mb-1.5">
          Your URL
        </label>
        <input
          id="your-url"
          type="url"
          required
          value={yourUrl}
          onChange={(e) => setYourUrl(e.target.value)}
          placeholder="https://yoursite.com"
          disabled={loading}
          className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all disabled:opacity-50"
        />
      </div>

      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted">
          <div className="h-px w-8 bg-border/50" />
          <span className="text-xs font-medium">VS</span>
          <div className="h-px w-8 bg-border/50" />
        </div>
      </div>

      <div>
        <label htmlFor="competitor-url" className="block text-sm font-medium text-muted mb-1.5">
          Competitor URL
        </label>
        <input
          id="competitor-url"
          type="url"
          required
          value={competitorUrl}
          onChange={(e) => setCompetitorUrl(e.target.value)}
          placeholder="https://competitor.com"
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
        className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-accent px-6 py-4 text-base font-semibold text-white hover:opacity-90 transition-opacity mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
          "Compare Pages (2 credits)"
        )}
      </button>

      <p className="text-center text-xs text-muted/60 mt-2">
        Each comparison uses 2 credits — one per URL analyzed.
      </p>

      <OutOfCreditsModal
        open={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
      />
    </form>
  );
}
