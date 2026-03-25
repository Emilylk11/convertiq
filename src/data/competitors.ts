export interface ComparisonRow {
  feature: string;
  convertiq: string | boolean;
  competitor: string | boolean;
}

export interface Competitor {
  slug: string;
  name: string;
  fullName: string;
  description: string;
  pricing: string;
  hasFree: boolean;
  focusAreas: string[];
  strengths: string[];
  weaknesses: string[];
  comparisonRows: ComparisonRow[];
  faqs: { q: string; a: string }[];
}

export const COMPETITORS: Competitor[] = [
  {
    slug: "vwo",
    name: "VWO",
    fullName: "VWO (Visual Website Optimizer)",
    description: "Enterprise A/B testing and experimentation platform with heatmaps and session recordings.",
    pricing: "Starts at $357/mo",
    hasFree: false,
    focusAreas: ["A/B Testing", "Heatmaps", "Session Recordings", "Personalization"],
    strengths: [
      "Full-featured A/B testing with visual editor",
      "Server-side experimentation",
      "Session recordings and heatmaps",
      "Enterprise integrations",
    ],
    weaknesses: [
      "Expensive — minimum $357/mo",
      "Complex setup, requires developer resources",
      "No AI-powered page analysis",
      "Steep learning curve for non-technical users",
    ],
    comparisonRows: [
      { feature: "AI Conversion Audit", convertiq: true, competitor: false },
      { feature: "A/B Testing", convertiq: false, competitor: true },
      { feature: "Heatmaps", convertiq: false, competitor: true },
      { feature: "AI Copy Rewrites", convertiq: true, competitor: false },
      { feature: "Instant Setup (No Code)", convertiq: true, competitor: false },
      { feature: "Email Sequence Audit", convertiq: true, competitor: false },
      { feature: "Ad Copy Audit", convertiq: true, competitor: false },
      { feature: "Checkout Flow Audit", convertiq: true, competitor: false },
      { feature: "PDF Export", convertiq: true, competitor: true },
      { feature: "Revenue Impact Estimate", convertiq: true, competitor: false },
      { feature: "Free Tier", convertiq: "Free audit", competitor: "No" },
      { feature: "Starting Price", convertiq: "$29 one-time", competitor: "$357/mo" },
    ],
    faqs: [
      { q: "Is ConvertIQ a replacement for VWO?", a: "They serve different purposes. VWO is an A/B testing platform — you create variants and measure which performs better. ConvertIQ is an AI audit tool — it instantly tells you what's wrong with your page and how to fix it. Many teams use ConvertIQ to identify issues first, then VWO to test solutions." },
      { q: "Can I use ConvertIQ and VWO together?", a: "Absolutely. ConvertIQ identifies conversion problems and suggests specific fixes. You can then use VWO to A/B test those fixes against your current page. It's a powerful workflow: diagnose with ConvertIQ, validate with VWO." },
      { q: "Why is ConvertIQ so much cheaper than VWO?", a: "Different product model. VWO charges monthly for ongoing experimentation infrastructure. ConvertIQ charges per audit — you pay only when you need an analysis. There's no monthly commitment or minimum contract." },
    ],
  },
  {
    slug: "hotjar",
    name: "Hotjar",
    fullName: "Hotjar",
    description: "Behavior analytics tool with heatmaps, session recordings, and user feedback surveys.",
    pricing: "Free plan, paid from $39/mo",
    hasFree: true,
    focusAreas: ["Heatmaps", "Session Recordings", "Surveys", "Feedback Widgets"],
    strengths: [
      "Visual heatmaps show where users click and scroll",
      "Session recordings replay actual user behavior",
      "Built-in survey and feedback tools",
      "Generous free tier",
    ],
    weaknesses: [
      "Shows behavior but doesn't explain why or how to fix it",
      "No AI analysis or recommendations",
      "Requires traffic to generate meaningful data",
      "No audit of copy, CTAs, or trust signals",
    ],
    comparisonRows: [
      { feature: "AI Conversion Audit", convertiq: true, competitor: false },
      { feature: "Heatmaps", convertiq: false, competitor: true },
      { feature: "Session Recordings", convertiq: false, competitor: true },
      { feature: "AI Copy Rewrites", convertiq: true, competitor: false },
      { feature: "Actionable Recommendations", convertiq: true, competitor: false },
      { feature: "Works With Zero Traffic", convertiq: true, competitor: false },
      { feature: "Email Sequence Audit", convertiq: true, competitor: false },
      { feature: "Checkout Flow Audit", convertiq: true, competitor: false },
      { feature: "Revenue Impact Estimate", convertiq: true, competitor: false },
      { feature: "User Surveys", convertiq: false, competitor: true },
      { feature: "Free Tier", convertiq: "Free audit", competitor: "Yes (limited)" },
      { feature: "Starting Price", convertiq: "$29 one-time", competitor: "$39/mo" },
    ],
    faqs: [
      { q: "How is ConvertIQ different from Hotjar?", a: "Hotjar shows you what users do on your page (clicks, scrolls, movements). ConvertIQ tells you what's wrong with your page and exactly how to fix it — before any users even visit. Hotjar needs traffic data; ConvertIQ works instantly on any URL." },
      { q: "Do I need traffic to use ConvertIQ?", a: "No. ConvertIQ analyzes your page content, structure, and design signals using AI. It works on brand new pages with zero traffic. Hotjar requires actual visitors to generate heatmaps and recordings." },
      { q: "Should I use Hotjar or ConvertIQ?", a: "Ideally both. Use ConvertIQ first to identify and fix conversion issues on your page. Then use Hotjar to validate that real users are responding as expected. ConvertIQ is proactive (fix before launch), Hotjar is reactive (observe after launch)." },
    ],
  },
  {
    slug: "crazy-egg",
    name: "Crazy Egg",
    fullName: "Crazy Egg",
    description: "Website optimization tool with heatmaps, A/B testing, and traffic analysis.",
    pricing: "Starts at $29/mo",
    hasFree: false,
    focusAreas: ["Heatmaps", "A/B Testing", "Traffic Analysis", "Scroll Maps"],
    strengths: [
      "Easy-to-use heatmap and scroll map tools",
      "Simple A/B testing capabilities",
      "Traffic analysis and referral tracking",
      "Affordable compared to enterprise tools",
    ],
    weaknesses: [
      "Monthly subscription model",
      "No AI-powered analysis or recommendations",
      "Limited to visual behavior data",
      "No copy, email, or checkout-specific audits",
    ],
    comparisonRows: [
      { feature: "AI Conversion Audit", convertiq: true, competitor: false },
      { feature: "Heatmaps", convertiq: false, competitor: true },
      { feature: "A/B Testing", convertiq: false, competitor: true },
      { feature: "AI Copy Rewrites", convertiq: true, competitor: false },
      { feature: "Instant Recommendations", convertiq: true, competitor: false },
      { feature: "Email Sequence Audit", convertiq: true, competitor: false },
      { feature: "Ad Copy Audit", convertiq: true, competitor: false },
      { feature: "Checkout Flow Audit", convertiq: true, competitor: false },
      { feature: "Revenue Impact Estimate", convertiq: true, competitor: false },
      { feature: "Free Tier", convertiq: "Free audit", competitor: "No" },
      { feature: "Starting Price", convertiq: "$29 one-time", competitor: "$29/mo" },
    ],
    faqs: [
      { q: "Is ConvertIQ better than Crazy Egg?", a: "They solve different problems. Crazy Egg tracks user behavior with heatmaps and offers A/B testing. ConvertIQ uses AI to instantly audit your page and provide specific fixes. ConvertIQ is faster (results in 2 minutes vs waiting for traffic data) and more prescriptive." },
      { q: "Does ConvertIQ offer heatmaps?", a: "No. ConvertIQ focuses on AI-powered conversion audits that analyze your page structure, copy, CTAs, trust signals, and more. For heatmaps, tools like Crazy Egg or Hotjar are complementary options." },
    ],
  },
  {
    slug: "optimizely",
    name: "Optimizely",
    fullName: "Optimizely",
    description: "Enterprise digital experience platform with experimentation, content management, and personalization.",
    pricing: "Custom pricing (typically $50k+/year)",
    hasFree: false,
    focusAreas: ["A/B Testing", "Personalization", "CMS", "Feature Flags"],
    strengths: [
      "Enterprise-grade experimentation platform",
      "Feature flags and progressive delivery",
      "Content management system",
      "Advanced statistical models",
    ],
    weaknesses: [
      "Enterprise pricing ($50k+/year typical)",
      "Requires significant technical resources",
      "Overkill for small and mid-size businesses",
      "No instant audit — requires setup and traffic",
    ],
    comparisonRows: [
      { feature: "AI Conversion Audit", convertiq: true, competitor: false },
      { feature: "A/B Testing", convertiq: false, competitor: true },
      { feature: "Feature Flags", convertiq: false, competitor: true },
      { feature: "AI Copy Rewrites", convertiq: true, competitor: false },
      { feature: "No-Code Setup", convertiq: true, competitor: false },
      { feature: "Email Sequence Audit", convertiq: true, competitor: false },
      { feature: "Revenue Impact Estimate", convertiq: true, competitor: false },
      { feature: "Small Business Friendly", convertiq: true, competitor: false },
      { feature: "Free Tier", convertiq: "Free audit", competitor: "No" },
      { feature: "Starting Price", convertiq: "$29 one-time", competitor: "~$50k/year" },
    ],
    faqs: [
      { q: "Is ConvertIQ an Optimizely alternative?", a: "For teams that need instant conversion audits without enterprise pricing, yes. ConvertIQ gives you AI-powered page analysis, specific recommendations, and copy rewrites for a fraction of the cost. If you need full A/B testing and feature flags, Optimizely remains the enterprise choice." },
      { q: "Can a startup use ConvertIQ instead of Optimizely?", a: "Absolutely. Most startups don't need enterprise experimentation infrastructure. ConvertIQ gives you actionable conversion insights instantly — no setup, no monthly contract, no engineering resources required." },
    ],
  },
  {
    slug: "unbounce",
    name: "Unbounce",
    fullName: "Unbounce",
    description: "Landing page builder with A/B testing, smart traffic optimization, and conversion tools.",
    pricing: "Starts at $99/mo",
    hasFree: false,
    focusAreas: ["Landing Page Builder", "A/B Testing", "Smart Traffic", "Popups"],
    strengths: [
      "Drag-and-drop landing page builder",
      "Smart Traffic AI for automatic variant routing",
      "Built-in A/B testing",
      "Popup and sticky bar tools",
    ],
    weaknesses: [
      "Only works for pages built in Unbounce",
      "Monthly subscription ($99+/mo)",
      "No audit of existing pages on other platforms",
      "No email, ad, or checkout-specific analysis",
    ],
    comparisonRows: [
      { feature: "AI Conversion Audit", convertiq: true, competitor: false },
      { feature: "Landing Page Builder", convertiq: false, competitor: true },
      { feature: "Works on Any Website", convertiq: true, competitor: false },
      { feature: "AI Copy Rewrites", convertiq: true, competitor: false },
      { feature: "Email Sequence Audit", convertiq: true, competitor: false },
      { feature: "Ad Copy Audit", convertiq: true, competitor: false },
      { feature: "Checkout Flow Audit", convertiq: true, competitor: false },
      { feature: "A/B Testing", convertiq: false, competitor: true },
      { feature: "Revenue Impact Estimate", convertiq: true, competitor: false },
      { feature: "Free Tier", convertiq: "Free audit", competitor: "No" },
      { feature: "Starting Price", convertiq: "$29 one-time", competitor: "$99/mo" },
    ],
    faqs: [
      { q: "Can ConvertIQ audit Unbounce landing pages?", a: "Yes! ConvertIQ works on any publicly accessible URL — including pages built with Unbounce. Just paste your Unbounce page URL and get an instant AI conversion audit." },
      { q: "Should I use Unbounce or ConvertIQ?", a: "They serve different needs. Unbounce is a landing page builder — you create pages in it. ConvertIQ is an audit tool that analyzes any existing page and tells you how to improve it. You can use ConvertIQ to audit pages you built in Unbounce." },
    ],
  },
  {
    slug: "google-optimize",
    name: "Google Optimize",
    fullName: "Google Optimize (Sunset)",
    description: "Google's free A/B testing tool, sunset in September 2023. Many teams are looking for alternatives.",
    pricing: "Discontinued",
    hasFree: false,
    focusAreas: ["A/B Testing (Discontinued)"],
    strengths: [
      "Was free to use",
      "Integrated with Google Analytics",
      "Simple visual editor",
    ],
    weaknesses: [
      "Shut down in September 2023",
      "No longer available",
      "Limited features even when active",
      "No AI analysis or recommendations",
    ],
    comparisonRows: [
      { feature: "Currently Available", convertiq: true, competitor: false },
      { feature: "AI Conversion Audit", convertiq: true, competitor: false },
      { feature: "AI Copy Rewrites", convertiq: true, competitor: false },
      { feature: "No-Code Setup", convertiq: true, competitor: true },
      { feature: "Email Sequence Audit", convertiq: true, competitor: false },
      { feature: "Revenue Impact Estimate", convertiq: true, competitor: false },
      { feature: "Free Tier", convertiq: "Free audit", competitor: "Discontinued" },
      { feature: "Starting Price", convertiq: "$29 one-time", competitor: "N/A" },
    ],
    faqs: [
      { q: "What happened to Google Optimize?", a: "Google sunset Google Optimize on September 30, 2023. Teams that relied on it need alternative tools for conversion optimization. ConvertIQ offers a different approach — AI-powered audits instead of manual A/B testing." },
      { q: "Is ConvertIQ a good Google Optimize replacement?", a: "If you used Google Optimize primarily to improve conversions, ConvertIQ takes a faster approach. Instead of creating variants and waiting for statistical significance, ConvertIQ instantly identifies what's wrong and suggests specific fixes." },
    ],
  },
  {
    slug: "ab-tasty",
    name: "AB Tasty",
    fullName: "AB Tasty",
    description: "Experience optimization platform with A/B testing, personalization, and feature management.",
    pricing: "Custom pricing (typically $800+/mo)",
    hasFree: false,
    focusAreas: ["A/B Testing", "Personalization", "Feature Flags", "Widget Library"],
    strengths: [
      "Visual editor for non-developers",
      "Server-side testing support",
      "Personalization engine",
      "Widget and social proof library",
    ],
    weaknesses: [
      "Expensive custom pricing",
      "No instant page audit capabilities",
      "Requires ongoing traffic for insights",
      "Complex onboarding process",
    ],
    comparisonRows: [
      { feature: "AI Conversion Audit", convertiq: true, competitor: false },
      { feature: "A/B Testing", convertiq: false, competitor: true },
      { feature: "AI Copy Rewrites", convertiq: true, competitor: false },
      { feature: "No-Code Instant Setup", convertiq: true, competitor: false },
      { feature: "Email Sequence Audit", convertiq: true, competitor: false },
      { feature: "Revenue Impact Estimate", convertiq: true, competitor: false },
      { feature: "Free Tier", convertiq: "Free audit", competitor: "No" },
      { feature: "Starting Price", convertiq: "$29 one-time", competitor: "~$800/mo" },
    ],
    faqs: [
      { q: "How does ConvertIQ compare to AB Tasty?", a: "AB Tasty is an enterprise experimentation platform for A/B testing and personalization. ConvertIQ is an instant AI audit tool. ConvertIQ is ideal for teams that want fast, specific conversion recommendations without the overhead of setting up experiments." },
    ],
  },
  {
    slug: "lucky-orange",
    name: "Lucky Orange",
    fullName: "Lucky Orange",
    description: "Website optimization suite with heatmaps, session recordings, live chat, and surveys.",
    pricing: "Starts at $32/mo",
    hasFree: true,
    focusAreas: ["Heatmaps", "Session Recordings", "Live Chat", "Surveys"],
    strengths: [
      "All-in-one analytics + chat suite",
      "Affordable pricing",
      "Live visitor view",
      "Form analytics",
    ],
    weaknesses: [
      "Monthly subscription",
      "No AI-powered conversion recommendations",
      "Requires traffic to generate data",
      "No copy or content analysis",
    ],
    comparisonRows: [
      { feature: "AI Conversion Audit", convertiq: true, competitor: false },
      { feature: "Heatmaps", convertiq: false, competitor: true },
      { feature: "Session Recordings", convertiq: false, competitor: true },
      { feature: "AI Copy Rewrites", convertiq: true, competitor: false },
      { feature: "Works Without Traffic", convertiq: true, competitor: false },
      { feature: "Email Sequence Audit", convertiq: true, competitor: false },
      { feature: "Live Chat", convertiq: false, competitor: true },
      { feature: "Revenue Impact Estimate", convertiq: true, competitor: false },
      { feature: "Free Tier", convertiq: "Free audit", competitor: "Yes (limited)" },
      { feature: "Starting Price", convertiq: "$29 one-time", competitor: "$32/mo" },
    ],
    faqs: [
      { q: "Is ConvertIQ better than Lucky Orange?", a: "They complement each other. Lucky Orange shows how visitors interact with your site (heatmaps, recordings). ConvertIQ tells you what's wrong with your page and how to fix it. ConvertIQ works instantly without needing traffic data." },
    ],
  },
  {
    slug: "convert",
    name: "Convert",
    fullName: "Convert.com",
    description: "Privacy-focused A/B testing platform for agencies and enterprise teams.",
    pricing: "Starts at $299/mo",
    hasFree: false,
    focusAreas: ["A/B Testing", "Privacy-First", "Agency Tools", "Flicker-Free Testing"],
    strengths: [
      "Privacy-focused (GDPR, HIPAA compliant)",
      "No flicker technology",
      "Agency-oriented with multi-site support",
      "Bayesian statistics engine",
    ],
    weaknesses: [
      "Expensive ($299+/mo)",
      "Focused solely on A/B testing",
      "No AI analysis or audit capabilities",
      "Requires developer integration",
    ],
    comparisonRows: [
      { feature: "AI Conversion Audit", convertiq: true, competitor: false },
      { feature: "A/B Testing", convertiq: false, competitor: true },
      { feature: "AI Copy Rewrites", convertiq: true, competitor: false },
      { feature: "No-Code Instant Setup", convertiq: true, competitor: false },
      { feature: "Email Sequence Audit", convertiq: true, competitor: false },
      { feature: "Agency White-Label", convertiq: true, competitor: true },
      { feature: "Revenue Impact Estimate", convertiq: true, competitor: false },
      { feature: "Free Tier", convertiq: "Free audit", competitor: "No" },
      { feature: "Starting Price", convertiq: "$29 one-time", competitor: "$299/mo" },
    ],
    faqs: [
      { q: "Should I use Convert.com or ConvertIQ?", a: "Convert.com is an A/B testing platform for running experiments. ConvertIQ is an AI audit tool for instant conversion analysis. If you want to test hypotheses with real traffic, use Convert.com. If you want instant, AI-generated recommendations, use ConvertIQ." },
    ],
  },
];

export function getCompetitorBySlug(slug: string): Competitor | undefined {
  // Handle both "convertiq-vs-vwo" and "vwo-vs-convertiq" formats
  const cleanSlug = slug
    .replace("convertiq-vs-", "")
    .replace("-vs-convertiq", "");
  return COMPETITORS.find((c) => c.slug === cleanSlug);
}

export function getCompetitorForAlternatives(slug: string): Competitor | undefined {
  const cleanSlug = slug.replace("-alternatives", "");
  return COMPETITORS.find((c) => c.slug === cleanSlug);
}
