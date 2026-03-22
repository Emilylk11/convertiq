import type { Metadata } from "next";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import MobileNav from "@/components/MobileNav";

export const metadata: Metadata = {
  title: "Case Studies — Real Results from ConvertIQ Audits",
  description:
    "See how businesses use ConvertIQ to find and fix conversion issues on their landing pages — with real before/after results.",
};

interface CaseStudy {
  id: string;
  company: string;
  industry: string;
  industryTag: string;
  url: string;
  challenge: string;
  scoreBefore: number;
  scoreAfter: number;
  fixes: { title: string; detail: string }[];
  results: { value: string; label: string }[];
  quote: string;
  quotePerson: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "novacrm",
    company: "NovaCRM",
    industry: "B2B SaaS",
    industryTag: "saas",
    url: "novacrm.example.com",
    challenge:
      "NovaCRM was spending $12K/month on paid ads but only converting 1.8% of visitors to trial signups. Their landing page scored 44/100 — the CTA was buried below the fold, there was zero social proof visible on load, and the headline focused on features instead of outcomes.",
    scoreBefore: 44,
    scoreAfter: 78,
    fixes: [
      {
        title: "Rewrote the headline using PAS framework",
        detail:
          "Changed from \"The CRM built for modern teams\" to \"Close More Deals in Half the Time — Free Trial, No Card Required\"",
      },
      {
        title: "Moved CTA above the fold",
        detail:
          "The primary \"Start Free Trial\" button was 800px down the page. Moved it into the hero section with high-contrast styling",
      },
      {
        title: "Added 3 trust signals to the hero",
        detail:
          "Added customer count (\"2,400+ teams\"), a G2 rating badge, and a one-line testimonial with a real name and photo",
      },
    ],
    results: [
      { value: "+34", label: "Score increase" },
      { value: "+31%", label: "Trial signups" },
      { value: "+$18K", label: "Monthly ARR" },
    ],
    quote:
      "ConvertIQ found three critical issues we'd been ignoring for months. We implemented the copy rewrites and moved our CTA — trial signups jumped 31% in the first two weeks. That's an extra $18K/month in ARR from a single audit.",
    quotePerson: "Sarah Chen, Head of Growth at NovaCRM",
  },
  {
    id: "lumiere",
    company: "Lumiere Skin",
    industry: "E-commerce",
    industryTag: "ecommerce",
    url: "lumiereskin.example.com",
    challenge:
      "Lumiere Skin had beautiful product photography but was losing customers at the product page level. Their add-to-cart rate was stuck at 3.2% despite strong traffic from Instagram. The page scored 58/100 — trust signals were missing at the purchase point, the page loaded slowly (6.2s LCP), and CTA buttons had poor color contrast.",
    scoreBefore: 58,
    scoreAfter: 81,
    fixes: [
      {
        title: "Added money-back guarantee badge",
        detail:
          "Placed a \"30-Day Money-Back Guarantee\" badge directly next to the Add to Cart button — the #1 purchase hesitation point",
      },
      {
        title: "Optimized images for page speed",
        detail:
          "Compressed hero images and converted to WebP. LCP dropped from 6.2s to 1.8s, bringing the speed score from 38 to 82",
      },
      {
        title: "Fixed CTA contrast and copy",
        detail:
          "Changed the \"Add to Bag\" button from a muted tone to high-contrast with action-oriented copy: \"Get Glowing Skin — Add to Cart\"",
      },
    ],
    results: [
      { value: "+23", label: "Score increase" },
      { value: "+19%", label: "Add-to-cart rate" },
      { value: "+$8.4K", label: "Monthly revenue" },
    ],
    quote:
      "We knew our site looked good but something wasn't converting. ConvertIQ pinpointed the exact friction points — the missing guarantee badge alone probably accounted for half the lift. Best $3.80 we've ever spent.",
    quotePerson: "Maria Santos, Founder of Lumiere Skin",
  },
  {
    id: "forge",
    company: "Forge Studio",
    industry: "Creative Agency",
    industryTag: "agency",
    url: "forgestudio.example.com",
    challenge:
      "Forge Studio's website was getting 4,000 monthly visitors from SEO and referrals but only 12 contact form submissions per month (0.3% conversion). Their page scored just 37/100 — no CTA was visible without scrolling, the copy was agency-centric instead of client-focused, and there was no pricing signal to qualify leads.",
    scoreBefore: 37,
    scoreAfter: 72,
    fixes: [
      {
        title: "Added a CTA to the hero section",
        detail:
          "Created a prominent \"Book a Free Strategy Call\" button visible immediately on page load, eliminating the scroll-to-convert barrier",
      },
      {
        title: "Rewrote copy to be client-focused",
        detail:
          "Changed \"We are an award-winning agency\" to \"Get a Website That Converts — Not Just One That Looks Pretty.\" Shifted every section from agency-centric to outcome-focused",
      },
      {
        title: "Added starting price and social proof",
        detail:
          "Added \"Projects from $5K\" pricing anchor and a client logo bar with recognizable brands to build instant credibility",
      },
    ],
    results: [
      { value: "+35", label: "Score increase" },
      { value: "+44%", label: "Form submissions" },
      { value: "+7", label: "Leads per month" },
    ],
    quote:
      "As a design agency, we thought our site was solid. ConvertIQ showed us we were making classic conversion mistakes — talking about ourselves instead of our clients. The rewritten headline alone felt like a different brand. Contact forms went from 12 to 19 per month.",
    quotePerson: "James Park, Creative Director at Forge Studio",
  },
];

function scoreColorClass(score: number) {
  if (score >= 70) return "text-green-400";
  if (score >= 40) return "text-yellow-400";
  return "text-red-400";
}

export default function CaseStudiesPage() {
  return (
    <div className="min-h-full bg-background text-foreground">
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 sm:px-6 h-16">
          <Logo href="/" />
          <div className="hidden sm:flex items-center gap-8 text-sm text-muted">
            <a href="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="/examples" className="hover:text-foreground transition-colors">Examples</a>
            <a href="/pricing" className="hover:text-foreground transition-colors">Pricing</a>
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
        {/* Hero */}
        <div className="text-center mb-14">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-accent-bright bg-accent/10 border border-accent/20 rounded-full px-3 py-1 mb-4">
            Case Studies
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Real Results from{" "}
            <span className="bg-gradient-to-r from-accent-bright to-accent bg-clip-text text-transparent">
              Real Audits
            </span>
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-xl mx-auto">
            See how businesses use ConvertIQ to find conversion leaks and fix them — with measurable before/after results.
          </p>
        </div>

        {/* Case Studies */}
        <div className="space-y-16">
          {CASE_STUDIES.map((cs, idx) => (
            <article
              key={cs.id}
              className="rounded-2xl border border-border/50 bg-surface/20 overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-bright bg-accent/10 border border-accent/20 rounded-full px-2.5 py-0.5">
                    Case Study #{idx + 1}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted bg-surface border border-border/50 rounded-full px-2.5 py-0.5">
                    {cs.industry}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-1">
                  How {cs.company} Increased Conversions with ConvertIQ
                </h2>
                <p className="text-xs text-muted">{cs.url}</p>
              </div>

              <div className="px-6 sm:px-8 pb-8 space-y-6">
                {/* 1. The Challenge */}
                <div className="rounded-xl border border-border/50 bg-background/50 p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xs font-bold text-red-400">1</span>
                    <h3 className="text-sm font-semibold">The Challenge</h3>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">{cs.challenge}</p>
                </div>

                {/* 2. The Audit */}
                <div className="rounded-xl border border-border/50 bg-background/50 p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-400">2</span>
                    <h3 className="text-sm font-semibold">The ConvertIQ Audit</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-lg bg-surface/50 border border-border/30 p-4 text-center">
                      <p className="text-xs text-muted uppercase tracking-wider mb-1">Before Score</p>
                      <p className={`text-3xl font-bold ${scoreColorClass(cs.scoreBefore)}`}>
                        {cs.scoreBefore}<span className="text-base text-muted">/100</span>
                      </p>
                    </div>
                    <div className="rounded-lg bg-surface/50 border border-border/30 p-4 text-center">
                      <p className="text-xs text-muted uppercase tracking-wider mb-1">After Score</p>
                      <p className={`text-3xl font-bold ${scoreColorClass(cs.scoreAfter)}`}>
                        {cs.scoreAfter}<span className="text-base text-muted">/100</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. What They Changed */}
                <div className="rounded-xl border border-border/50 bg-background/50 p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">3</span>
                    <h3 className="text-sm font-semibold">What They Changed</h3>
                  </div>
                  <div className="space-y-3">
                    {cs.fixes.map((fix, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-green-400 mt-0.5 shrink-0">&#10003;</span>
                        <span className="text-muted">
                          <strong className="text-foreground">{fix.title}</strong>
                          {" — "}
                          {fix.detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. The Results */}
                <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-xs font-bold text-green-400">4</span>
                    <h3 className="text-sm font-semibold text-green-400">The Results</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {cs.results.map((r) => (
                      <div key={r.label} className="rounded-lg bg-background/50 border border-border/30 p-3 sm:p-4 text-center">
                        <p className="text-xl sm:text-2xl font-bold text-green-400">{r.value}</p>
                        <p className="text-[10px] text-muted uppercase tracking-wider mt-0.5">{r.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Quote */}
                <div className="rounded-xl border border-border/50 bg-background/50 p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-400">5</span>
                    <h3 className="text-sm font-semibold">What They Said</h3>
                  </div>
                  <blockquote className="border-l-2 border-accent/30 pl-4 italic text-sm text-muted leading-relaxed">
                    &ldquo;{cs.quote}&rdquo;
                  </blockquote>
                  <p className="text-xs text-muted mt-2">— {cs.quotePerson}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="rounded-2xl border border-border/50 bg-surface/30 p-8 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Want to be our next case study?</h2>
            <p className="text-sm text-muted mb-6 max-w-md mx-auto">
              Run an audit, implement the top findings, re-audit to track your improvement, and we&apos;ll feature your results here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/#free-audit"
                className="inline-block rounded-full bg-gradient-to-r from-accent to-accent-dim px-8 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Start Your Free Audit
              </a>
              <a
                href="mailto:support@convertiq.io"
                className="inline-block rounded-full border border-border px-8 py-3 text-sm font-medium text-muted hover:text-foreground hover:border-border/80 transition-all"
              >
                Share Your Results
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
