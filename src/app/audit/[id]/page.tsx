import { createAdminClient, createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { AuditRecord } from "@/lib/types";
import { getUserTier, canExportPdf, canReaudit, type UserTier } from "@/lib/tiers";
import { getCreditBalance } from "@/lib/credits";
import AuditReportGated from "@/components/AuditReportGated";
import AuditReportPolling from "./AuditReportPolling";
import MobileNav from "@/components/MobileNav";
import DashboardNav from "@/components/DashboardNav";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
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

  // Detect stuck audits — if "processing" for more than 5 minutes, mark as failed
  if (record.status === "processing") {
    const createdAt = new Date(record.created_at).getTime();
    const now = Date.now();
    const STUCK_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes
    if (now - createdAt > STUCK_THRESHOLD_MS) {
      await supabase
        .from("audits")
        .update({
          status: "failed",
          error_message: "Audit timed out. The pages may be too large or slow to respond. Please try again with fewer stages.",
        })
        .eq("id", id);
      record.status = "failed";
      record.error_message = "Audit timed out. The pages may be too large or slow to respond. Please try again with fewer stages.";
    }
  }

  // Check if audit has expired
  if (record.expires_at && new Date(record.expires_at) < new Date()) {
    return (
      <div className="min-h-full bg-background text-foreground flex items-center justify-center">
        <div className="text-center px-4 py-20">
          <div className="text-4xl mb-4">&#8987;</div>
          <h1 className="text-xl sm:text-2xl font-bold mb-2">This audit has expired</h1>
          <p className="text-muted mb-6 max-w-sm mx-auto text-sm sm:text-base">
            Audits are stored for 90 days. Run a new audit to get fresh results.
          </p>
          <a
            href="/dashboard/new-audit"
            className="inline-block rounded-xl bg-gradient-to-r from-accent to-accent-dim px-8 py-3.5 text-base font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Run a New Audit
          </a>
        </div>
      </div>
    );
  }

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
      {isLoggedIn ? (
        <DashboardNav tier={userTier} balance={balance} email={userEmail} />
      ) : (
        <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
          <div className="mx-auto max-w-4xl flex items-center justify-between px-4 sm:px-6 h-16">
            <Logo href="/" />
            <div className="hidden sm:flex items-center gap-8 text-sm text-muted">
              <a href="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
              <a href="/examples" className="hover:text-foreground transition-colors">Examples</a>
              <a href="/pricing" className="hover:text-foreground transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <a
                href="/login"
                className="rounded-full bg-accent px-4 sm:px-5 py-2 text-sm font-medium text-white hover:bg-accent-bright transition-colors"
              >
                Sign In
              </a>
              <MobileNav />
            </div>
          </div>
        </nav>
      )}

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-12">
        {record.status === "completed" && record.results ? (
          <AuditReportGated
            results={record.results}
            url={record.url}
            auditId={record.id}
            userTier={userTier}
          />
        ) : record.status === "failed" ? (
          <AuditFailedState
            errorMessage={record.error_message}
            isLoggedIn={isLoggedIn}
          />
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

function AuditFailedState({
  errorMessage,
  isLoggedIn,
}: {
  errorMessage: string | null;
  isLoggedIn: boolean;
}) {
  const msg = errorMessage?.toLowerCase() || "";

  let icon = "❌";
  let title = "Audit failed";
  let description =
    errorMessage || "Something went wrong during the audit.";
  let suggestion = "";

  if (msg.includes("timeout") || msg.includes("timed out")) {
    icon = "⏱️";
    title = "Page took too long to respond";
    description =
      "The page didn't load within 60 seconds. This usually means the server is slow or the page is very large.";
    suggestion = "Try again during off-peak hours, or audit a different page on the site.";
  } else if (
    msg.includes("unreachable") ||
    msg.includes("enotfound") ||
    msg.includes("dns") ||
    msg.includes("could not resolve")
  ) {
    icon = "🌐";
    title = "Page not reachable";
    description =
      "We couldn't connect to this URL. The domain may be misspelled, offline, or blocking requests.";
    suggestion = "Double-check the URL and make sure the site is publicly accessible.";
  } else if (
    msg.includes("blocked") ||
    msg.includes("403") ||
    msg.includes("captcha") ||
    msg.includes("bot")
  ) {
    icon = "🛡️";
    title = "Site blocked our scraper";
    description =
      "This site has bot protection that prevented us from reading the page content.";
    suggestion =
      "Try a text-based audit instead — paste the page content directly into an Email or Ad Copy audit.";
  } else if (msg.includes("not found") || msg.includes("404")) {
    icon = "🔍";
    title = "Page not found (404)";
    description =
      "The URL returned a 404 error. The page may have been moved or deleted.";
    suggestion = "Check the URL and try again with the correct page address.";
  } else if (msg.includes("rate limit") || msg.includes("too many")) {
    icon = "🚦";
    title = "Rate limit reached";
    description =
      "Too many audit requests in a short time. Please wait a moment.";
    suggestion = "Wait a minute and try again.";
  }

  return (
    <div className="text-center py-16 sm:py-20">
      <div className="text-4xl mb-4">{icon}</div>
      <h1 className="text-xl sm:text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted mb-2 max-w-md mx-auto text-sm sm:text-base">
        {description}
      </p>
      {suggestion && (
        <p className="text-xs text-muted/70 mb-6 max-w-sm mx-auto">
          💡 {suggestion}
        </p>
      )}
      <a
        href={isLoggedIn ? "/dashboard/new-audit" : "/#free-audit"}
        className="inline-block rounded-xl bg-gradient-to-r from-accent to-accent-dim px-8 py-3.5 text-base font-semibold text-white hover:opacity-90 transition-opacity"
      >
        Try Again
      </a>
    </div>
  );
}
