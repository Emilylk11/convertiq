import type { AuditFinding } from "@/lib/types";
import { getCategoryFullLabel, getCategoryIcon } from "@/lib/audit-categories";
import FindingCard from "./FindingCard";

export default function ReportSection({
  category,
  score,
  findings,
  blurAfter,
}: {
  category: string;
  score: number;
  findings: AuditFinding[];
  blurAfter?: number;
}) {
  if (findings.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl">{getCategoryIcon(category)}</span>
        <h2 className="text-lg font-semibold">
          {getCategoryFullLabel(category)}
        </h2>
        <span className="ml-auto text-sm font-mono text-muted">
          {score}/100
        </span>
      </div>
      <div className="space-y-4">
        {findings.map((finding, index) => (
          <FindingCard
            key={finding.id}
            finding={finding}
            blurred={blurAfter !== undefined && index >= blurAfter}
          />
        ))}
      </div>
    </div>
  );
}
