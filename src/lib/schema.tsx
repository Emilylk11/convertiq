/**
 * JSON-LD Structured Data for SEO.
 *
 * Layout-level schemas use next/script (works in root layout).
 * Page-level schemas return raw JSON strings for injection via
 * generateMetadata() → other.structured-data pattern, which avoids
 * React hydration warnings while still being present in server HTML.
 */
import Script from "next/script";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://convert-iqs.com";

// ─── Layout-level schemas (use Script component) ───

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ConvertIQ",
    url: APP_URL,
    logo: `${APP_URL}/logo.svg`,
    description:
      "AI-powered conversion rate optimization platform. Audit landing pages, emails, ad copy, checkout flows, and full funnels in under 2 minutes.",
    foundingDate: "2026",
    sameAs: ["https://www.producthunt.com/products/convertiq"],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@convertiq.com",
      contactType: "customer support",
    },
  };

  return (
    <Script
      id="schema-organization"
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function SoftwareApplicationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ConvertIQ",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: APP_URL,
    description:
      "AI-powered CRO audit tool. Paste a URL and get a scored conversion audit with actionable fixes and copy rewrites in under 2 minutes.",
    offers: [
      { "@type": "Offer", name: "Free Audit", price: "0", priceCurrency: "USD" },
      { "@type": "Offer", name: "Starter", price: "29", priceCurrency: "USD" },
      { "@type": "Offer", name: "Growth", price: "79", priceCurrency: "USD" },
      { "@type": "Offer", name: "Agency", price: "199", priceCurrency: "USD" },
    ],
    featureList: [
      "Landing Page Audit", "Email Sequence Audit", "Ad Copy Audit",
      "Checkout Flow Audit", "Full Funnel Audit", "AI Copy Rewrites",
      "PDF Export", "Revenue Impact Calculator", "Competitor Analysis",
    ],
  };

  return (
    <Script
      id="schema-software"
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Page-level schema builders (return JSON strings) ───
// These are used in generateMetadata() to add JSON-LD to <head>

export function buildFaqPageSchema(faqs: { q: string; a: string }[]) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  });
}

export function buildArticleSchema({
  title, description, slug, datePublished, dateModified, readTime,
}: {
  title: string; description: string; slug: string;
  datePublished: string; dateModified?: string; readTime?: string;
}) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${APP_URL}/blog/${slug}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: { "@type": "Organization", name: "ConvertIQ", url: APP_URL },
    publisher: {
      "@type": "Organization", name: "ConvertIQ",
      logo: { "@type": "ImageObject", url: `${APP_URL}/logo.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${APP_URL}/blog/${slug}` },
    ...(readTime ? { timeRequired: `PT${parseInt(readTime)}M` } : {}),
  });
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${APP_URL}${item.url}`,
    })),
  });
}
