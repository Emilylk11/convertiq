import type { AuditResults, AuditFinding } from "@/lib/types";
import { type UserTier, canViewFullFindings, canReaudit } from "@/lib/tiers";
import ScoreGauge from "./ScoreGauge";
import FindingCard from "./FindingCard";
import CopyButton from "./CopyButton";
import ShareButton from "./ShareButton";
import ReAuditButton from "./ReAuditButton";
import RevenueImpactSection from "./RevenueImpact";
import CopyRewritesSection from "./CopyRewrites";

const FREE_VISIBLE_COUNT = 2;

const CATEGORIES: AuditFinding["category"][] = [
  "cta",
  "copy",
  "trust",
  "ux",
  "speed",
  "mobile",
];

const categoryLabels: Record<string, string> = {
  cta: "CTA",
  copy: "Copy",
  trust: "Trust",
  ux: "UX",
  speed: "Speed",
  mobile: "Mobile",
};

function scoreColor(score: number) {
  if (score >= 70) return "text-green-400";
  if (score >= 40) return "text-yellow-400";
  return "text-red-400";
}

export default function AuditReportGated({
  results,
  url,
  auditId,
  userTier = "free",
}: {
  results: AuditResults;
  url: string;
  auditId: string;
  userTier?: UserTier;
}) {
  const hasFullAccess = canViewFullFindings(userTier);
  const showReaudit = canReaudit(userTier);

  const visibleFindings = hasFullAccess
    ? results.findings
    : results.findings.slice(0, FREE_VISIBLE_COUNT);
  const hiddenFindings = hasFullAccess
    ? []
    : results.findings.slice(FREE_VISIBLE_COUNT);
  const hiddenCount = hiddenFindings.length;

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-sm text-muted mb-2">Conversion audit for</p>
        <p className="text-base font-medium text-accent-bright mb-6 break-all px-4">
          {url}
        </p>
        <ScoreGauge score={results.overallScore} />
        <p className="mt-4 text-muted text-sm max-w-lg mx-auto leading-relaxed px-4">
          {results.summary}
        </p>
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        <ShareButton auditId={auditId} />
        {showReaudit ? (
          <ReAuditButton auditId={auditId} />
        ) : (
          <a
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium bg-surface border border-border/50 text-muted hover:text-foreground hover:border-border transition-all"
            title="Upgrade to unlock re-audit"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="5" y="1" width="6" height="9" rx="3" stroke="currentColor" strokeWidth="1.5" />
              <rect x="3" y="7" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Re-audit — Upgrade to unlock
          </a>
        )}
      </div>

      {/* Revenue Impact */}
      {results.revenueImpact && (
        <RevenueImpactSection
          impact={results.revenueImpact}
          hasFullAccess={hasFullAccess}
        />
      )}

      {/* Category scores */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mb-8">
        {CATEGORIES.map((cat) => (
          <div
            key={cat}
            className="rounded-xl border border-border/50 bg-surface/50 p-3 sm:p-4 text-center"
          >
            <div className={`text-lg sm:text-xl font-bold ${scoreColor(results.categoryScores[cat])}`}>
              {results.categoryScores[cat]}
            </div>
            <div className="text-xs text-muted mt-1 uppercase">{categoryLabels[cat]}</div>
          </div>
        ))}
      </div>

      {/* Rewritten headlines */}
      {(results.rewrittenHeadline || results.rewrittenSubheadline) && (
        <div className="gradient-border rounded-2xl bg-surface p-5 sm:p-6 mb-8">
          <h2 className="text-base sm:text-lg font-semibold mb-4">
            ✨ Suggested headline rewrites
          </h2>
          {results.rewrittenHeadline && (
            <div className="mb-4">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-xs text-muted">Headline</p>
                <CopyButton
                  text={results.rewrittenHeadline}
                  label="headline"
                />
              </div>
              <p className="text-base font-medium text-accent-bright italic">
                &ldquo;{results.rewrittenHeadline}&rdquo;
              </p>
            </div>
          )}
          {results.rewrittenSubheadline && (
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-xs text-muted">Subheadline</p>
                <CopyButton
                  text={results.rewrittenSubheadline}
                  label="subheadline"
                />
              </div>
              <p className="text-base text-foreground italic">
                &ldquo;{results.rewrittenSubheadline}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}

      {/* Copy Rewrites */}
      {results.copyRewrites && results.copyRewrites.length > 0 && (
        <CopyRewritesSection
          rewrites={results.copyRewrites}
          hasFullAccess={hasFullAccess}
        />
      )}

      {/* Visible findings */}
      <h2 className="text-base sm:text-lg font-semibold mb-4">Key findings</h2>
      <div className="space-y-4 mb-6">
        {visibleFindings.map((finding) => (
          <FindingCard key={finding.id} finding={finding} />
        ))}
      </div>

      {/* Blurred / gated findings */}
      {hiddenCount > 0 && (
        <div className="relative">
          <div className="space-y-4">
            {hiddenFindings.slice(0, 2).map((finding) => (
              <FindingCard key={finding.id} finding={finding} blurred />
            ))}
          </div>

          {/* Gate overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background via-background/90 to-transparent rounded-xl">
            <div className="text-center px-6">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-xl font-bold mb-2">
                {hiddenCount} more finding{hiddenCount > 1 ? "s" : ""} available
              </h3>
              <p className="text-muted text-sm mb-5 max-w-sm mx-auto">
                Upgrade to a full audit to unlock all findings, detailed
                recommendations, and copy rewrites.
              </p>
              <a
                href="/pricing"
                className="inline-block rounded-xl bg-gradient-to-r from-accent to-accent-dim px-8 py-3.5 text-base font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Unlock Full Report
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
