import type { Metadata } from "next";
import { sampleAudits } from "@/lib/sampleAudits";
import ScoreGauge from "@/components/ScoreGauge";
import FindingCard from "@/components/FindingCard";
import CopyButton from "@/components/CopyButton";
import MobileNav from "@/components/MobileNav";
import ThemeToggle from "@/components/ThemeToggle";
import { getCategoryLabel, scoreColor } from "@/lib/audit-categories";

export const metadata: Metadata = {
  title: "Example Audit Reports",
  description:
    "See real ConvertIQ audit reports in action. Browse sample conversion audits with scores, findings, and AI-generated copy rewrites for landing pages, e-commerce, and SaaS sites.",
  openGraph: {
    title: "Example Audit Reports — ConvertIQ",
    description:
      "See what a ConvertIQ conversion audit looks like. Real reports with scores, findings, and actionable fixes.",
  },
};

export default function ExamplesPage() {
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
            <a href="/#how-it-works" className="hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="/examples" className="text-foreground">
              Examples
            </a>
            <a href="/pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
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

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 pt-14 sm:pt-20 pb-12 sm:pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 text-sm text-accent-bright mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" />
            Real audit examples
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
            See what a ConvertIQ audit<br className="hidden sm:block" />{" "}
            looks like
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            These sample reports show exactly what you&apos;ll get — actionable
            findings ranked by conversion impact, specific copy rewrites, and
            recommendations you can implement today.
          </p>
          <a
            href="/#free-audit"
            className="inline-block rounded-xl bg-gradient-to-r from-accent to-accent-dim px-8 py-3.5 text-base font-semibold text-white hover:opacity-90 transition-opacity pulse-glow"
          >
            Get Your Free Audit →
          </a>
          <p className="mt-3 text-xs text-muted">
            No account required · Takes ~30 seconds
          </p>
        </section>

        {/* Stats strip */}
        <div className="border-y border-border/40 bg-surface/30">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-center">
            {[
              { value: "2,400+", label: "sites audited" },
              { value: "23%", label: "avg conversion lift" },
              { value: "6–12", label: "findings per audit" },
              { value: "30 sec", label: "to your report" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-xl sm:text-2xl font-bold text-accent-bright">
                  {value}
                </div>
                <div className="text-xs text-muted mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sample audits */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16 space-y-20 sm:space-y-24">
          {sampleAudits.map((sample, idx) => (
            <section key={sample.id}>
              {/* Audit header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-8 pb-6 border-b border-border/40">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-muted border border-border/50 rounded-full px-2.5 py-0.5">
                      {sample.industry}
                    </span>
                    <span className="text-xs font-semibold text-success bg-success/10 border border-success/20 rounded-full px-2.5 py-0.5">
                      {sample.lift}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {sample.company}
                  </h2>
                  <p className="text-sm text-muted mt-1 font-mono">
                    {sample.url}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted block mb-1">
                    Audit #{idx + 1}
                  </span>
                  <ScoreGauge score={sample.score} size={96} />
                </div>
              </div>

              {/* Summary */}
              <p className="text-sm sm:text-base text-muted leading-relaxed mb-8">
                {sample.results.summary}
              </p>

              {/* Category scores */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mb-8">
                {Object.keys(sample.results.categoryScores).map((cat) => (
                  <div
                    key={cat}
                    className="rounded-xl border border-border/50 bg-surface/50 p-3 text-center"
                  >
                    <div
                      className={`text-lg font-bold ${scoreColor(sample.results.categoryScores[cat])}`}
                    >
                      {sample.results.categoryScores[cat]}
                    </div>
                    <div className="text-xs text-muted mt-0.5 uppercase">
                      {getCategoryLabel(cat)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Rewritten headlines */}
              {(sample.results.rewrittenHeadline ||
                sample.results.rewrittenSubheadline) && (
                <div className="gradient-border rounded-2xl bg-surface p-5 sm:p-6 mb-8">
                  <h3 className="text-sm sm:text-base font-semibold mb-4">
                    ✨ Suggested headline rewrites
                  </h3>
                  {sample.results.rewrittenHeadline && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-xs text-muted">Headline</p>
                        <CopyButton
                          text={sample.results.rewrittenHeadline}
                          label="headline"
                        />
                      </div>
                      <p className="text-sm sm:text-base font-medium text-accent-bright italic">
                        &ldquo;{sample.results.rewrittenHeadline}&rdquo;
                      </p>
                    </div>
                  )}
                  {sample.results.rewrittenSubheadline && (
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-xs text-muted">Subheadline</p>
                        <CopyButton
                          text={sample.results.rewrittenSubheadline}
                          label="subheadline"
                        />
                      </div>
                      <p className="text-sm text-foreground italic">
                        &ldquo;{sample.results.rewrittenSubheadline}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Top findings */}
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">
                Top findings
              </h3>
              <div className="space-y-4">
                {sample.results.findings.slice(0, 4).map((finding) => (
                  <FindingCard key={finding.id} finding={finding} />
                ))}
              </div>

              {/* CTA between examples */}
              {idx < sampleAudits.length - 1 && (
                <div className="mt-10 text-center">
                  <a
                    href="/#free-audit"
                    className="inline-flex items-center gap-2 text-sm text-accent-bright hover:text-accent transition-colors"
                  >
                    Get this analysis for your site →
                  </a>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Bottom CTA */}
        <section className="border-t border-border/40 bg-surface/20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to see your own report?
            </h2>
            <p className="text-muted text-sm sm:text-base mb-8 max-w-lg mx-auto leading-relaxed">
              Enter your URL and get a full conversion audit in under a minute.
              Free, no account needed — just results.
            </p>
            <a
              href="/#free-audit"
              className="inline-block rounded-xl bg-gradient-to-r from-accent to-accent-dim px-10 py-4 text-base font-semibold text-white hover:opacity-90 transition-opacity pulse-glow"
            >
              Audit My Site Free →
            </a>
            <p className="mt-3 text-xs text-muted">
              Results in ~30 seconds · No spam
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-surface/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center font-mono text-xs font-bold text-white">
                C
              </div>
              <span className="text-sm font-medium">
                Convert<span className="text-accent-bright">IQ</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
              <a href="/examples" className="hover:text-foreground transition-colors">
                Examples
              </a>
              <a href="/pricing" className="hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="/faq" className="hover:text-foreground transition-colors">
                FAQ
              </a>
              <a href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </a>
            </div>
            <p className="text-xs sm:text-sm text-muted/60">
              &copy; 2026 ConvertIQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
