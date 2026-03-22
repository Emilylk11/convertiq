import type { AuditResults } from "@/lib/types";
import { getCategoryLabel, scoreColor } from "@/lib/audit-categories";
import ScoreGauge from "./ScoreGauge";
import ReportSection from "./ReportSection";
import CopyButton from "./CopyButton";
import ShareButton from "./ShareButton";
import ReAuditButton from "./ReAuditButton";

export default function AuditReport({
  results,
  url,
  auditId,
  isSharedView = false,
}: {
  results: AuditResults;
  url: string;
  auditId: string;
  isSharedView?: boolean;
}) {
  const categories = Object.keys(results.categoryScores);

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
      {!isSharedView && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <a
            href={`/api/audit/${auditId}/pdf`}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium bg-surface border border-border/50 text-muted hover:text-foreground hover:border-border transition-all"
            download
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2v8M5 7l3 3 3-3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12h12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Download PDF
          </a>
          <ShareButton auditId={auditId} />
          <ReAuditButton auditId={auditId} />
        </div>
      )}

      {/* Category scores */}
      <div className={`grid grid-cols-3 ${categories.length <= 6 ? "sm:grid-cols-6" : "sm:grid-cols-" + categories.length} gap-2 sm:gap-3 mb-8`}>
        {categories.map((cat) => (
          <div
            key={cat}
            className="rounded-xl border border-border/50 bg-surface/50 p-3 sm:p-4 text-center"
          >
            <div className={`text-lg sm:text-xl font-bold ${scoreColor(results.categoryScores[cat])}`}>
              {results.categoryScores[cat]}
            </div>
            <div className="text-xs text-muted mt-1 uppercase">
              {getCategoryLabel(cat)}
            </div>
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

      {/* Findings by category */}
      {categories.map((cat) => {
        const catFindings = results.findings.filter((f) => f.category === cat);
        return (
          <ReportSection
            key={cat}
            category={cat}
            score={results.categoryScores[cat]}
            findings={catFindings}
          />
        );
      })}
    </div>
  );
}
