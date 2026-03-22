import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getUserTier, type UserTier } from "@/lib/tiers";
import { getCreditBalance } from "@/lib/credits";
import MobileNav from "@/components/MobileNav";
import DashboardMobileNav from "@/components/DashboardMobileNav";
import ThemeToggle from "@/components/ThemeToggle";
import SignOutButton from "@/components/SignOutButton";
import SupportButton from "@/components/SupportButton";
import PricingBuyButton from "./PricingBuyButton";

export const metadata: Metadata = {
  title: "Pricing — ConvertIQ",
  description:
    "Simple credit-based pricing. Buy credits, run audits. No subscriptions, no surprise charges.",
};

const TIERS = [
  {
    name: "Starter",
    price: 29,
    credits: 3,
    perCredit: "9.67",
    description: "Perfect for testing on your most important pages.",
    features: [
      "3 full audit credits",
      "Overall score + category scores",
      "Full findings & recommendations",
      "PDF export",
      "Re-audit (track changes)",
      "Shareable report links",
    ],
    cta: "Buy Starter Pack",
    popular: false,
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_STARTER || "",
  },
  {
    name: "Growth",
    price: 79,
    credits: 10,
    perCredit: "7.90",
    description: "For teams optimising multiple pages and funnels.",
    features: [
      "10 full audit credits",
      "Everything in Starter, plus:",
      "AI copy rewrites",
      "Competitor comparison",
      "Priority processing",
      "Shareable report links",
    ],
    cta: "Buy Growth Pack",
    popular: true,
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_GROWTH || "",
  },
  {
    name: "Agency",
    price: 199,
    credits: 30,
    perCredit: "6.63",
    description: "For agencies running audits across client portfolios.",
    features: [
      "30 full audit credits",
      "Everything in Growth, plus:",
      "Custom branding on PDFs",
      "Bulk audit (multiple URLs)",
      "Priority support",
      "Shareable report links",
    ],
    cta: "Buy Agency Pack",
    popular: false,
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_AGENCY || "",
  },
];

const CREDIT_TOPUPS = [
  {
    credits: 5,
    price: 19,
    perCredit: "3.80",
    savings: null,
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_CREDITS_5 || "",
  },
  {
    credits: 15,
    price: 49,
    perCredit: "3.27",
    savings: "14",
    popular: true,
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_CREDITS_15 || "",
  },
  {
    credits: 50,
    price: 129,
    perCredit: "2.58",
    savings: "32",
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_CREDITS_50 || "",
  },
];

const AUDIT_TYPES = [
  {
    name: "Landing Page Audit",
    desc: "CTA placement, copy, trust signals, UX, speed, mobile — the full conversion teardown.",
    icon: "&#127919;",
    available: true,
    href: "/dashboard/new-audit",
  },
  {
    name: "Email Sequence Audit",
    desc: "Subject lines, open-rate signals, CTA clarity, and sequence flow analysis.",
    icon: "&#128231;",
    available: true,
    href: "/dashboard/email-audit",
  },
  {
    name: "Ad Copy Audit",
    desc: "Hook strength, offer clarity, audience alignment, and click-through optimisation.",
    icon: "&#128226;",
    available: true,
    href: "/dashboard/ad-audit",
  },
  {
    name: "Checkout Flow Audit",
    desc: "Cart abandonment signals, friction points, trust elements, and payment UX.",
    icon: "&#128722;",
    available: true,
    href: "/dashboard/checkout-audit",
  },
  {
    name: "Full Funnel Audit",
    desc: "End-to-end analysis from ad to landing page to checkout — every conversion leak. Costs 2 credits.",
    icon: "&#128260;",
    available: true,
    href: "/dashboard/funnel-audit",
  },
];

export default async function PricingPage() {
  // Check auth state for nav
  let isLoggedIn = false;
  let userTier: UserTier = "free";
  let userEmail = "";
  let balance = 0;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      isLoggedIn = true;
      userEmail = user.email || "";
      const [tier, bal] = await Promise.all([
        getUserTier(user.id).catch(() => "free" as UserTier),
        getCreditBalance(user.id).catch(() => 0),
      ]);
      userTier = tier;
      balance = bal;
    }
  } catch {
    // Not logged in
  }

  return (
    <div className="min-h-full bg-background text-foreground">
      {/* Nav */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 sm:px-6 h-16">
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
                <a href="/pricing" className="text-foreground font-medium transition-colors">Buy Credits</a>
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
                <a href="/pricing" className="text-foreground">Pricing</a>
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
            </>
          )}
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-14 sm:pt-20 pb-12 sm:pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 text-sm text-accent-bright mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" />
            Simple, credit-based pricing
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
            Pay per audit.{" "}
            <span className="bg-gradient-to-r from-accent-bright to-accent bg-clip-text text-transparent">
              No subscriptions.
            </span>
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Buy credits, run audits whenever you need them. Credits never
            expire.{" "}
            {isLoggedIn
              ? `You currently have ${balance} credit${balance !== 1 ? "s" : ""}.`
              : "Start with a free audit to see the quality first."}
          </p>
        </section>

        {/* ROI Section */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">
                Why this pays for itself{" "}
                <span className="text-green-400">instantly</span>
              </h2>
              <p className="text-sm text-muted max-w-xl mx-auto">
                A single finding from a ConvertIQ audit can generate thousands in new monthly revenue.
              </p>
            </div>

            {/* The math */}
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl bg-background/50 border border-border/30 p-4 text-center">
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Your page gets</p>
                <p className="text-2xl font-bold">10,000</p>
                <p className="text-xs text-muted">monthly visitors</p>
              </div>
              <div className="rounded-xl bg-background/50 border border-border/30 p-4 text-center">
                <p className="text-xs text-muted uppercase tracking-wider mb-1">One CRO fix adds</p>
                <p className="text-2xl font-bold text-green-400">+1%</p>
                <p className="text-xs text-muted">conversion rate lift</p>
              </div>
              <div className="rounded-xl bg-background/50 border border-border/30 p-4 text-center">
                <p className="text-xs text-muted uppercase tracking-wider mb-1">That&apos;s an extra</p>
                <p className="text-2xl font-bold text-green-400">$5,000</p>
                <p className="text-xs text-muted">per month in revenue*</p>
              </div>
            </div>

            {/* Comparison */}
            <div className="rounded-xl bg-background/50 border border-border/30 p-4 sm:p-5">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 text-center">How ConvertIQ compares</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">✕</span>
                    <span className="text-muted">CRO agency retainer</span>
                  </div>
                  <span className="font-semibold text-red-400">$2,000–$10,000/mo</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">✕</span>
                    <span className="text-muted">Freelance CRO consultant</span>
                  </div>
                  <span className="font-semibold text-red-400">$150–$500/audit</span>
                </div>
                <div className="border-t border-border/30 my-2" />
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="font-medium">ConvertIQ audit</span>
                  </div>
                  <span className="font-bold text-green-400">$2.58–$3.80/audit</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-muted/50 text-center mt-3">
              *Based on $50 avg. order value. Your results will vary based on traffic, industry, and implementation.
            </p>
          </div>
        </section>

        {/* Credit Top-Ups for logged-in users */}
        {isLoggedIn && userTier !== "free" && (
          <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
                Need more credits?
              </h2>
              <p className="text-sm text-muted">
                Top up anytime. Credits stack with your existing balance of{" "}
                <span className="text-accent-bright font-semibold">{balance}</span> and never expire.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {CREDIT_TOPUPS.map((pack) => (
                <div
                  key={pack.credits}
                  className={`relative rounded-2xl border p-6 flex flex-col ${
                    pack.popular
                      ? "border-accent bg-surface shadow-lg shadow-accent/10"
                      : "border-border/50 bg-surface/50"
                  }`}
                >
                  {pack.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-white">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">{pack.credits} Credits</h3>
                    <p className="text-xs text-muted mt-0.5">
                      ${pack.perCredit} per audit
                      {pack.savings && (
                        <span className="text-green-400 ml-1">— save {pack.savings}%</span>
                      )}
                    </p>
                  </div>
                  <div className="mb-5">
                    <span className="text-3xl font-bold">${pack.price}</span>
                    <span className="text-muted text-sm ml-1">one-time</span>
                  </div>
                  <PricingBuyButton
                    label={`Buy ${pack.credits} Credits`}
                    popular={pack.popular || false}
                    variantId={pack.variantId}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tier Packages */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 sm:pb-24">
          {isLoggedIn && userTier !== "free" && (
            <div className="text-center mb-8">
              <p className="text-xs text-muted uppercase tracking-wider font-semibold mb-1">Or upgrade your plan</p>
              <p className="text-sm text-muted">Switch tiers to unlock additional features</p>
            </div>
          )}
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl border p-6 sm:p-8 flex flex-col ${
                  tier.popular
                    ? "border-accent bg-surface shadow-lg shadow-accent/10"
                    : "border-border/50 bg-surface/50"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-1">{tier.name}</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${tier.price}</span>
                    <span className="text-muted text-sm">
                      / {tier.credits} credits
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1">
                    ${tier.perCredit} per audit
                  </p>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm"
                    >
                      <svg
                        className="h-4 w-4 text-success shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-muted">{feature}</span>
                    </li>
                  ))}
                </ul>

                <PricingBuyButton
                  label={tier.cta}
                  popular={tier.popular}
                  variantId={tier.variantId}
                />
              </div>
            ))}
          </div>

          {/* Free tier callout */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted">
              {isLoggedIn ? (
                <>
                  Want to test first?{" "}
                  <a
                    href="/dashboard/new-audit"
                    className="text-accent-bright hover:underline font-medium"
                  >
                    Run an audit from your dashboard
                  </a>
                </>
              ) : (
                <>
                  Not sure yet?{" "}
                  <a
                    href="/#free-audit"
                    className="text-accent-bright hover:underline font-medium"
                  >
                    Try a free audit first
                  </a>{" "}
                  — no account required.
                </>
              )}
            </p>
          </div>
        </section>

        {/* What's included */}
        <section className="border-y border-border/40 bg-surface/20 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                Audit types{" "}
                <span className="text-accent-bright">&amp; roadmap</span>
              </h2>
              <p className="text-muted text-base sm:text-lg max-w-xl mx-auto">
                All 5 audit types are live. Your credits work across all of them.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {AUDIT_TYPES.map((type) => (
                <a
                  key={type.name}
                  href={type.href}
                  className="rounded-2xl border border-border/50 bg-surface/50 hover:border-accent/30 p-6 transition-colors block"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl" dangerouslySetInnerHTML={{ __html: type.icon }} />
                  </div>
                  <h3 className="font-semibold mb-1.5">{type.name}</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {type.desc}
                  </p>
                </a>
              ))}

              {/* Roadmap placeholder */}
              <div className="rounded-2xl border border-dashed border-border/50 p-6 flex flex-col items-center justify-center text-center">
                <div className="text-2xl mb-3">&#128640;</div>
                <h3 className="font-semibold mb-1.5">More on the roadmap</h3>
                <p className="text-sm text-muted leading-relaxed">
                  SEO audit, competitor analysis, and A/B test recommendations
                  are coming next.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ teaser */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              Questions?
            </h2>
            <p className="text-muted text-base sm:text-lg mb-6">
              Check out our{" "}
              <a
                href="/faq"
                className="text-accent-bright hover:underline font-medium"
              >
                frequently asked questions
              </a>
              , or reach out at{" "}
              <a
                href="mailto:support@convertiq.io"
                className="text-accent-bright hover:underline font-medium"
              >
                support@convertiq.io
              </a>
              .
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
              <a href="/examples" className="hover:text-foreground transition-colors">Examples</a>
              <a href="/pricing" className="hover:text-foreground transition-colors">Pricing</a>
              <a href="/faq" className="hover:text-foreground transition-colors">FAQ</a>
              <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
            </div>
            <p className="text-xs sm:text-sm text-muted/60">
              &copy; 2026 ConvertIQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating support button */}
      <SupportButton />
    </div>
  );
}
