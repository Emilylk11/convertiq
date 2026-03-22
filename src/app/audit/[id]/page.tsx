import { createAdminClient, createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { AuditRecord } from "@/lib/types";
import { getUserTier, canExportPdf, canReaudit, type UserTier } from "@/lib/tiers";
import { getCreditBalance } from "@/lib/credits";
import AuditReportGated from "@/components/AuditReportGated";
import AuditReportPolling from "./AuditReportPolling";
import MobileNav from "@/components/MobileNav";
import DashboardMobileNav from "@/components/DashboardMobileNav";
import ThemeToggle from "@/components/ThemeToggle";
import SignOutButton from "@/components/SignOutButton";
import SupportButton from "@/components/SupportButton";
import FeedbackPrompt from "@/components/FeedbackPrompt";

export default async function AuditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createAdminClient();
  const { data: audit } = await supabase
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (!audit) {
    notFound();
  }

  const record = audit as AuditRecord;

  // Determine user tier and auth state for feature gating
  let userTier: UserTier = "free";
  let isLoggedIn = false;
  let userEmail = "";
  let balance = 0;

  try {
    const authClient = await createClient();
    const { data: { user } } = await authClient.auth.getUser();
    if (user) {
      isLoggedIn = true;
      userEmail = user.email || "";
      const [tier, bal] = await Promise.all([
        getUserTier(user.id),
        getCreditBalance(user.id).catch(() => 0),
      ]);
      userTier = tier;
      balance = bal;
    }
  } catch {
    // Not logged in — stays free
  }

  const showPdf = canExportPdf(userTier);

  return (
    <div className="min-h-full bg-background text-foreground">
      {/* Nav — logged-in vs logged-out */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-4 sm:px-6 h-16">
          <a href={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center font-mono text-sm font-bold text-white shrink-0">
              C
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Convert<span className="text-accent-bright">IQ</span>
            </span>
          </a>

          {isLoggedIn ? (
            <>
              <div className="hidden sm:flex items-center gap-6 text-sm text-muted">
                <a href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</a>
                <a href="/dashboard/new-audit" className="hover:text-foreground transition-colors">Run Audit</a>
                <a href="/pricing" className="hover:text-foreground transition-colors">Buy Credits</a>
                {(userTier === "growth" || userTier === "agency") && (
                  <a href="/dashboard/competitors" className="hover:text-foreground transition-colors">Competitors</a>
                )}
                {userTier === "agency" && (
                  <a href="/dashboard/bulk-audit" className="hover:text-foreground transition-colors">Bulk Audit</a>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-xs font-medium text-accent-bright">
                  {balance} credit{balance !== 1 ? "s" : ""}
                </span>
                <ThemeToggle />
                {record.status === "completed" && showPdf && (
                  <a
                    href={`/api/audit/${record.id}/pdf`}
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-surface px-4 py-1.5 text-sm text-muted hover:text-foreground hover:border-border transition-all"
                    download
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    PDF
                  </a>
                )}
                <span className="hidden sm:inline text-xs text-muted truncate max-w-[120px]" title={userEmail}>
                  {userEmail}
                </span>
                <SignOutButton />
                <DashboardMobileNav tier={userTier} />
              </div>
            </>
          ) : (
            <>
              <div className="hidden sm:flex items-center gap-8 text-sm text-muted">
                <a href="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
                <a href="/examples" className="hover:text-foreground transition-colors">Examples</a>
                <a href="/pricing" className="hover:text-foreground transition-colors">Pricing</a>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                {record.status === "completed" && !showPdf && (
                  <a
                    href="/pricing"
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-surface px-4 py-1.5 text-sm text-muted hover:text-foreground hover:border-border transition-all"
                    title="Upgrade to unlock PDF export"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <rect x="5" y="1" width="6" height="9" rx="3" stroke="currentColor" strokeWidth="1.5" />
                      <rect x="3" y="7" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    PDF
                  </a>
                )}
                <a
                  href="/login"
                  className="rounded-full bg-accent px-4 sm:px-5 py-2 text-sm font-medium text-white hover:bg-accent-bright transition-colors"
                >
                  Sign In
                </a>
                <MobileNav />
              </div>
            </>
          )}
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-12">
        {record.status === "completed" && record.results ? (
          <AuditReportGated
            results={record.results}
            url={record.url}
            auditId={record.id}
            userTier={userTier}
          />
        ) : record.status === "failed" ? (
          <div className="text-center py-16 sm:py-20">
            <div className="text-4xl mb-4">&#10060;</div>
            <h1 className="text-xl sm:text-2xl font-bold mb-2">Audit failed</h1>
            <p className="text-muted mb-6 max-w-sm mx-auto text-sm sm:text-base">
              {record.error_message || "Something went wrong during the audit."}
            </p>
            <a
              href={isLoggedIn ? "/dashboard/new-audit" : "/#free-audit"}
              className="inline-block rounded-xl bg-gradient-to-r from-accent to-accent-dim px-8 py-3.5 text-base font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Try Again
            </a>
          </div>
        ) : (
          <AuditReportPolling auditId={record.id} />
        )}
      </main>

      {/* Floating support button */}
      <SupportButton />

      {/* Feedback prompt — appears 3s after page load */}
      <FeedbackPrompt auditId={id} />
    </div>
  );
}
