"use client";

import { useState } from "react";
import type { CopyRewrite } from "@/lib/types";
import CopyButton from "./CopyButton";

const frameworkLabels: Record<string, { label: string; color: string }> = {
  PAS: { label: "Problem → Agitate → Solve", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  AIDA: { label: "Attention → Interest → Desire → Action", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  BAB: { label: "Before → After → Bridge", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  "4Us": { label: "Useful · Urgent · Unique · Ultra-specific", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  FAB: { label: "Feature → Advantage → Benefit", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  StoryBrand: { label: "StoryBrand Framework", color: "text-green-400 bg-green-500/10 border-green-500/20" },
  RiskReversal: { label: "Risk Reversal", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  SocialProof: { label: "Social Proof", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
  Urgency: { label: "Urgency / Scarcity", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
  Specificity: { label: "Specificity", color: "text-teal-400 bg-teal-500/10 border-teal-500/20" },
};

const elementIcons: Record<string, string> = {
  headline: "H1",
  subheadline: "H2",
  cta_button: "⬆",
  value_prop: "✦",
  section_heading: "§",
  body_paragraph: "¶",
  testimonial_area: "❝",
  pricing_description: "$",
  meta_description: "🔍",
};

const elementLabels: Record<string, string> = {
  headline: "Headline",
  subheadline: "Subheadline",
  cta_button: "CTA Button",
  value_prop: "Value Proposition",
  section_heading: "Section Heading",
  body_paragraph: "Body Copy",
  testimonial_area: "Testimonial Area",
  pricing_description: "Pricing Copy",
  meta_description: "Meta Description",
};

export default function CopyRewritesSection({
  rewrites,
  hasFullAccess,
}: {
  rewrites: CopyRewrite[];
  hasFullAccess: boolean;
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!rewrites || rewrites.length === 0) return null;

  const visibleRewrites = hasFullAccess ? rewrites : rewrites.slice(0, 2);
  const hiddenCount = hasFullAccess ? 0 : Math.max(0, rewrites.length - 2);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">✍️</span>
        <h2 className="text-base sm:text-lg font-semibold">
          Copy Rewrites — Ready to Deploy
        </h2>
        <span className="text-xs text-muted bg-surface border border-border/50 rounded-full px-2 py-0.5">
          {rewrites.length} rewrites
        </span>
      </div>

      <div className="space-y-3">
        {visibleRewrites.map((rewrite, i) => {
          const fw = frameworkLabels[rewrite.framework] || {
            label: rewrite.framework,
            color: "text-muted bg-surface border-border/50",
          };
          const icon = elementIcons[rewrite.element] || "✎";
          const label = elementLabels[rewrite.element] || rewrite.element;
          const isExpanded = expandedIndex === i;

          return (
            <div
              key={i}
              className="rounded-xl border border-border/50 bg-surface/50 overflow-hidden"
            >
              {/* Header - always visible */}
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-surface/80 transition-colors"
              >
                <span className="shrink-0 w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-xs font-bold text-accent-bright">
                  {icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs text-muted truncate">
                    {rewrite.original}
                  </p>
                </div>
                <span className={`shrink-0 text-xs px-2 py-0.5 rounded-md border ${fw.color}`}>
                  {rewrite.framework}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className={`shrink-0 text-muted transition-transform ${isExpanded ? "rotate-180" : ""}`}
                >
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-5 pb-5 space-y-3 border-t border-border/30">
                  {/* Original */}
                  <div className="mt-3">
                    <p className="text-xs text-muted mb-1.5 flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-red-400/60" />
                      Original
                    </p>
                    <div className="rounded-lg bg-red-500/5 border border-red-500/10 px-4 py-3">
                      <p className="text-sm text-muted leading-relaxed line-through decoration-red-400/30">
                        {rewrite.original}
                      </p>
                    </div>
                  </div>

                  {/* Rewritten */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs text-muted flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-400/60" />
                        Rewritten
                      </p>
                      <CopyButton text={rewrite.rewritten} label="rewrite" />
                    </div>
                    <div className="rounded-lg bg-green-500/5 border border-green-500/10 px-4 py-3">
                      <p className="text-sm text-foreground leading-relaxed font-medium">
                        {rewrite.rewritten}
                      </p>
                    </div>
                  </div>

                  {/* Framework + Rationale */}
                  <div className="rounded-lg bg-surface border border-border/30 px-4 py-3">
                    <p className="text-xs text-muted mb-1">
                      <span className={`font-semibold ${fw.color.split(" ")[0]}`}>
                        {fw.label}
                      </span>
                    </p>
                    <p className="text-xs text-muted leading-relaxed">
                      {rewrite.rationale}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Gated section */}
      {hiddenCount > 0 && (
        <div className="relative mt-3">
          <div className="space-y-3">
            {rewrites.slice(2, 4).map((rewrite, i) => (
              <div
                key={i}
                className="rounded-xl border border-border/50 bg-surface/50 px-5 py-4 blur-[5px] select-none pointer-events-none"
              >
                <div className="flex items-center gap-3">
                  <span className="shrink-0 w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-xs font-bold text-accent-bright">
                    {elementIcons[rewrite.element] || "✎"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">
                      {elementLabels[rewrite.element] || rewrite.element}
                    </p>
                    <p className="text-xs text-muted truncate">{rewrite.original}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background via-background/80 to-transparent rounded-xl">
            <div className="text-center px-6">
              <p className="text-sm font-semibold mb-1">
                {hiddenCount} more copy rewrite{hiddenCount > 1 ? "s" : ""} available
              </p>
              <p className="text-xs text-muted mb-3">
                Unlock all rewrites with a full audit
              </p>
              <a
                href="/pricing"
                className="inline-block rounded-lg bg-gradient-to-r from-accent to-accent-dim px-5 py-2 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Unlock All Rewrites
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
