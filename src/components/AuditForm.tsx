"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import OutOfCreditsModal from "./OutOfCreditsModal";

const PROGRESS_STEPS = [
  { text: "Scraping your page...", delay: 0 },
  { text: "Analyzing page structure & headings...", delay: 3000 },
  { text: "Grabbing all links & navigation...", delay: 6000 },
  { text: "Evaluating CTAs & conversion signals...", delay: 10000 },
  { text: "Checking trust signals & social proof...", delay: 14000 },
  { text: "Running AI analysis on everything...", delay: 18000 },
  { text: "Building your report...", delay: 25000 },
  { text: "Almost there — finalizing results...", delay: 35000 },
];

const TRAFFIC_TYPES = [
  { value: "", label: "Select traffic type" },
  { value: "cold", label: "Cold traffic — first-time visitors who don't know the brand" },
  { value: "warm", label: "Warm traffic — visitors who've seen ads or content before" },
  { value: "hot", label: "Hot traffic — existing leads, email list, or retargeting" },
  { value: "existing", label: "Existing customers — upsell, renewal, or loyalty" },
  { value: "mixed", label: "Mixed — combination of traffic types" },
];

const INDUSTRIES = [
  { value: "", label: "Select industry (optional)" },
  { value: "ecommerce", label: "E-commerce / DTC" },
  { value: "saas", label: "SaaS / Software" },
  { value: "agency", label: "Agency / Consulting" },
  { value: "health", label: "Health & Wellness" },
  { value: "finance", label: "Finance / Fintech" },
  { value: "education", label: "Education / Courses" },
  { value: "realestate", label: "Real Estate" },
  { value: "b2b", label: "B2B / Enterprise" },
  { value: "nonprofit", label: "Non-profit" },
  { value: "portfolio", label: "Portfolio / Personal Brand" },
  { value: "other", label: "Other" },
];

export default function AuditForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [trafficType, setTrafficType] = useState("");
  const [industry, setIndustry] = useState("");
  const [audience, setAudience] = useState("");
  const [monthlyTraffic, setMonthlyTraffic] = useState("");
  const [avgOrderValue, setAvgOrderValue] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [showCreditsModal, setShowCreditsModal] = useState(false);
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
    setLoading(true);
    startProgressSteps();

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          email,
          context: {
            trafficType: trafficType || undefined,
            industry: industry || undefined,
            audience: audience || undefined,
            monthlyTraffic: monthlyTraffic ? parseInt(monthlyTraffic, 10) : undefined,
            avgOrderValue: avgOrderValue ? parseFloat(avgOrderValue) : undefined,
          },
        }),
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
      setStep("Redirecting to your report...");
      router.push(`/audit/${data.auditId}`);
    } catch {
      stopProgressSteps();
      setError("Network error. Please try again.");
      setLoading(false);
      setStep("");
    }
  }

  const selectClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all disabled:opacity-50 appearance-none";

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

      {/* Context toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowContext((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-accent-bright hover:text-accent transition-colors"
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
          <div className="mt-3 space-y-3 rounded-xl border border-border/50 bg-surface/30 p-4">
            <p className="text-xs font-medium text-muted">
              Audit context <span className="text-muted/50">(optional — improves accuracy)</span>
            </p>

            <div>
              <label htmlFor="traffic-type" className="block text-xs text-muted mb-1">
                Who visits this page?
              </label>
              <select
                id="traffic-type"
                value={trafficType}
                onChange={(e) => setTrafficType(e.target.value)}
                disabled={loading}
                className={selectClass}
              >
                {TRAFFIC_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="industry" className="block text-xs text-muted mb-1">
                Industry
              </label>
              <select
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                disabled={loading}
                className={selectClass}
              >
                {INDUSTRIES.map((i) => (
                  <option key={i.value} value={i.value}>
                    {i.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="audience" className="block text-xs text-muted mb-1">
                Target audience / demographic
              </label>
              <input
                id="audience"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Women 25-45, small business owners, developers"
                disabled={loading}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all disabled:opacity-50"
              />
            </div>

            <div className="pt-2 border-t border-border/30">
              <p className="text-xs font-medium text-accent-bright mb-0.5">
                Revenue Impact Analysis
              </p>
              <p className="text-xs text-muted/60 mb-3">
                Add your traffic &amp; revenue data to see how much each issue is costing you.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="monthly-traffic" className="block text-xs text-muted mb-1">
                    Monthly visitors
                  </label>
                  <input
                    id="monthly-traffic"
                    type="number"
                    min="0"
                    value={monthlyTraffic}
                    onChange={(e) => setMonthlyTraffic(e.target.value)}
                    placeholder="e.g. 10000"
                    disabled={loading}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all disabled:opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="avg-order-value" className="block text-xs text-muted mb-1">
                    Avg. order / deal value ($)
                  </label>
                  <input
                    id="avg-order-value"
                    type="number"
                    min="0"
                    step="0.01"
                    value={avgOrderValue}
                    onChange={(e) => setAvgOrderValue(e.target.value)}
                    placeholder="e.g. 50"
                    disabled={loading}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
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

      <OutOfCreditsModal
        open={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
      />
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
