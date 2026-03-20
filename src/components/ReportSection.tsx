import type { AuditFinding } from "@/lib/types";
import FindingCard from "./FindingCard";

const categoryIcons: Record<AuditFinding["category"], string> = {
  cta: "🎯",
  copy: "✍️",
  trust: "🛡️",
  ux: "🧭",
  speed: "⚡",
  mobile: "📱",
};

const categoryLabels: Record<AuditFinding["category"], string> = {
  cta: "Calls to Action",
  copy: "Copy & Messaging",
  trust: "Trust Signals",
  ux: "User Experience",
  speed: "Page Speed",
  mobile: "Mobile Experience",
};

export default function ReportSection({
  category,
  score,
  findings,
  blurAfter,
}: {
  category: AuditFinding["category"];
  score: number;
  findings: AuditFinding[];
  blurAfter?: number;
}) {
  if (findings.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl">{categoryIcons[category]}</span>
        <h2 className="text-lg font-semibold">{categoryLabels[category]}</h2>
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
