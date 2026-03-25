export interface FreeTool {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  whatItChecks: string[];
  howItWorks: { step: string; description: string }[];
  faqs: { q: string; a: string }[];
}

export const FREE_TOOLS: FreeTool[] = [
  {
    slug: "landing-page-audit",
    title: "Free Landing Page Audit",
    metaTitle: "Free Landing Page Audit Tool — AI-Powered | ConvertIQ",
    metaDescription:
      "Get a free AI conversion audit of your landing page in under 2 minutes. Analyze CTAs, copy, trust signals, UX, speed, and mobile experience. No signup required.",
    h1: "Free AI Landing Page Audit",
    subtitle:
      "Paste your URL and get a scored conversion audit with specific findings and ready-to-use copy rewrites — in under 2 minutes.",
    whatItChecks: [
      "CTA clarity, placement, and urgency",
      "Headline and copy effectiveness",
      "Trust signals (testimonials, logos, guarantees)",
      "UX friction and navigation issues",
      "Page speed and performance signals",
      "Mobile responsiveness and layout",
      "Form design and conversion flow",
      "Social proof and credibility markers",
    ],
    howItWorks: [
      { step: "Paste your URL", description: "Enter any publicly accessible landing page URL." },
      { step: "AI analyzes your page", description: "Our AI scrapes your page and evaluates 40+ conversion signals across 6 categories." },
      { step: "Get your report", description: "Receive a scored report with specific findings, prioritized recommendations, and suggested headline rewrites." },
    ],
    faqs: [
      { q: "Is the landing page audit really free?", a: "Yes. The free audit gives you your overall conversion score, category breakdowns, headline rewrites, and top 3 findings. No credit card or account required." },
      { q: "How long does the audit take?", a: "Most audits complete in 60-90 seconds. Larger pages or JavaScript-heavy sites may take up to 2-3 minutes." },
      { q: "What kinds of landing pages can I audit?", a: "Any publicly accessible page — SaaS landing pages, e-commerce product pages, lead gen pages, app download pages, event registration pages, and more." },
      { q: "How is this different from Google Lighthouse?", a: "Google Lighthouse focuses on technical performance (load speed, accessibility). ConvertIQ focuses on conversion optimization — your copy, CTAs, trust signals, and overall persuasion architecture." },
    ],
  },
  {
    slug: "email-audit",
    title: "Free Email Sequence Audit",
    metaTitle: "Free Email Audit Tool — AI-Powered Email Analysis | ConvertIQ",
    metaDescription:
      "Get a free AI audit of your email marketing copy. Analyze subject lines, CTAs, persuasion, and engagement optimization. Paste your email and get instant feedback.",
    h1: "Free AI Email Sequence Audit",
    subtitle:
      "Paste your email copy and get an instant AI analysis of subject line strength, CTA clarity, and overall persuasion effectiveness.",
    whatItChecks: [
      "Subject line effectiveness and open rate potential",
      "CTA clarity and click-through optimization",
      "Copy persuasion and emotional triggers",
      "Email structure and scanability",
      "Personalization opportunities",
      "Spam trigger words and deliverability risks",
      "Mobile readability and formatting",
      "Urgency and scarcity elements",
    ],
    howItWorks: [
      { step: "Paste your email", description: "Copy and paste your email marketing copy into the editor." },
      { step: "AI analyzes your copy", description: "Our AI evaluates your email against proven conversion copywriting principles." },
      { step: "Get your report", description: "Receive a scored analysis with specific findings and rewrite suggestions." },
    ],
    faqs: [
      { q: "What email types can I audit?", a: "Welcome sequences, nurture emails, promotional campaigns, abandoned cart emails, re-engagement sequences — any marketing email." },
      { q: "Do I need to include HTML formatting?", a: "No. Just paste the plain text content of your email. Our AI analyzes the copy, structure, and messaging — not the visual design." },
      { q: "Can I audit a full email sequence?", a: "The free tool audits one email at a time. For full sequence analysis across multiple emails, check out our Full Funnel Audit on a paid plan." },
    ],
  },
  {
    slug: "ad-copy-audit",
    title: "Free Ad Copy Audit",
    metaTitle: "Free Ad Copy Audit Tool — AI-Powered Ad Analysis | ConvertIQ",
    metaDescription:
      "Get a free AI audit of your ad copy. Analyze hooks, offers, CTAs, and persuasion effectiveness for Facebook, Google, LinkedIn, and more.",
    h1: "Free AI Ad Copy Audit",
    subtitle:
      "Paste your ad copy and get an instant AI analysis of hook strength, offer clarity, and CTA effectiveness.",
    whatItChecks: [
      "Hook strength and attention capture",
      "Offer clarity and value proposition",
      "CTA effectiveness and urgency",
      "Target audience alignment",
      "Emotional triggers and persuasion",
      "Ad format optimization (character limits)",
      "Competitive differentiation",
      "Social proof and credibility",
    ],
    howItWorks: [
      { step: "Paste your ad copy", description: "Enter the text of your ad — Facebook, Google, LinkedIn, or any platform." },
      { step: "AI analyzes your ad", description: "Our AI evaluates your ad copy against high-performing ad patterns and conversion principles." },
      { step: "Get your report", description: "Receive a scored analysis with specific improvements and alternative copy suggestions." },
    ],
    faqs: [
      { q: "What ad platforms does this work for?", a: "Any text-based ad — Facebook/Meta Ads, Google Ads, LinkedIn Ads, Twitter/X Ads, TikTok Ads, and more. Just paste the copy." },
      { q: "Does it analyze ad creative/images?", a: "Currently, ConvertIQ analyzes text copy only. We focus on the words — hooks, offers, CTAs, and persuasion patterns. Visual creative analysis is on our roadmap." },
      { q: "How many ads can I audit for free?", a: "Each free audit analyzes one ad. Run as many free audits as you'd like (one at a time), or upgrade for additional features like priority processing." },
    ],
  },
  {
    slug: "checkout-audit",
    title: "Free Checkout Flow Audit",
    metaTitle: "Free Checkout Audit Tool — AI-Powered Checkout Analysis | ConvertIQ",
    metaDescription:
      "Get a free AI audit of your checkout page. Analyze cart abandonment risks, trust signals, payment UX, and friction points. Paste your URL for instant results.",
    h1: "Free AI Checkout Flow Audit",
    subtitle:
      "Paste your checkout page URL and get an instant AI analysis of abandonment risks, trust signals, and conversion friction.",
    whatItChecks: [
      "Cart abandonment risk factors",
      "Trust signals (security badges, guarantees)",
      "Payment method variety and visibility",
      "Form field friction and complexity",
      "Shipping and pricing transparency",
      "Upsell and cross-sell optimization",
      "Mobile checkout experience",
      "Error handling and recovery",
    ],
    howItWorks: [
      { step: "Paste your checkout URL", description: "Enter the URL of your checkout page (or any page in your purchase flow)." },
      { step: "AI analyzes your checkout", description: "Our AI scrapes the page and evaluates checkout-specific conversion signals and abandonment risks." },
      { step: "Get your report", description: "Receive a scored analysis with specific fixes to reduce cart abandonment and increase completions." },
    ],
    faqs: [
      { q: "Can it audit Shopify checkout pages?", a: "Yes! ConvertIQ can audit any publicly accessible checkout page — Shopify, WooCommerce, BigCommerce, custom builds, and more." },
      { q: "What about pages behind a login?", a: "ConvertIQ needs to access the page publicly. If your checkout requires a logged-in session, try auditing the cart page or any pre-checkout page that's publicly accessible." },
      { q: "How does this help reduce cart abandonment?", a: "We analyze 20+ checkout-specific factors that contribute to abandonment — missing trust signals, unclear pricing, too many form fields, poor mobile UX, and more. Each finding comes with a specific fix." },
    ],
  },
];

export function getFreeToolBySlug(slug: string): FreeTool | undefined {
  return FREE_TOOLS.find((t) => t.slug === slug);
}
