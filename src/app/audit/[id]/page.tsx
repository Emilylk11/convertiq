import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { AuditRecord } from "@/lib/types";
import AuditReportGated from "@/components/AuditReportGated";
import AuditReportPolling from "./AuditReportPolling";
import MobileNav from "@/components/MobileNav";
import ThemeToggle from "@/components/ThemeToggle";

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
          <div className="hidden sm:flex items-center gap-8 text-sm text-muted">
            <a href="/#how-it-works" className="hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="/examples" className="hover:text-foreground transition-colors">
              Examples
            </a>
            <a href="/pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {record.status === "completed" && (
              <a
                href={`/api/audit/${record.id}/pdf`}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-surface px-4 py-1.5 text-sm text-muted hover:text-foreground hover:border-border transition-all"
                download
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
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
                PDF
              </a>
            )}
            <a
              href="/pricing"
              className="rounded-full bg-accent px-4 sm:px-5 py-2 text-sm font-medium text-white hover:bg-accent-bright transition-colors"
            >
              Sign Up Now
            </a>
            <MobileNav />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-12">
        {record.status === "completed" && record.results ? (
          <AuditReportGated
            results={record.results}
            url={record.url}
            auditId={record.id}
          />
        ) : record.status === "failed" ? (
          <div className="text-center py-16 sm:py-20">
            <div className="text-4xl mb-4">❌</div>
            <h1 className="text-xl sm:text-2xl font-bold mb-2">Audit failed</h1>
            <p className="text-muted mb-6 max-w-sm mx-auto text-sm sm:text-base">
              {record.error_message || "Something went wrong during the audit."}
            </p>
            <a
              href="/#free-audit"
              className="inline-block rounded-xl bg-gradient-to-r from-accent to-accent-dim px-8 py-3.5 text-base font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Try Again
            </a>
          </div>
        ) : (
          <AuditReportPolling auditId={record.id} />
        )}
      </main>
    </div>
  );
}
