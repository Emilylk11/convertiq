import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FREE_TOOLS, getFreeToolBySlug } from "@/data/free-tools";
import AuditForm from "@/components/AuditForm";
import EmailAuditForm from "@/components/EmailAuditForm";
import AdCopyAuditForm from "@/components/AdCopyAuditForm";
import CheckoutAuditForm from "@/components/CheckoutAuditForm";
import FaqAccordion from "@/app/faq/FaqAccordion";
import SeoCta from "@/components/seo/SeoCta";
import ThemeToggle from "@/components/ThemeToggle";
import MobileNav from "@/components/MobileNav";
import { buildFreeToolSchema, buildBreadcrumbSchema, buildFaqPageSchema } from "@/lib/schema";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://convert-iqs.com";

const FORM_MAP: Record<string, React.ComponentType<{ isLoggedIn: boolean }>> = {
  "landing-page-audit": AuditForm,
  "email-audit": EmailAuditForm,
  "ad-copy-audit": AdCopyAuditForm,
  "checkout-audit": CheckoutAuditForm,
};

export async function generateStaticParams() {
  return FREE_TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getFreeToolBySlug(slug);
  if (!tool) return { title: "Not Found" };

  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      url: `${APP_URL}/free/${slug}`,
    },
    alternates: { canonical: `${APP_URL}/free/${slug}` },
  };
}

export default async function FreeToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getFreeToolBySlug(slug);
  if (!tool) notFound();

  const FormComponent = FORM_MAP[slug];
  if (!FormComponent) notFound();

  const pageUrl = `/free/${slug}`;

  return (
    <div className="min-h-full bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: buildFreeToolSchema({
            name: tool.title,
            description: tool.metaDescription,
            url: pageUrl,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: buildFaqPageSchema(tool.faqs),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Free Tools", url: "/free/landing-page-audit" },
            { name: tool.title, url: pageUrl },
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

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted mb-8">
          <a href="/" className="hover:text-foreground transition-colors">Home</a>
          <span>/</span>
          <span className="text-foreground">{tool.title}</span>
        </div>

        {/* Hero */}
        <div className="text-center mb-10">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-0.5">
            Free Tool
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mt-4 mb-3">
            {tool.h1}
          </h1>
          <p className="text-sm sm:text-base text-muted max-w-xl mx-auto leading-relaxed">
            {tool.subtitle}
          </p>
        </div>

        {/* Embedded form */}
        <div className="mb-16" id="free-audit">
          <FormComponent isLoggedIn={false} />
        </div>

        {/* What It Checks */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">What This Audit Checks</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {tool.whatItChecks.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-border/50 bg-surface/30 p-4">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-accent-bright shrink-0 mt-0.5">
                  <path d="M4 8l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-sm text-muted">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">How It Works</h2>
          <div className="space-y-4">
            {tool.howItWorks.map((step, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl border border-border/50 bg-surface/30 p-5">
                <div className="h-8 w-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-sm font-bold text-accent-bright shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">{step.step}</p>
                  <p className="text-sm text-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <FaqAccordion items={tool.faqs} />
        </div>

        {/* CTA */}
        <SeoCta
          headline="Want more insights?"
          description="Upgrade to a paid plan for full findings, AI copy rewrites, PDF export, revenue impact estimates, and more."
          primaryHref="/pricing"
          primaryText="View Plans"
          secondaryHref="/#free-audit"
          secondaryText="Run Another Free Audit"
        />
      </main>
    </div>
  );
}
