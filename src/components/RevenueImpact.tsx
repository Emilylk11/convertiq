import type { RevenueImpact } from "@/lib/types";

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toLocaleString()}`;
}

function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

export default function RevenueImpactSection({
  impact,
  hasFullAccess,
}: {
  impact: RevenueImpact;
  hasFullAccess: boolean;
}) {
  return (
    <div className="rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5 p-5 sm:p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">💰</span>
        <h2 className="text-base sm:text-lg font-semibold">Revenue Impact Analysis</h2>
      </div>

      {/* Main revenue gap */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="rounded-xl bg-background/60 border border-border/30 p-4 text-center">
          <p className="text-xs text-muted mb-1">Estimated current</p>
          <p className="text-lg font-bold text-foreground">
            {formatCurrency(impact.currentMonthlyRevenue)}
            <span className="text-xs font-normal text-muted">/mo</span>
          </p>
          <p className="text-xs text-muted mt-1">
            {impact.currentEstimatedConversionRate}% conv. rate
          </p>
        </div>

        <div className="rounded-xl bg-background/60 border border-border/30 p-4 text-center flex flex-col items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-amber-400 mb-1">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-xs text-muted">Potential with fixes</p>
        </div>

        <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-center">
          <p className="text-xs text-green-400 mb-1">Potential revenue</p>
          <p className="text-lg font-bold text-green-400">
            {formatCurrency(impact.potentialMonthlyRevenue)}
            <span className="text-xs font-normal text-green-400/70">/mo</span>
          </p>
          <p className="text-xs text-green-400/70 mt-1">
            {impact.potentialConversionRate}% conv. rate
          </p>
        </div>
      </div>

      {/* Revenue gap highlight */}
      <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 mb-5 text-center">
        <p className="text-sm text-red-400 mb-1">
          You&apos;re leaving on the table
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-red-400">
          {formatCurrency(impact.monthlyRevenueGap)}/mo
        </p>
        <p className="text-sm text-red-400/70 mt-1">
          That&apos;s <span className="font-semibold">{formatCurrency(impact.annualRevenueGap)}/year</span> in lost revenue
        </p>
      </div>

      {/* Top costly issues */}
      {impact.topCostlyIssues.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3">
            Your costliest conversion issues
          </h3>
          <div className="space-y-2">
            {impact.topCostlyIssues.map((issue, i) => {
              const showDetail = hasFullAccess || i < 2;
              return (
                <div
                  key={issue.findingId}
                  className={`flex items-center justify-between gap-3 rounded-lg border border-border/30 bg-background/40 px-4 py-3 ${
                    !showDetail ? "blur-[4px] select-none" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-bold text-muted shrink-0 w-5">
                      #{i + 1}
                    </span>
                    <span className="text-sm truncate">{issue.title}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-semibold text-red-400">
                      -{formatCurrency(issue.estimatedMonthlyLoss)}/mo
                    </span>
                    <span className="block text-xs text-muted">
                      +{issue.conversionLift}% if fixed
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {!hasFullAccess && impact.topCostlyIssues.length > 2 && (
            <p className="text-xs text-muted text-center mt-3">
              <a href="/pricing" className="text-accent-bright hover:underline">
                Upgrade
              </a>{" "}
              to see all costly issues with full breakdowns
            </p>
          )}
        </div>
      )}

      {/* Context note */}
      <p className="text-xs text-muted/50 mt-4 text-center">
        Based on {formatNumber(impact.monthlyTraffic)} monthly visitors × {formatCurrency(impact.avgOrderValue)} avg. value.
        Estimates are directional — actual results depend on implementation.
      </p>
    </div>
  );
}