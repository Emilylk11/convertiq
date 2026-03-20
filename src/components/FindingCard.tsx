import type { AuditFinding } from "@/lib/types";
import CopyButton from "./CopyButton";

const severityStyles = {
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
  warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const categoryLabels: Record<AuditFinding["category"], string> = {
  cta: "CTA",
  copy: "Copy",
  trust: "Trust",
  ux: "UX",
  speed: "Speed",
  mobile: "Mobile",
};

export default function FindingCard({
  finding,
  blurred = false,
}: {
  finding: AuditFinding;
  blurred?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-border/50 bg-surface/50 p-5 sm:p-6 ${blurred ? "blur-[6px] select-none pointer-events-none" : ""}`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span
          className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold border ${severityStyles[finding.severity]}`}
        >
          {finding.severity}
        </span>
        <span className="text-xs text-muted font-mono">
          {categoryLabels[finding.category]}
        </span>
        <span className="ml-auto text-xs text-muted">
          Impact: {finding.impactScore}/10
        </span>
      </div>

      <h3 className="text-base font-semibold mb-2">{finding.title}</h3>
      <p className="text-sm text-muted leading-relaxed mb-3">
        {finding.description}
      </p>

      <div className="rounded-lg bg-accent/5 border border-accent/10 px-4 py-3">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-sm text-accent-bright font-medium">
            Recommendation
          </p>
          {!blurred && (
            <CopyButton text={finding.recommendation} label="recommendation" />
          )}
        </div>
        <p className="text-sm text-muted leading-relaxed">
          {finding.recommendation}
        </p>
      </div>

      {finding.rewrittenCopy && (
        <div className="mt-3 rounded-lg bg-success/5 border border-success/10 px-4 py-3">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="text-sm text-success font-medium">Suggested copy</p>
            {!blurred && (
              <CopyButton text={finding.rewrittenCopy} label="copy" />
            )}
          </div>
          <p className="text-sm text-foreground leading-relaxed italic">
            &ldquo;{finding.rewrittenCopy}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
