import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COMPETITORS, getCompetitorForAlternatives } from "@/data/competitors";
import SeoCta from "@/components/seo/SeoCta";
import FaqAccordion from "@/app/faq/FaqAccordion";
import ThemeToggle from "@/components/ThemeToggle";
import MobileNav from "@/components/MobileNav";
import { buildComparisonPageSchema, buildBreadcrumbSchema } from "@/lib/schema";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://convert-iqs.com";

export async function generateStaticParams() {
  return COMPETITORS.map((c) => ({ slug: `${c.slug}-alternatives` }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const competitor = getCompetitorForAlternatives(slug);
  if (!competitor) return { title: "Not Found" };

  const title = `Best ${competitor.name} Alternatives in 2026 | ConvertIQ`;
  const description = `Looking for ${competitor.name} alternatives? Compare top CRO and conversion optimization tools including ConvertIQ, pricing, features, and more.`;

  return {
    title,
    description,
    openGraph: { title, description, url: `${APP_URL}/alternatives/${slug}` },
    alternates: { canonical: `${APP_URL}/alternatives/${slug}` },
  };
}

export default async function AlternativesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const competitor = getCompetitorForAlternatives(slug);
  if (!competitor) notFound();

  const pageUrl = `/alternatives/${slug}`;

  // Other competitors as alternatives (excluding the current one)
  const otherCompetitors = COMPETITORS.filter((c) => c.slug !== competitor.slug).slice(0, 5);

  const faqs = [
    { q: `Why look for ${competitor.name} alternatives?`, a: `Common reasons include pricing (${competitor.pricing}), wanting AI-powered recommendations instead of just analytics, needing instant results without traffic data, or wanting a simpler tool without complex setup. ConvertIQ addresses all of these with instant AI audits starting with a free tier.` },
    { q: `What makes ConvertIQ a good ${competitor.name} alternative?`, a: `ConvertIQ takes a different approach — instead of tracking user behavior or running experiments, it uses AI to instantly analyze your page and provide specific, actionable fixes. Results in under 2 minutes, no code required, starting at $29 one-time (not monthly).` },
    { q: `Can I use ConvertIQ alongside ${competitor.name}?`, a: `Absolutely. Many teams use ConvertIQ to quickly identify conversion issues, then use tools like ${competitor.name} to validate changes. They serve complementary purposes.` },
  ];

  return (
    <div className="min-h-full bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: buildComparisonPageSchema({
            title: `${competitor.name} Alternatives`,
            description: `Best alternatives to ${competitor.name} for conversion optimization`,
            url: pageUrl,
            faqs,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Alternatives", url: "/alternatives" },
            { name: `${competitor.name} Alternatives`, url: pageUrl },
          ]),
        }}
      />

      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 sm:px-6 h-16">
          <a href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center font-mono text-sm font-bold text-white shrink-0">C</div>
            <span className="text-lg font-semibold tracking-tight">Convert<span className="text-accent-bright">IQ</span></span>
          </a>
          <div className="hidden sm:flex items-center gap-8 text-sm text-muted">
            <a href="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="/pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="/blog" className="hover:text-foreground transition-colors">Blog</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a href="/login" className="rounded-full bg-accent px-4 sm:px-5 py-2 text-sm font-medium text-white hover:bg-accent-bright transition-colors">Sign In</a>
            <MobileNav />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-14 sm:py-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted mb-8">
          <a href="/" className="hover:text-foreground transition-colors">Home</a>
          <span>/</span>
          <span className="text-foreground">{competitor.name} Alternatives</span>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-bright bg-accent/10 border border-accent/20 rounded-full px-2.5 py-0.5">
            Alternatives
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mt-4 mb-4">
            Best {competitor.name} Alternatives in 2026
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            {competitor.name} ({competitor.focusAreas.join(", ")}) at {competitor.pricing}. Here are the best alternatives for conversion optimization.
          </p>
        </div>

        {/* ConvertIQ as #1 alternative */}
        <div className="rounded-2xl border-2 border-accent/30 bg-accent/5 p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold bg-accent text-white rounded-full px-2 py-0.5">Best Pick</span>
            <h2 className="text-xl font-bold">ConvertIQ</h2>
          </div>
          <p className="text-sm text-muted mb-4">
            AI-powered conversion audit platform. Instantly analyze landing pages, emails, ad copy, checkout flows, and full funnels. Get a scored report with specific fixes and AI copy rewrites in under 2 minutes.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm font-semibold">Pricing</p>
              <p className="text-xs text-muted">Free audit, paid from $29</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Best For</p>
              <p className="text-xs text-muted">Instant CRO insights</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Setup</p>
              <p className="text-xs text-muted">No code, instant</p>
            </div>
          </div>
          <a
            href="/#free-audit"
            className="inline-block rounded-full bg-gradient-to-r from-accent to-accent-dim px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Try Free Audit
          </a>
        </div>

        {/* Other alternatives */}
        <h2 className="text-xl font-bold mt-10 mb-4">Other {competitor.name} Alternatives</h2>
        <div className="space-y-4 mb-12">
          {otherCompetitors.map((alt) => (
            <div key={alt.slug} className="rounded-2xl border border-border/50 bg-surface/30 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-semibold">{alt.name}</h3>
                <span className="text-xs text-muted">{alt.pricing}</span>
              </div>
              <p className="text-sm text-muted mb-3">{alt.description}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {alt.focusAreas.slice(0, 3).map((area) => (
                  <span key={area} className="text-[10px] text-muted bg-surface border border-border/50 rounded-full px-2 py-0.5">
                    {area}
                  </span>
                ))}
                <a href={`/compare/convertiq-vs-${alt.slug}`} className="text-xs text-accent-bright hover:underline ml-auto">
                  Compare with ConvertIQ →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Why switch */}
        <div className="rounded-2xl border border-border/50 bg-surface/30 p-6 sm:p-8 mb-12">
          <h2 className="text-xl font-bold mb-4">Why switch from {competitor.name}?</h2>
          <ul className="space-y-3">
            {competitor.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted">
                <span className="text-red-400 shrink-0 mt-0.5">•</span>
                {w}
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <FaqAccordion items={faqs} />
        </div>

        {/* CTA */}
        <SeoCta
          headline={`Try the best ${competitor.name} alternative`}
          description="Run a free AI conversion audit on your page — no account required, results in under 2 minutes."
          secondaryHref={`/compare/convertiq-vs-${competitor.slug}`}
          secondaryText={`Full comparison vs ${competitor.name}`}
        />
      </main>
    </div>
  );
}
