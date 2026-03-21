import { createClient } from "@/lib/supabase/server";
import { getCreditBalance } from "@/lib/credits";
import { createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { AuditRecord } from "@/lib/types";
import MobileNav from "@/components/MobileNav";
import ThemeToggle from "@/components/ThemeToggle";
import SignOutButton from "@/components/SignOutButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — ConvertIQ",
  description: "Your audit history and credit balance.",
};

function scoreColor(score: number) {
  if (score >= 70) return "text-green-400";
  if (score >= 40) return "text-yellow-400";
  return "text-red-400";
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

  // Fetch credit balance and audit history in parallel (wrapped in try/catch for resilience)
  let balance = 0;
  let audits: Pick<AuditRecord, "id" | "url" | "audit_type" | "status" | "overall_score" | "created_at">[] = [];

  try {
    const [bal, auditsResult] = await Promise.all([
      getCreditBalance(user.id).catch(() => 0),
      createAdminClient()
        .from("audits")
        .select("id, url, audit_type, status, overall_score, created_at")
        .or(`user_id.eq.${user.id},email.eq.${user.email}`)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);
    balance = bal;
    audits = (auditsResult.data || []) as typeof audits;
  } catch (e) {
    console.error("Dashboard data fetch error:", e);
  }

  return (
    <div className="min-h-full bg-background text-foreground">
      {/* Nav */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 sm:px-6 h-16">
          <a href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center font-mono text-sm font-bold text-white shrink-0">
              C
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Convert<span className="text-accent-bright">IQ</span>
            </span>
          </a>
          <div className="hidden sm:flex items-center gap-8 text-sm text-muted">
            <a href="/dashboard" className="text-foreground transition-colors">
              Dashboard
            </a>
            <a href="/examples" className="hover:text-foreground transition-colors">
              Examples
            </a>
            <a href="/pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-xs font-medium text-accent-bright">
              {balance} credit{balance !== 1 ? "s" : ""}
            </span>
            <ThemeToggle />
            <a
              href="/#free-audit"
              className="rounded-full bg-accent px-4 sm:px-5 py-2 text-sm font-medium text-white hover:bg-accent-bright transition-colors"
            >
              New Audit
            </a>
            <span className="hidden sm:inline text-xs text-muted truncate max-w-[120px]" title={user.email ?? ""}>
              {user.email}
            </span>
            <SignOutButton />
            <MobileNav />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-12">
        {/* Purchase success banner */}
        {justPurchased && (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4 mb-6 flex items-center gap-3">
            <span className="text-xl">🎉</span>
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

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
              Dashboard
            </h1>
            <p className="text-sm text-muted">{user.email}</p>
          </div>
          <SignOutButton />
        </div>

        {/* Stats cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-2xl border border-border/50 bg-surface/50 p-6">
            <p className="text-xs text-muted uppercase tracking-wider mb-1">
              Credits remaining
            </p>
            <p className="text-3xl font-bold text-accent-bright">{balance}</p>
            <a
              href="/pricing"
              className="inline-block mt-3 text-xs text-accent-bright hover:underline"
            >
              Buy more credits →
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
            <p className="text-3xl font-bold">
              {audits.filter((a) => a.overall_score).length > 0
                ? Math.round(
                    audits
                      .filter((a) => a.overall_score)
                      .reduce((sum, a) => sum + (a.overall_score || 0), 0) /
                      audits.filter((a) => a.overall_score).length
                  )
                : "—"}
            </p>
          </div>
        </div>

        {/* Audit history */}
        <h2 className="text-lg font-semibold mb-4">Audit history</h2>
        {audits.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/50 p-10 text-center">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold mb-2">No audits yet</h3>
            <p className="text-sm text-muted mb-5 max-w-sm mx-auto">
              Run your first audit to see it appear here.
            </p>
            <a
              href="/#free-audit"
              className="inline-block rounded-xl bg-gradient-to-r from-accent to-accent-dim px-8 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Run an Audit →
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            {audits.map((audit) => (
              <a
                key={audit.id}
                href={`/audit/${audit.id}`}
                className="flex items-center gap-4 rounded-xl border border-border/50 bg-surface/30 p-4 hover:bg-surface/60 hover:border-border transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-accent-bright transition-colors">
                    {audit.url}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {new Date(audit.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    <span className="mx-1.5">·</span>
                    <span className="capitalize">{audit.audit_type} audit</span>
                    <span className="mx-1.5">·</span>
                    <span className="capitalize">{audit.status}</span>
                  </p>
                </div>
                {audit.overall_score !== null && (
                  <div
                    className={`text-xl font-bold ${scoreColor(audit.overall_score)}`}
                  >
                    {audit.overall_score}
                  </div>
                )}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="text-muted shrink-0"
                >
                  <path
                    d="M6 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
