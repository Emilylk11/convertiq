export interface ServicePage {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  methodology: string[];
  whoItsFor: string[];
  whatYouGet: string[];
  faqs: { q: string; a: string }[];
}

export const SERVICES: ServicePage[] = [
  {
    slug: "landing-page-audit",
    title: "Landing Page Audit",
    metaTitle: "AI Landing Page Audit Service — Conversion Optimization | ConvertIQ",
    metaDescription:
      "Professional AI-powered landing page audits that analyze CTAs, copy, trust signals, UX, speed, and mobile experience. Get a scored report with actionable fixes.",
    h1: "Landing Page Conversion Audit",
    subtitle:
      "Our AI analyzes your landing page across 40+ conversion signals and delivers a scored report with prioritized fixes and copy rewrites.",
    methodology: [
      "CTA Analysis — Evaluates call-to-action clarity, placement, urgency language, visual prominence, and click friction",
      "Copy Effectiveness — Assesses headline strength, value proposition clarity, benefit-oriented language, and persuasion patterns",
      "Trust Signals — Checks for testimonials, social proof, trust badges, guarantees, and credibility indicators",
      "UX & Navigation — Reviews page structure, form design, navigation friction, and conversion path clarity",
      "Performance — Analyzes page load signals, render-blocking elements, and speed optimization opportunities",
      "Mobile Experience — Evaluates responsive design, touch targets, mobile-specific UX, and viewport optimization",
    ],
    whoItsFor: [
      "SaaS founders optimizing signup and trial conversion",
      "E-commerce brands improving product page performance",
      "Marketing agencies auditing client landing pages",
      "Freelancers validating landing page designs before launch",
      "Growth teams looking for quick conversion wins",
    ],
    whatYouGet: [
      "Overall conversion score (0-100)",
      "Category scores across 6 dimensions",
      "Prioritized findings ranked by conversion impact",
      "Specific, actionable recommendations for each issue",
      "AI-generated headline and subheadline rewrites",
      "Revenue impact estimate based on traffic data",
      "Exportable PDF report (paid plans)",
    ],
    faqs: [
      { q: "How accurate is the AI audit?", a: "Our AI only flags issues it can verify from actual page data. It checks every element — links, images, forms, CTAs — before making recommendations. The analysis is based on proven CRO principles used by top agencies." },
      { q: "How is this different from a manual CRO audit?", a: "A manual CRO audit from an agency takes 1-2 weeks and costs $2,000-$10,000. ConvertIQ delivers comparable findings in under 2 minutes at a fraction of the cost. You can then use the insights to prioritize your optimization work." },
      { q: "Can I re-audit after making changes?", a: "Yes! Paid plans include re-audit capabilities. Make your changes, run another audit, and track your score improvement over time." },
      { q: "What types of landing pages work best?", a: "Any page designed to convert visitors — SaaS landing pages, product pages, lead generation forms, webinar signups, app download pages, and service pages all work great." },
    ],
  },
  {
    slug: "email-sequence-audit",
    title: "Email Sequence Audit",
    metaTitle: "AI Email Sequence Audit — Optimize Email Conversions | ConvertIQ",
    metaDescription:
      "AI-powered email sequence audit that analyzes subject lines, CTAs, persuasion, and engagement. Get actionable feedback to improve open rates and click-throughs.",
    h1: "Email Sequence Conversion Audit",
    subtitle:
      "Our AI evaluates your email marketing copy against proven conversion principles — subject lines, CTAs, persuasion, and engagement optimization.",
    methodology: [
      "Subject Line Analysis — Evaluates curiosity triggers, length optimization, personalization, and open rate drivers",
      "CTA Optimization — Reviews call-to-action clarity, placement, button copy, and click-through drivers",
      "Copy Persuasion — Assesses emotional triggers, benefit framing, storytelling, and reader engagement",
      "Structure & Flow — Checks email scanability, paragraph length, visual hierarchy, and mobile readability",
      "Deliverability Signals — Identifies spam trigger words, excessive links, and formatting issues that hurt inbox placement",
    ],
    whoItsFor: [
      "E-commerce brands optimizing email revenue",
      "SaaS companies improving onboarding sequences",
      "Newsletter creators increasing engagement",
      "Marketing teams refining drip campaigns",
      "Freelance copywriters validating email drafts",
    ],
    whatYouGet: [
      "Overall email conversion score",
      "Subject line effectiveness rating",
      "CTA clarity and urgency analysis",
      "Specific copy improvement recommendations",
      "Rewrite suggestions for key elements",
      "Engagement and persuasion assessment",
    ],
    faqs: [
      { q: "Can I audit an entire email sequence?", a: "The standard audit analyzes one email at a time. For multi-email sequence analysis, our Full Funnel Audit (paid plan) lets you analyze up to 5 connected stages including email sequences." },
      { q: "Does it check email design/HTML?", a: "ConvertIQ focuses on copy and content analysis — the words, structure, and persuasion elements. It doesn't evaluate visual HTML design, but copy is typically the biggest lever for email conversions." },
    ],
  },
  {
    slug: "ad-copy-audit",
    title: "Ad Copy Audit",
    metaTitle: "AI Ad Copy Audit — Optimize Your Ads for Conversions | ConvertIQ",
    metaDescription:
      "AI-powered ad copy audit for Facebook, Google, LinkedIn, and more. Analyze hooks, offers, and CTAs. Get specific improvements to boost your ad performance.",
    h1: "Ad Copy Conversion Audit",
    subtitle:
      "Our AI analyzes your ad copy against high-performing patterns — hook strength, offer clarity, CTA effectiveness, and audience alignment.",
    methodology: [
      "Hook Analysis — Evaluates attention-grabbing power, pattern interrupts, and thumb-stopping effectiveness",
      "Offer Clarity — Assesses value proposition presentation, benefit specificity, and perceived value",
      "CTA Effectiveness — Reviews call-to-action urgency, clarity, and alignment with the offer",
      "Audience Targeting — Checks language alignment with target demographics and awareness levels",
      "Competitive Differentiation — Evaluates uniqueness of positioning and messaging angles",
    ],
    whoItsFor: [
      "Media buyers optimizing ad spend",
      "Brand managers reviewing campaign copy",
      "Freelance advertisers validating copy before launch",
      "Small businesses writing their own ads",
      "Agencies managing multi-client ad accounts",
    ],
    whatYouGet: [
      "Overall ad effectiveness score",
      "Hook strength rating",
      "Offer clarity and value proposition analysis",
      "CTA urgency and conversion potential",
      "Specific copy improvement recommendations",
      "Alternative copy suggestions",
    ],
    faqs: [
      { q: "Which ad platforms does this work for?", a: "Any platform with text-based ads — Facebook/Meta, Google, LinkedIn, Twitter/X, TikTok, Pinterest, Reddit, and more. Paste your ad text regardless of platform." },
      { q: "Does it analyze visual ad creative?", a: "Currently, ConvertIQ analyzes text copy only. We focus on the words — hooks, offers, CTAs, and persuasion patterns — which are typically the highest-leverage element of any ad." },
    ],
  },
  {
    slug: "checkout-flow-audit",
    title: "Checkout Flow Audit",
    metaTitle: "AI Checkout Flow Audit — Reduce Cart Abandonment | ConvertIQ",
    metaDescription:
      "AI-powered checkout flow audit that identifies cart abandonment risks, trust issues, and conversion friction. Get specific fixes to increase checkout completion rates.",
    h1: "Checkout Flow Conversion Audit",
    subtitle:
      "Our AI analyzes your checkout page for abandonment risks, trust gaps, and friction points — with specific fixes to increase completion rates.",
    methodology: [
      "Abandonment Risk Analysis — Identifies friction points that cause shoppers to leave during checkout",
      "Trust Signal Audit — Checks for security badges, payment logos, guarantees, and return policies",
      "Form Optimization — Reviews field count, input types, validation, and autofill compatibility",
      "Pricing Transparency — Evaluates shipping cost presentation, tax visibility, and total cost clarity",
      "Payment UX — Assesses payment method variety, express checkout options, and mobile payment support",
      "Recovery Opportunities — Identifies missing cart saving, email capture, and exit-intent opportunities",
    ],
    whoItsFor: [
      "E-commerce store owners reducing cart abandonment",
      "Shopify and WooCommerce merchants optimizing checkout",
      "Subscription businesses improving signup conversion",
      "Product managers auditing purchase flows",
      "CRO consultants analyzing client checkout pages",
    ],
    whatYouGet: [
      "Overall checkout conversion score",
      "Abandonment risk factor analysis",
      "Trust and security signal assessment",
      "Form friction evaluation",
      "Specific fixes ranked by impact",
      "Mobile checkout optimization recommendations",
    ],
    faqs: [
      { q: "Can it audit Shopify checkout?", a: "Yes. ConvertIQ can audit any publicly accessible checkout page including Shopify, WooCommerce, BigCommerce, Squarespace Commerce, and custom-built checkout flows." },
      { q: "What if my checkout requires login?", a: "ConvertIQ needs public access to analyze a page. If your checkout requires authentication, try auditing the cart page, product page, or any pre-checkout page that's publicly accessible." },
    ],
  },
];

export function getServiceBySlug(slug: string): ServicePage | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
