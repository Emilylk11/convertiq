"use client";

import { useState } from "react";

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

  const updateStage = (index: number, field: keyof FunnelStage, value: string) => {
    const updated = [...stages];
    updated[index] = { ...updated[index], [field]: value };
    setStages(updated);
  };

  const addStage = () => {
    if (stages.length >= 5) return;
    setStages([...stages, { stageName: `Stage ${stages.length + 1}`, type: "url", content: "" }]);
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
      if (!res.ok) throw new Error(data.error || "Audit failed");
      window.location.href = `/audit/${data.auditId}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
                className="bg-transparent border-none text-sm font-semibold focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={stage.type}
                onChange={(e) => updateStage(i, "type", e.target.value as "url" | "text")}
                className="rounded-lg border border-border/50 bg-background px-2 py-1 text-xs"
              >
                <option value="url">URL</option>
                <option value="text">Paste Text</option>
              </select>
              {stages.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeStage(i)}
                  className="text-muted hover:text-red-400 transition-colors"
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
              className="w-full rounded-lg border border-border/50 bg-background px-3 py-2.5 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50"
            />
          ) : (
            <textarea
              value={stage.content}
              onChange={(e) => updateStage(i, "content", e.target.value)}
              placeholder="Paste your ad copy, email content, or other text here..."
              rows={4}
              className="w-full rounded-lg border border-border/50 bg-background px-3 py-2.5 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 resize-y font-mono"
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
          className="w-full rounded-xl border border-dashed border-border/50 py-3 text-sm text-muted hover:text-foreground hover:border-accent/30 transition-colors"
        >
          + Add Stage (up to 5)
        </button>
      )}

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
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g., SaaS, E-commerce, Agency"
              className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Target Audience</label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g., Small business owners, 25-45"
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
        disabled={loading || stages.filter((s) => s.content.trim()).length < 2}
        className="w-full rounded-xl bg-gradient-to-r from-accent to-accent-dim px-6 py-4 text-base font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            Analyzing funnel...
          </span>
        ) : (
          "Run Funnel Audit (2 Credits) →"
        )}
      </button>
    </form>
  );
}
