import type { Metadata } from "next";
import ThemeToggle from "@/components/ThemeToggle";
import MobileNav from "@/components/MobileNav";

export const metadata: Metadata = {
  title: "Case Studies — Real Results from ConvertIQ Audits",
  description:
    "See how businesses use ConvertIQ to find and fix conversion issues on their landing pages — with real before/after results.",
};

// Case studies will be added as users provide testimonials
const CASE_STUDIES = [
  {
    id: "sample",
    company: "Your Story Here",
    industry: "Any Industry",
    challenge: "Every business has landing pages that could convert better. The question is: where are the leaks?",
    result: "ConvertIQ customers typically see 15-30% conversion improvements after implementing their top 3 findings.",
    scoreChange: { before: null, after: null },
    quote: null,
    isSample: true,
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-full bg-background text-foreground">
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 sm:px-6 h-16">
          <a href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center font-mono text-sm font-bold text-white shrink-0">
              C
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Convert<span className="text-accent-bright">IQ</span>
            </span>
          </a>
          <div className="hidden sm:flex items-center gap-8 text-sm text-muted">
            <a href="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="/pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="/blog" className="hover:text-foreground transition-colors">Blog</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a href="/login" className="rounded-full bg-accent px-4 sm:px-5 py-2 text-sm font-medium text-white hover:bg-accent-bright transition-colors">
              Sign In
            </a>
            <MobileNav />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-14 sm:py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Real Results from{" "}
            <span className="bg-gradient-to-r from-accent-bright to-accent bg-clip-text text-transparent">
              Real Audits
            </span>
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-xl mx-auto">
            See how businesses use ConvertIQ to find conversion leaks and fix them — with measurable results.
          </p>
        </div>

        {/* Case study template structure */}
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-8 sm:p-10 mb-10">
          <div className="text-center mb-8">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-bright bg-accent/10 border border-accent/20 rounded-full px-3 py-1">
              Case Study Template
            </span>
            <h2 className="text-2xl font-bold mt-4 mb-2">
              How [Company] Increased Conversions by [X]% with ConvertIQ
            </h2>
            <p className="text-sm text-muted max-w-lg mx-auto">
              This is the framework we use for every case study. Want to be featured? Run an audit, implement the findings, and share your results.
            </p>
          </div>

          {/* Template sections */}
          <div className="space-y-6">
            {/* The Challenge */}
            <div className="rounded-xl border border-border/50 bg-background/50 p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xs font-bold text-red-400">1</span>
                <h3 className="text-sm font-semibold">The Challenge</h3>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                What was the business struggling with? Low conversion rates, high bounce rates, unclear messaging, poor mobile experience? What was the financial impact — how much revenue was being left on the table?
              </p>
            </div>

            {/* The Audit */}
            <div className="rounded-xl border border-border/50 bg-background/50 p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-400">2</span>
                <h3 className="text-sm font-semibold">The ConvertIQ Audit</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-lg bg-surface/50 border border-border/30 p-4 text-center">
                  <p className="text-xs text-muted uppercase tracking-wider mb-1">Before Score</p>
                  <p className="text-3xl font-bold text-red-400">42<span className="text-base text-muted">/100</span></p>
                </div>
                <div className="rounded-lg bg-surface/50 border border-border/30 p-4 text-center">
                  <p className="text-xs text-muted uppercase tracking-wider mb-1">After Score</p>
                  <p className="text-3xl font-bold text-green-400">78<span className="text-base text-muted">/100</span></p>
                </div>
              </div>
              <p className="text-xs text-muted leading-relaxed mt-3">
                What did ConvertIQ find? List the top 3-5 critical findings — weak headline, buried CTA, missing trust signals, slow load time, poor mobile layout, etc.
              </p>
            </div>

            {/* The Fixes */}
            <div className="rounded-xl border border-border/50 bg-background/50 p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">3</span>
                <h3 className="text-sm font-semibold">What They Changed</h3>
              </div>
              <div className="space-y-2 text-xs text-muted">
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span><strong className="text-foreground">Rewrote the headline</strong> using ConvertIQ&apos;s PAS framework rewrite — went from &ldquo;Welcome to Our Platform&rdquo; to &ldquo;Stop Losing $5K/Month to a Landing Page That Doesn&apos;t Convert&rdquo;</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span><strong className="text-foreground">Moved the CTA above the fold</strong> and changed button text from &ldquo;Submit&rdquo; to &ldquo;Get My Free Report&rdquo;</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span><strong className="text-foreground">Added 3 trust signals</strong> — customer count, security badge, and a testimonial with a real name and photo</span>
                </div>
              </div>
            </div>

            {/* The Results */}
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-xs font-bold text-green-400">4</span>
                <h3 className="text-sm font-semibold text-green-400">The Results</h3>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <div className="rounded-lg bg-background/50 border border-border/30 p-4 text-center">
                  <p className="text-2xl font-bold text-green-400">+36</p>
                  <p className="text-[10px] text-muted uppercase tracking-wider">Score increase</p>
                </div>
                <div className="rounded-lg bg-background/50 border border-border/30 p-4 text-center">
                  <p className="text-2xl font-bold text-green-400">+2.1%</p>
                  <p className="text-[10px] text-muted uppercase tracking-wider">Conversion lift</p>
                </div>
                <div className="rounded-lg bg-background/50 border border-border/30 p-4 text-center">
                  <p className="text-2xl font-bold text-green-400">+$8,400</p>
                  <p className="text-[10px] text-muted uppercase tracking-wider">Monthly revenue</p>
                </div>
              </div>
            </div>

            {/* The Quote */}
            <div className="rounded-xl border border-border/50 bg-background/50 p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-400">5</span>
                <h3 className="text-sm font-semibold">Customer Quote</h3>
              </div>
              <blockquote className="border-l-2 border-accent/30 pl-4 italic text-sm text-muted leading-relaxed">
                &ldquo;ConvertIQ found three issues on our landing page that we&apos;d been ignoring for months. We implemented the copy rewrites and moved our CTA — conversions went up 2.1% in the first week. That&apos;s an extra $8,400/month from a $3.80 audit.&rdquo;
              </blockquote>
              <p className="text-xs text-muted mt-2">— Name, Title at Company</p>
            </div>
          </div>
        </div>

        {/* CTA to become a case study */}
        <div className="text-center">
          <div className="rounded-2xl border border-border/50 bg-surface/30 p-8">
            <h2 className="text-xl font-bold mb-2">Want to be our next case study?</h2>
            <p className="text-sm text-muted mb-5 max-w-md mx-auto">
              Run an audit, implement the top findings, re-audit to track your improvement, and we&apos;ll feature your results here. Email us at{" "}
              <a href="mailto:support@convertiq.io" className="text-accent-bright hover:underline">
                support@convertiq.io
              </a>{" "}
              with your before/after scores.
            </p>
            <a
              href="/#free-audit"
              className="inline-block rounded-full bg-gradient-to-r from-accent to-accent-dim px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Start Your Audit
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
