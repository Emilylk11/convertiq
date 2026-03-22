"use client";

import { useState } from "react";
import OutOfCreditsModal from "./OutOfCreditsModal";

interface FunnelStage {
  stageName: string;
  type: "url" | "text";
  content: string;
}

const DEFAULT_STAGES: FunnelStage[] = [
  { stageName: "Ad / Traffic Source", type: "text", content: "" },
  { stageName: "Landing Page", type: "url", content: "" },
  { stageName: "Checkout / Conversion", type: "url", content: "" },
];

export default function FunnelAuditForm({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [stages, setStages] = useState<FunnelStage[]>(DEFAULT_STAGES);
  const [industry, setIndustry] = useState("");
  const [audience, setAudience] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  const updateStage = (index: number, field: keyof FunnelStage, value: string) => {
    const updated = [...stages];
    updated[index] = { ...updated[index], [field]: value };
    setStages(updated);
  };

  const urlStageCount = stages.filter((s) => s.type === "url").length;

  const addStage = () => {
    if (stages.length >= 5) return;
    // Default new stages to "text" if already at 3 URL stages
    const defaultType = urlStageCount >= 3 ? "text" : "url";
    setStages([...stages, { stageName: `Stage ${stages.length + 1}`, type: defaultType, content: "" }]);
  };

  const removeStage = (index: number) => {
    if (stages.length <= 2) return;
    setStages(stages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const filledStages = stages.filter((s) => s.content.trim());
    if (filledStages.length < 2) {
      setError("Please fill in at least 2 funnel stages.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/audit/funnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stages: filledStages,
          context: showContext ? { industry, audience } : undefined,
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
      {/* Credit cost notice */}
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 flex items-center gap-2">
        <span className="text-amber-400 text-sm">⚡</span>
        <p className="text-xs text-amber-400/80">
          Full funnel audits cost <span className="font-semibold text-amber-400">2 credits</span> because they analyze multiple pages.
          Max 3 URL stages — use &quot;Paste Text&quot; for others.
        </p>
      </div>

      {stages.map((stage, i) => (
        <div key={i} className="rounded-xl border border-border/50 bg-surface/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-7 w-7 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-xs font-bold text-accent-bright">
                {i + 1}
              </span>
              <input
                type="text"
                value={stage.stageName}
                onChange={(e) => updateStage(i, "stageName", e.target.value)}
                disabled={loading}
                className="bg-transparent border-none text-sm font-semibold focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={stage.type}
                onChange={(e) => {
                  const newType = e.target.value as "url" | "text";
                  if (newType === "url" && stage.type !== "url" && urlStageCount >= 3) {
                    setError("Maximum 3 URL stages. Use \"Paste Text\" for additional stages.");
                    return;
                  }
                  setError("");
                  updateStage(i, "type", newType);
                }}
                disabled={loading}
                className="rounded-lg border border-border/50 bg-background px-2 py-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="url" disabled={stage.type !== "url" && urlStageCount >= 3}>URL</option>
                <option value="text">Paste Text</option>
              </select>
              {stages.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeStage(i)}
                  disabled={loading}
                  className="text-muted hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {stage.type === "url" ? (
            <input
              type="text"
              value={stage.content}
              onChange={(e) => updateStage(i, "content", e.target.value)}
              placeholder="https://yoursite.com/page"
              disabled={loading}
              className={`${inputClass} rounded-lg`}
            />
          ) : (
            <textarea
              value={stage.content}
              onChange={(e) => updateStage(i, "content", e.target.value)}
              placeholder="Paste your ad copy, email content, or other text here..."
              rows={4}
              disabled={loading}
              className={`${inputClass} rounded-lg resize-y font-mono`}
            />
          )}

          {i < stages.length - 1 && (
            <div className="flex justify-center pt-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-muted">
                <path d="M8 3v10M5 10l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
      ))}

      {stages.length < 5 && (
        <button
          type="button"
          onClick={addStage}
          disabled={loading}
          className="w-full rounded-xl border border-dashed border-border/50 py-3 text-sm text-muted hover:text-foreground hover:border-accent/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Add Stage (up to 5)
        </button>
      )}

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
            <label htmlFor="funnel-industry" className="block text-xs text-muted mb-1">Industry</label>
            <input
              id="funnel-industry"
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g., SaaS, E-commerce, Agency"
              disabled={loading}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="funnel-audience" className="block text-xs text-muted mb-1">Target Audience</label>
            <input
              id="funnel-audience"
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g., Small business owners, 25-45"
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
        disabled={loading || stages.filter((s) => s.content.trim()).length < 2}
        className="w-full rounded-xl bg-gradient-to-r from-accent to-accent-dim px-6 py-4 text-base font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            Analyzing funnel...
          </span>
        ) : isLoggedIn ? (
          "Run Funnel Audit (2 Credits) →"
        ) : (
          "Get Free Funnel Audit →"
        )}
      </button>

      <OutOfCreditsModal
        open={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
      />
    </form>
  );
}
