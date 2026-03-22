import { createClient } from "@/lib/supabase/server";
import { getCreditBalance } from "@/lib/credits";
import { createAdminClient } from "@/lib/supabase/server";
import { getUserTier, type UserTier } from "@/lib/tiers";
import { redirect } from "next/navigation";
import type { AuditRecord } from "@/lib/types";
import DashboardNav from "@/components/DashboardNav";
import SupportButton from "@/components/SupportButton";
import OnboardingBanner from "@/components/OnboardingBanner";
import LowCreditWarning from "@/components/LowCreditWarning";
import AuditHistoryClient from "@/components/AuditHistoryClient";
import ReferralPanel from "@/components/ReferralPanel";
import { scoreColor } from "@/lib/audit-categories";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — ConvertIQ",
  description: "Your audit history and credit balance.",
};

function tierBadge(tier: UserTier) {
  const styles: Record<UserTier, { bg: string; text: string; label: string }> = {
    free: { bg: "bg-zinc-500/10 border-zinc-500/20", text: "text-zinc-400", label: "Free" },
    starter: { bg: "bg-blue-500/10 border-blue-500/20", text: "text-blue-400", label: "Starter" },
    growth: { bg: "bg-purple-500/10 border-purple-500/20", text: "text-purple-400", label: "Growth" },
    agency: { bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-400", label: "Agency" },
  };
  const s = styles[tier];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ purchased?: string }>;
}) {
  const params = await searchParams;
  const justPurchased = params.purchased === "true";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch credit balance, tier, and audit history in parallel
  let balance = 0;
  let tier: UserTier = "free";
  let audits: Pick<AuditRecord, "id" | "url" | "audit_type" | "status" | "overall_score" | "created_at">[] = [];

  try {
    const [bal, userTier, auditsResult] = await Promise.all([
      getCreditBalance(user.id).catch(() => 0),
      getUserTier(user.id).catch(() => "free" as UserTier),
      createAdminClient()
        .from("audits")
        .select("id, url, audit_type, status, overall_score, created_at")
        .or(`user_id.eq.${user.id},email.eq.${user.email}`)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);
    balance = bal;
    tier = userTier;
    audits = (auditsResult.data || []) as typeof audits;
  } catch (e) {
    console.error("Dashboard data fetch error:", e);
  }

  const completedAudits = audits.filter((a) => a.status === "completed");
  const avgScore =
    completedAudits.filter((a) => a.overall_score).length > 0
      ? Math.round(
          completedAudits
            .filter((a) => a.overall_score)
            .reduce((sum, a) => sum + (a.overall_score || 0), 0) /
            completedAudits.filter((a) => a.overall_score).length
        )
      : null;

  // Score trend for the most recently audited URL
  const latestUrl = completedAudits.length > 0 ? completedAudits[0].url : null;
  let latestUrlTrend: { current: number; previous: number } | null = null;
  if (latestUrl) {
    const urlAudits = completedAudits
      .filter((a) => a.url === latestUrl && a.overall_score !== null)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    if (urlAudits.length >= 2) {
      latestUrlTrend = {
        current: urlAudits[0].overall_score!,
        previous: urlAudits[1].overall_score!,
      };
    }
  }

  // Count unique URLs that have been audited multiple times
  const urlCounts = new Map<string, number>();
  for (const a of completedAudits) {
    urlCounts.set(a.url, (urlCounts.get(a.url) || 0) + 1);
  }
  const trackedUrls = [...urlCounts.entries()].filter(([, count]) => count >= 2).length;

  return (
    <div className="min-h-full bg-background text-foreground">
      <DashboardNav
        tier={tier}
        balance={balance}
        email={user.email ?? ""}
        activePage="dashboard"
      />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-12">
        {/* Purchase success banner */}
        {justPurchased && (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4 mb-6 flex items-center gap-3">
            <span className="text-xl">&#127881;</span>
            <div>
              <p className="text-sm font-semibold text-green-400">
                Payment successful!
              </p>
              <p className="text-xs text-muted">
                Your credits have been added to your account.
              </p>
            </div>
          </div>
        )}

        {/* Low credit warning */}
        <LowCreditWarning balance={balance} />

        {/* Onboarding for new users */}
        <OnboardingBanner
          hasAudits={audits.length > 0}
          balance={balance}
          tier={tier}
          userName={user.email ?? undefined}
        />

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Dashboard
              </h1>
              {tierBadge(tier)}
            </div>
            <p className="text-sm text-muted">{user.email}</p>
          </div>
          <a
            href="/dashboard/new-audit"
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent-bright transition-colors"
          >
            Run Audit
          </a>
        </div>

        {/* Stats cards */}
        <div className="grid sm:grid-cols-4 gap-4 mb-10">
          <div className="rounded-2xl border border-border/50 bg-surface/50 p-6">
            <p className="text-xs text-muted uppercase tracking-wider mb-1">
              Credits remaining
            </p>
            <p className="text-3xl font-bold text-accent-bright">{balance}</p>
            <a
              href="/pricing"
              className="inline-block mt-3 text-xs text-accent-bright hover:underline"
            >
              Buy more credits &rarr;
            </a>
          </div>
          <div className="rounded-2xl border border-border/50 bg-surface/50 p-6">
            <p className="text-xs text-muted uppercase tracking-wider mb-1">
              Total audits
            </p>
            <p className="text-3xl font-bold">{audits.length}</p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-surface/50 p-6">
            <p className="text-xs text-muted uppercase tracking-wider mb-1">
              Average score
            </p>
            <p className={`text-3xl font-bold ${avgScore !== null ? scoreColor(avgScore) : ""}`}>
              {avgScore !== null ? avgScore : "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-surface/50 p-6">
            <p className="text-xs text-muted uppercase tracking-wider mb-1">
              URLs tracked
            </p>
            <p className="text-3xl font-bold">{trackedUrls}</p>
            {trackedUrls > 0 && latestUrlTrend && (
              <p className="mt-2 text-xs">
                <span className="text-muted">Latest: </span>
                <span className={latestUrlTrend.current >= latestUrlTrend.previous ? "text-green-400" : "text-red-400"}>
                  {latestUrlTrend.current > latestUrlTrend.previous ? "+" : ""}
                  {latestUrlTrend.current - latestUrlTrend.previous} pts
                </span>
              </p>
            )}
            {trackedUrls === 0 && (
              <p className="mt-3 text-xs text-muted">Re-audit a page to track progress</p>
            )}
          </div>
        </div>

        {/* Tier-specific feature panels */}
        {tier === "free" && (
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 mb-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-accent-bright mb-1">Upgrade your plan</h3>
                <p className="text-xs text-muted max-w-md">
                  You&apos;re on the Free plan. Upgrade to Starter for full findings, PDF reports, and re-audits.
                </p>
              </div>
              <a
                href="/pricing"
                className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent-bright transition-colors shrink-0"
              >
                View Plans
              </a>
            </div>
          </div>
        )}

        {tier === "starter" && (
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-xs font-semibold text-blue-400">PDF Export</p>
              </div>
              <p className="text-xs text-muted">Download professional PDF reports for any audit.</p>
            </div>
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <p className="text-xs font-semibold text-blue-400">Full Findings</p>
              </div>
              <p className="text-xs text-muted">See every finding with detailed recommendations.</p>
            </div>
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <p className="text-xs font-semibold text-blue-400">Re-Audit</p>
              </div>
              <p className="text-xs text-muted">Track changes over time by re-running audits.</p>
            </div>
          </div>
        )}

        {tier === "growth" && (
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                  <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <p className="text-xs font-semibold text-purple-400">AI Rewrites</p>
              </div>
              <p className="text-xs text-muted">Get AI-powered copy rewrites to boost conversions.</p>
            </div>
            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-xs font-semibold text-purple-400">Competitor Analysis</p>
              </div>
              <p className="text-xs text-muted">Compare your pages against competitors side by side.</p>
            </div>
            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-xs font-semibold text-purple-400">Priority Processing</p>
              </div>
              <p className="text-xs text-muted">Your audits are processed first in our queue.</p>
            </div>
          </div>
        )}

        {tier === "agency" && (
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                  <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <p className="text-xs font-semibold text-amber-400">Custom Branding</p>
              </div>
              <p className="text-xs text-muted">White-label PDF reports with your agency branding.</p>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                  <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-xs font-semibold text-amber-400">Bulk Audit</p>
              </div>
              <p className="text-xs text-muted">Audit multiple URLs at once for large client sites.</p>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                  <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="text-xs font-semibold text-amber-400">Priority Support</p>
              </div>
              <p className="text-xs text-muted">Direct access to our team for help and strategy.</p>
            </div>
          </div>
        )}

        {/* Audit types grid */}
        {tier !== "free" && (
          <div className="mb-10">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Run an Audit</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <a href="/dashboard/new-audit" className="rounded-xl border border-border/50 bg-surface/30 p-4 hover:bg-surface/60 hover:border-accent/30 transition-all text-center">
                <span className="text-2xl block mb-2">&#127919;</span>
                <span className="text-xs font-medium">Landing Page</span>
              </a>
              <a href="/dashboard/email-audit" className="rounded-xl border border-border/50 bg-surface/30 p-4 hover:bg-surface/60 hover:border-accent/30 transition-all text-center">
                <span className="text-2xl block mb-2">&#128231;</span>
                <span className="text-xs font-medium">Email</span>
              </a>
              <a href="/dashboard/ad-audit" className="rounded-xl border border-border/50 bg-surface/30 p-4 hover:bg-surface/60 hover:border-accent/30 transition-all text-center">
                <span className="text-2xl block mb-2">&#128226;</span>
                <span className="text-xs font-medium">Ad Copy</span>
              </a>
              <a href="/dashboard/checkout-audit" className="rounded-xl border border-border/50 bg-surface/30 p-4 hover:bg-surface/60 hover:border-accent/30 transition-all text-center">
                <span className="text-2xl block mb-2">&#128722;</span>
                <span className="text-xs font-medium">Checkout</span>
              </a>
              <a href="/dashboard/funnel-audit" className="rounded-xl border border-border/50 bg-surface/30 p-4 hover:bg-surface/60 hover:border-accent/30 transition-all text-center">
                <span className="text-2xl block mb-2">&#128260;</span>
                <span className="text-xs font-medium">Full Funnel</span>
                <span className="block text-[10px] text-amber-400 mt-0.5">2 credits</span>
              </a>
            </div>
          </div>
        )}

        {/* Referral panel */}
        {tier !== "free" && (
          <div className="mb-10">
            <ReferralPanel />
          </div>
        )}

        {/* Audit history — client component with search, filters, and score trends */}
        <AuditHistoryClient
          audits={audits.map((a) => ({
            id: a.id,
            url: a.url,
            audit_type: a.audit_type,
            status: a.status,
            overall_score: a.overall_score,
            created_at: a.created_at,
          }))}
        />
      </main>

      {/* Floating support button */}
      <SupportButton />
    </div>
  );
}
