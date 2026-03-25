import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COMPETITORS, getCompetitorBySlug } from "@/data/competitors";
import ComparisonTable from "@/components/seo/ComparisonTable";
import SeoCta from "@/components/seo/SeoCta";
import FaqAccordion from "@/app/faq/FaqAccordion";
import ThemeToggle from "@/components/ThemeToggle";
import MobileNav from "@/components/MobileNav";
import { buildComparisonPageSchema, buildBreadcrumbSchema } from "@/lib/schema";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://convert-iqs.com";

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const c of COMPETITORS) {
    params.push({ slug: `convertiq-vs-${c.slug}` });
    params.push({ slug: `${c.slug}-vs-convertiq` });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const competitor = getCompetitorBySlug(slug);
  if (!competitor) return { title: "Comparison Not Found" };

  const title = `ConvertIQ vs ${competitor.name}: Which CRO Tool Is Better in 2026?`;
  const description = `Compare ConvertIQ and ${competitor.name} side-by-side. See features, pricing, and which conversion optimization tool is right for your business.`;

  return {
    title,
    description,
    openGraph: { title, description, url: `${APP_URL}/compare/${slug}` },
    alternates: { canonical: `${APP_URL}/compare/convertiq-vs-${competitor.slug}` },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const competitor = getCompetitorBySlug(slug);
  if (!competitor) notFound();

  const pageUrl = `/compare/convertiq-vs-${competitor.slug}`;

  return (
    <div className="min-h-full bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: buildComparisonPageSchema({
            title: `ConvertIQ vs ${competitor.name}`,
            description: `Feature comparison between ConvertIQ and ${competitor.name}`,
            url: pageUrl,
            faqs: competitor.faqs,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Compare", url: "/compare" },
            { name: `ConvertIQ vs ${competitor.name}`, url: pageUrl },
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
          <a href="/compare/convertiq-vs-vwo" className="hover:text-foreground transition-colors">Compare</a>
          <span>/</span>
          <span className="text-foreground">vs {competitor.name}</span>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-bright bg-accent/10 border border-accent/20 rounded-full px-2.5 py-0.5">
            Comparison
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mt-4 mb-4">
            ConvertIQ vs {competitor.name}
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            {competitor.description} See how it compares to ConvertIQ&apos;s AI-powered conversion audit platform.
          </p>
        </div>

        {/* Quick comparison */}
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6">
            <h3 className="font-semibold text-accent-bright mb-1">ConvertIQ</h3>
            <p className="text-xs text-muted mb-3">AI-powered conversion audit platform</p>
            <p className="text-sm font-medium">Starting at $29 (one-time)</p>
            <p className="text-xs text-muted mt-1">Free audit available</p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-surface/30 p-6">
            <h3 className="font-semibold mb-1">{competitor.name}</h3>
            <p className="text-xs text-muted mb-3">{competitor.focusAreas.join(", ")}</p>
            <p className="text-sm font-medium">{competitor.pricing}</p>
            <p className="text-xs text-muted mt-1">{competitor.hasFree ? "Free plan available" : "No free plan"}</p>
          </div>
        </div>

        {/* Feature comparison table */}
        <h2 className="text-xl sm:text-2xl font-bold mb-6">Feature Comparison</h2>
        <div className="mb-12">
          <ComparisonTable competitorName={competitor.name} rows={competitor.comparisonRows} />
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <div>
            <h3 className="text-lg font-semibold mb-4">{competitor.name} Strengths</h3>
            <ul className="space-y-2">
              {competitor.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-green-400 shrink-0 mt-0.5">
                    <path d="M4 8l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{competitor.name} Weaknesses</h3>
            <ul className="space-y-2">
              {competitor.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-red-400 shrink-0 mt-0.5">
                    <path d="M5 5l6 6M11 5l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Why ConvertIQ */}
        <div className="rounded-2xl border border-border/50 bg-surface/30 p-6 sm:p-8 mb-12">
          <h2 className="text-xl font-bold mb-4">Why teams choose ConvertIQ</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-bold text-accent-bright mb-1">&lt; 2 min</p>
              <p className="text-sm text-muted">Get a full conversion audit instantly — no setup, no code, no waiting for traffic data.</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent-bright mb-1">5 audit types</p>
              <p className="text-sm text-muted">Landing pages, emails, ad copy, checkout flows, and full funnels — all in one platform.</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent-bright mb-1">Pay per audit</p>
              <p className="text-sm text-muted">No monthly subscription. Buy credits and use them when you need them. Free audit included.</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        {competitor.faqs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <FaqAccordion items={competitor.faqs} />
          </div>
        )}

        {/* CTA */}
        <SeoCta
          headline={`Ready to try the ConvertIQ difference?`}
          description={`See what AI-powered conversion audits can do for your pages. Run a free audit in under 2 minutes — no account required.`}
          secondaryHref="/pricing"
          secondaryText="View Pricing"
        />
      </main>
    </div>
  );
}
