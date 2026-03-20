import type { Metadata } from "next";
import MobileNav from "@/components/MobileNav";
import ThemeToggle from "@/components/ThemeToggle";
import FaqAccordion from "./FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ — ConvertIQ",
  description:
    "Frequently asked questions about ConvertIQ — how audits work, pricing, credits, and more.",
};

const FAQ_SECTIONS = [
  {
    title: "General",
    items: [
      {
        q: "What is ConvertIQ?",
        a: "ConvertIQ is an AI-powered conversion rate optimisation tool. You paste a URL, and our AI analyses your page for conversion issues — weak CTAs, missing trust signals, copy problems, UX friction, speed issues, and mobile problems. You get a scored report with specific, actionable fixes.",
      },
      {
        q: "How does the AI audit work?",
        a: "We scrape your page to extract its structure, content, links, images, and CTAs. Then we send that data to our AI engine which analyses it against 40+ conversion signals. The result is a detailed report with findings ranked by impact, specific recommendations, and suggested copy rewrites.",
      },
      {
        q: "How accurate is the analysis?",
        a: "Our AI only makes claims it can verify from the actual page data. It checks every link, image, and content element before flagging issues. That said, it analyses the HTML content — it can't evaluate visual design, animations, or JavaScript-rendered content that isn't in the initial HTML.",
      },
      {
        q: "What types of pages can I audit?",
        a: "Any publicly accessible web page. Landing pages, homepages, product pages, checkout flows, about pages — if it has a URL, we can audit it. Pages behind login walls or that require JavaScript to render content may have limited results.",
      },
    ],
  },
  {
    title: "Free audit",
    items: [
      {
        q: "What do I get with the free audit?",
        a: "The free audit gives you your overall conversion score, category scores (CTA, Copy, Trust, UX, Speed, Mobile), suggested headline rewrites, and the top 3 findings with full recommendations. The remaining findings are locked behind a paid plan.",
      },
      {
        q: "Do I need to create an account for the free audit?",
        a: "No. Just enter your URL and email address. We'll run the audit and email you the results. No account, no credit card, no commitment.",
      },
      {
        q: "Can I download the free audit as a PDF?",
        a: "Yes, but the free PDF only includes the top 3 findings. Upgrade to a paid plan to get the complete PDF with all findings and recommendations.",
      },
      {
        q: "How long does the audit take?",
        a: "Usually 20-40 seconds. Complex pages with lots of content may take up to a minute. You'll see a progress indicator while we analyse your page.",
      },
    ],
  },
  {
    title: "Pricing & credits",
    items: [
      {
        q: "How does credit-based pricing work?",
        a: "You buy a pack of credits upfront. Each full audit costs 1 credit. No subscriptions, no recurring charges. Use your credits whenever you want — they never expire.",
      },
      {
        q: "What are the pricing tiers?",
        a: "Starter: $29 for 3 credits ($9.67/audit). Growth: $79 for 10 credits ($7.90/audit). Agency: $199 for 30 credits ($6.63/audit). The more credits you buy, the lower the per-audit cost.",
      },
      {
        q: "Do credits expire?",
        a: "No. Credits never expire. Buy them when you need them, use them at your own pace.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards, debit cards, and Apple Pay / Google Pay through our payment processor, Lemon Squeezy.",
      },
      {
        q: "Can I get a refund?",
        a: "If you're unsatisfied with an audit result, contact us at hello@convertiq.com. We offer refunds on unused credits and will work with you on any quality concerns.",
      },
    ],
  },
  {
    title: "Audit types",
    items: [
      {
        q: "What audit types are available?",
        a: "Our flagship Landing Page Audit is live now — it covers CTA placement, copy effectiveness, trust signals, UX, page speed, and mobile responsiveness. We're building 4 more audit types (Email Sequence, Ad Copy, Checkout Flow, and Full Funnel) and will announce them as they launch.",
      },
      {
        q: "What's the difference between a landing page audit and a full funnel audit?",
        a: "A landing page audit analyses a single page in depth. A full funnel audit analyses the entire user journey — from the ad or entry point through the landing page to the checkout or conversion action. It identifies leaks at every step.",
      },
      {
        q: "Can I re-audit the same page after making changes?",
        a: "Yes. Use the re-audit button on any completed report. Re-audits cost 1 credit and give you a fresh analysis so you can track your improvement.",
      },
    ],
  },
  {
    title: "Reports & sharing",
    items: [
      {
        q: "Can I share my report with others?",
        a: "Yes. Every report has a \"Share\" button that generates a read-only link. Anyone with the link can view the report — no account needed. Great for sharing with clients, team members, or stakeholders.",
      },
      {
        q: "Can I download reports as PDF?",
        a: "Yes. Every completed audit has a PDF download button. Free audits include a summary PDF with the top 3 findings. Paid audits include the full report with all findings.",
      },
      {
        q: "How long are reports stored?",
        a: "Reports are stored for 90 days from generation. We recommend downloading the PDF if you need a permanent copy.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-full bg-background text-foreground">
      {/* Nav */}
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
            <a
              href="/#how-it-works"
              className="hover:text-foreground transition-colors"
            >
              How It Works
            </a>
            <a
              href="/examples"
              className="hover:text-foreground transition-colors"
            >
              Examples
            </a>
            <a
              href="/pricing"
              className="hover:text-foreground transition-colors"
            >
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
        <section className="mx-auto max-w-3xl px-4 sm:px-6 pt-14 sm:pt-20 pb-10 sm:pb-14 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Frequently asked questions
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Everything you need to know about ConvertIQ, audits, pricing, and
            reports.
          </p>
        </section>

        {/* FAQ sections */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-16 sm:pb-24">
          <div className="space-y-10">
            {FAQ_SECTIONS.map((section) => (
              <div key={section.title}>
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-accent-bright">
                  {section.title}
                </h2>
                <FaqAccordion items={section.items} />
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="border-t border-border/40 bg-surface/20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Still have questions?
            </h2>
            <p className="text-muted text-sm sm:text-base mb-6 max-w-lg mx-auto leading-relaxed">
              Reach out to us anytime — we're happy to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="mailto:hello@convertiq.com"
                className="inline-block rounded-xl border border-border px-8 py-3.5 text-base font-medium text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                Email Us
              </a>
              <a
                href="/#free-audit"
                className="inline-block rounded-xl bg-gradient-to-r from-accent to-accent-dim px-8 py-3.5 text-base font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Try a Free Audit
              </a>
            </div>
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
              <a
                href="/examples"
                className="hover:text-foreground transition-colors"
              >
                Examples
              </a>
              <a
                href="/pricing"
                className="hover:text-foreground transition-colors"
              >
                Pricing
              </a>
              <a
                href="/faq"
                className="hover:text-foreground transition-colors"
              >
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
