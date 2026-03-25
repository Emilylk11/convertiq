import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES, getServiceBySlug } from "@/data/services";
import FaqAccordion from "@/app/faq/FaqAccordion";
import SeoCta from "@/components/seo/SeoCta";
import ThemeToggle from "@/components/ThemeToggle";
import MobileNav from "@/components/MobileNav";
import { buildFaqPageSchema, buildBreadcrumbSchema } from "@/lib/schema";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://convert-iqs.com";

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Not Found" };

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `${APP_URL}/services/${slug}`,
    },
    alternates: { canonical: `${APP_URL}/services/${slug}` },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const pageUrl = `/services/${slug}`;

  // Map service slug to corresponding free tool slug
  const freeToolSlugMap: Record<string, string> = {
    "landing-page-audit": "landing-page-audit",
    "email-sequence-audit": "email-audit",
    "ad-copy-audit": "ad-copy-audit",
    "checkout-flow-audit": "checkout-audit",
  };
  const freeSlug = freeToolSlugMap[slug] || "landing-page-audit";

  return (
    <div className="min-h-full bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildFaqPageSchema(service.faqs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Services", url: "/services/landing-page-audit" },
            { name: service.title, url: pageUrl },
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
          <span className="text-foreground">{service.title}</span>
        </div>

        {/* Hero */}
        <div className="text-center mb-14">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-bright bg-accent/10 border border-accent/20 rounded-full px-2.5 py-0.5">
            Service
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mt-4 mb-4">
            {service.h1}
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            {service.subtitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <a
              href={`/free/${freeSlug}`}
              className="inline-block rounded-full bg-gradient-to-r from-accent to-accent-dim px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Try Free Audit
            </a>
            <a
              href="/pricing"
              className="inline-block rounded-full border border-border/50 bg-surface px-6 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:border-border transition-all"
            >
              View Pricing
            </a>
          </div>
        </div>

        {/* Methodology */}
        <div className="mb-14">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">What We Analyze</h2>
          <div className="space-y-3">
            {service.methodology.map((item, i) => {
              const [title, ...descParts] = item.split(" — ");
              const desc = descParts.join(" — ");
              return (
                <div key={i} className="rounded-xl border border-border/50 bg-surface/30 p-5">
                  <p className="text-sm font-semibold mb-1">{title}</p>
                  {desc && <p className="text-sm text-muted">{desc}</p>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Who It's For + What You Get */}
        <div className="grid sm:grid-cols-2 gap-6 mb-14">
          <div>
            <h2 className="text-lg font-bold mb-4">Who It&apos;s For</h2>
            <ul className="space-y-2.5">
              {service.whoItsFor.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-accent-bright shrink-0 mt-0.5">
                    <path d="M4 8l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold mb-4">What You Get</h2>
            <ul className="space-y-2.5">
              {service.whatYouGet.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-green-400 shrink-0 mt-0.5">
                    <path d="M4 8l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-2xl border border-border/50 bg-surface/30 p-6 sm:p-8 mb-14">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-accent-bright">&lt; 2 min</p>
              <p className="text-xs text-muted mt-1">Audit completion</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-accent-bright">40+</p>
              <p className="text-xs text-muted mt-1">Conversion signals</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-accent-bright">$29</p>
              <p className="text-xs text-muted mt-1">Starting price</p>
            </div>
          </div>
        </div>

        {/* Compare with agency */}
        <div className="rounded-2xl border border-border/50 bg-surface/30 p-6 sm:p-8 mb-14">
          <h2 className="text-xl font-bold mb-4">ConvertIQ vs. Hiring a CRO Agency</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="pb-3 text-muted font-medium"></th>
                  <th className="pb-3 text-accent-bright font-semibold text-center">ConvertIQ</th>
                  <th className="pb-3 text-muted font-medium text-center">CRO Agency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                <tr><td className="py-2.5">Time to Results</td><td className="py-2.5 text-center">&lt; 2 minutes</td><td className="py-2.5 text-center">1-2 weeks</td></tr>
                <tr><td className="py-2.5">Cost</td><td className="py-2.5 text-center">$29+</td><td className="py-2.5 text-center">$2,000-$10,000</td></tr>
                <tr><td className="py-2.5">Setup Required</td><td className="py-2.5 text-center">None</td><td className="py-2.5 text-center">Onboarding + kickoff</td></tr>
                <tr><td className="py-2.5">Copy Rewrites</td><td className="py-2.5 text-center">AI-generated</td><td className="py-2.5 text-center">Manual</td></tr>
                <tr><td className="py-2.5">Re-audit</td><td className="py-2.5 text-center">Instant</td><td className="py-2.5 text-center">New engagement</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <FaqAccordion items={service.faqs} />
        </div>

        {/* CTA */}
        <SeoCta
          headline={`Get your ${service.title.toLowerCase()} now`}
          description="Run a free audit in under 2 minutes. See your conversion score, top findings, and AI-generated copy rewrites."
          primaryHref={`/free/${freeSlug}`}
          primaryText="Try Free Audit"
          secondaryHref="/pricing"
          secondaryText="View Plans"
        />
      </main>
    </div>
  );
}
