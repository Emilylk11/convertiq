import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { AuditRecord } from "@/lib/types";
import AuditReport from "@/components/AuditReport";

export default async function SharedReportPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const supabase = createAdminClient();
  const { data: audit } = await supabase
    .from("audits")
    .select("*")
    .eq("share_token", token)
    .single();

  if (!audit) {
    notFound();
  }

  const record = audit as AuditRecord;

  // Check if report has expired
  const isExpired =
    record.expires_at && new Date(record.expires_at) < new Date();

  return (
    <div className="min-h-full bg-background text-foreground">
      {/* Nav */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-4 sm:px-6 h-16">
          <a href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center font-mono text-sm font-bold text-white shrink-0">
              C
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Convert<span className="text-accent-bright">IQ</span>
            </span>
          </a>
          <a
            href="/login"
            className="rounded-full bg-accent px-4 sm:px-5 py-2 text-sm font-medium text-white hover:bg-accent-bright transition-colors"
          >
            Sign In
          </a>
        </div>
      </nav>

      {/* Shared report banner */}
      <div className="border-b border-border/30 bg-accent/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-2.5 flex items-center gap-2 text-xs text-muted">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
            <path
              d="M9 2H3a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V3a1 1 0 00-1-1z"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M4 6h4M6 4v4"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          <span>Shared read-only report · Reports are saved for 90 days</span>
          <span className="ml-auto hidden sm:block">
            Want your own audit?{" "}
            <a href="/#free-audit" className="text-accent-bright hover:underline">
              Try it free →
            </a>
          </span>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-12">
        {isExpired ? (
          <div className="text-center py-16 sm:py-20">
            <div className="text-4xl mb-4">⌛</div>
            <h1 className="text-xl sm:text-2xl font-bold mb-2">
              This report has expired
            </h1>
            <p className="text-muted mb-6 max-w-sm mx-auto text-sm sm:text-base">
              Reports are stored for 90 days. This one is no longer available.
            </p>
            <a
              href="/#free-audit"
              className="inline-block rounded-xl bg-gradient-to-r from-accent to-accent-dim px-8 py-3.5 text-base font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Run a New Audit
            </a>
          </div>
        ) : record.status === "completed" && record.results ? (
          <AuditReport
            results={record.results}
            url={record.url}
            auditId={record.id}
            isSharedView={true}
          />
        ) : (
          <div className="text-center py-16 sm:py-20">
            <div className="text-4xl mb-4">🔍</div>
            <h1 className="text-xl sm:text-2xl font-bold mb-2">
              Report not available
            </h1>
            <p className="text-muted mb-6 max-w-sm mx-auto text-sm">
              This report is still processing or could not be completed.
            </p>
            <a
              href="/#free-audit"
              className="inline-block rounded-xl bg-gradient-to-r from-accent to-accent-dim px-8 py-3.5 text-base font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Run Your Own Audit
            </a>
          </div>
        )}

        {/* CTA for shared view */}
        {!isExpired && record.status === "completed" && (
          <div className="mt-12 rounded-2xl border border-accent/20 bg-accent/5 p-6 sm:p-8 text-center">
            <h2 className="text-lg sm:text-xl font-bold mb-2">
              Want a free audit for your site?
            </h2>
            <p className="text-muted text-sm mb-5 max-w-md mx-auto">
              ConvertIQ analyzes your landing page with AI and gives you
              actionable recommendations to improve conversions.
            </p>
            <a
              href="/#free-audit"
              className="inline-block rounded-xl bg-gradient-to-r from-accent to-accent-dim px-8 py-3.5 text-base font-semibold text-white hover:opacity-90 transition-opacity pulse-glow"
            >
              Get My Free Audit →
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
