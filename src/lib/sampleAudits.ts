import type { AuditResults } from "@/lib/types";

export interface SampleAudit {
  id: string;
  company: string;
  industry: string;
  url: string;
  score: number;
  lift: string;
  results: AuditResults;
}

export const sampleAudits: SampleAudit[] = [
  {
    id: "saas-landing",
    company: "NovaCRM",
    industry: "B2B SaaS",
    url: "https://novacrm.example.com",
    score: 44,
    lift: "+31% trial signups",
    results: {
      overallScore: 44,
      summary:
        "Your landing page has a clear value proposition but suffers from weak CTAs, missing social proof, and a hero section that buries the main benefit. Addressing the critical findings below could meaningfully increase trial signups.",
      rewrittenHeadline: "Close More Deals in Half the Time — Free Trial, No Card Required",
      rewrittenSubheadline:
        "NovaCRM auto-logs calls, emails, and meetings so your team can focus on selling, not admin.",
      categoryScores: {
        cta: 38,
        copy: 47,
        trust: 29,
        ux: 55,
        speed: 61,
        mobile: 42,
      },
      findings: [
        {
          id: "f1",
          category: "cta",
          severity: "critical",
          title: "Primary CTA is buried below the fold",
          description:
            "The main 'Start Free Trial' button doesn't appear until 800px down the page. Users who don't scroll never see the core offer.",
          recommendation:
            "Move the primary CTA into the hero section, above the fold. Use a high-contrast button with a clear benefit-first label.",
          impactScore: 9,
          rewrittenCopy: "Start My Free Trial — No Credit Card",
        },
        {
          id: "f2",
          category: "trust",
          severity: "critical",
          title: "No social proof visible on page load",
          description:
            "Trust signals (customer logos, testimonials, review badges) are absent. First-time visitors have no reason to believe your claims.",
          recommendation:
            "Add 3–5 recognisable customer logos directly below the hero. Place a G2 or Capterra badge near each CTA.",
          impactScore: 8,
        },
        {
          id: "f3",
          category: "copy",
          severity: "warning",
          title: "Headline focuses on features, not outcomes",
          description:
            "\"The CRM built for modern teams\" describes the product but doesn't tell prospects what they gain. Outcome-focused headlines convert better.",
          recommendation:
            "Rewrite the headline around the #1 outcome your best customers report. Lead with the result, then explain how.",
          impactScore: 8,
          rewrittenCopy: "Close 30% More Deals Without Working Extra Hours",
        },
        {
          id: "f4",
          category: "ux",
          severity: "warning",
          title: "Navigation competes with the conversion goal",
          description:
            "The top nav has 8 links including 'Blog', 'Docs', and 'Careers'. These pull attention away from signing up.",
          recommendation:
            "Simplify the nav to 3 items max: Features, Pricing, and the primary CTA. Remove exit links from landing pages.",
          impactScore: 6,
        },
        {
          id: "f5",
          category: "mobile",
          severity: "warning",
          title: "CTA button is too small on mobile",
          description:
            "The tap target for the trial button measures 28×28px on a 375px viewport — well below the 44px minimum recommended by Apple and Google.",
          recommendation:
            "Set a minimum height of 52px for all primary CTAs. Ensure full-width buttons on screens below 480px.",
          impactScore: 7,
        },
        {
          id: "f6",
          category: "copy",
          severity: "info",
          title: "Pricing page link is missing from the hero",
          description:
            "Cost is one of the top objections for SaaS buyers. Hiding the pricing page increases bounce rate from price-sensitive visitors.",
          recommendation:
            "Add a 'See pricing' ghost link or anchor below the primary CTA.",
          impactScore: 5,
          rewrittenCopy: "See pricing →",
        },
      ],
    },
  },
  {
    id: "ecom-skincare",
    company: "Lumière Skin",
    industry: "E-commerce",
    url: "https://lumiereskin.example.com",
    score: 58,
    lift: "+19% add-to-cart",
    results: {
      overallScore: 58,
      summary:
        "Strong product photography and brand aesthetic, but conversion is held back by friction in the purchase flow, sparse trust signals at the point of purchase, and a fragmented mobile layout. Fixing the critical items should materially improve add-to-cart rate.",
      rewrittenHeadline: "Visible Results in 14 Days — or Your Money Back",
      rewrittenSubheadline:
        "Dermatologist-tested serums with 4.8★ from 12,000+ customers. Free shipping on every order.",
      categoryScores: {
        cta: 62,
        copy: 66,
        trust: 45,
        ux: 58,
        speed: 49,
        mobile: 53,
      },
      findings: [
        {
          id: "f1",
          category: "trust",
          severity: "critical",
          title: "No money-back guarantee visible on product page",
          description:
            "Skincare buyers have high anxiety about wasting money on products that don't work. The absence of a guarantee forces them to take all the risk.",
          recommendation:
            "Add a bold 30-day money-back guarantee badge directly below the Add to Cart button on every product page.",
          impactScore: 9,
          rewrittenCopy: "30-Day Money-Back Guarantee — Zero Questions",
        },
        {
          id: "f2",
          category: "speed",
          severity: "critical",
          title: "Page LCP is 6.2 seconds on mobile",
          description:
            "The hero image is 2.4 MB and uncompressed. A 1-second delay in mobile load time reduces conversions by ~7% (Google/Deloitte study).",
          recommendation:
            "Convert hero images to WebP, add width/height attributes to prevent layout shift, and serve images via a CDN with aggressive caching.",
          impactScore: 8,
        },
        {
          id: "f3",
          category: "cta",
          severity: "warning",
          title: "Add to Cart CTA is the same colour as secondary actions",
          description:
            "The primary CTA uses the same beige colour as the wishlist and compare buttons. Users can't immediately identify the most important action.",
          recommendation:
            "Give the primary CTA a high-contrast colour (e.g. deep green or black) that differs from all secondary actions. Test button copy too.",
          impactScore: 7,
          rewrittenCopy: "Add to Bag — Free Shipping",
        },
        {
          id: "f4",
          category: "copy",
          severity: "warning",
          title: "Ingredient list reads like a chemistry textbook",
          description:
            "The ingredient section uses INCI names (e.g. 'Niacinamide', 'Retinyl Palmitate') without explaining what they do for the customer.",
          recommendation:
            "Translate top 3 key ingredients into benefit language. e.g. 'Niacinamide — fades dark spots in 4 weeks'.",
          impactScore: 6,
        },
        {
          id: "f5",
          category: "ux",
          severity: "info",
          title: "Variant selector resets page scroll on mobile",
          description:
            "Selecting a shade triggers a full page reload, returning the user to the top and losing their position in product reviews.",
          recommendation:
            "Implement variant selection as a client-side state change with no page reload. Use URL hash updates for shareability.",
          impactScore: 5,
        },
      ],
    },
  },
  {
    id: "agency-portfolio",
    company: "Forge Studio",
    industry: "Creative Agency",
    url: "https://forgestudio.example.com",
    score: 37,
    lift: "+44% contact form fills",
    results: {
      overallScore: 37,
      summary:
        "Beautiful visual design, but the page is almost entirely CTA-free, making it impossible for interested prospects to take the next step. The copy focuses on the agency rather than client outcomes, and there is no clear pricing signal to qualify leads.",
      rewrittenHeadline: "We Build Brands That Win More Business",
      rewrittenSubheadline:
        "Brand strategy, web design, and launch campaigns for B2B tech companies ready to grow.",
      categoryScores: {
        cta: 22,
        copy: 35,
        trust: 48,
        ux: 44,
        speed: 55,
        mobile: 38,
      },
      findings: [
        {
          id: "f1",
          category: "cta",
          severity: "critical",
          title: "No CTA visible without scrolling 1,400px",
          description:
            "The first actionable element on the page is a 'View Work' link in the portfolio section. There is no 'Get in touch' or 'Start a project' CTA anywhere near the hero.",
          recommendation:
            "Add a primary CTA to the hero section ('Start a project →') and a secondary CTA in the nav. Repeat the CTA after the case studies section.",
          impactScore: 10,
          rewrittenCopy: "Start a Project →",
        },
        {
          id: "f2",
          category: "copy",
          severity: "critical",
          title: "Hero copy is agency-centric, not client-centric",
          description:
            "'We craft bold digital experiences' says nothing about what the client gains. Prospects come with problems to solve, not appreciation for craft.",
          recommendation:
            "Flip the copy to focus on client outcomes. Answer: 'What do clients walk away with, and why should they choose you?'",
          impactScore: 9,
          rewrittenCopy:
            "Your next website, brand, or campaign — designed to convert visitors into customers.",
        },
        {
          id: "f3",
          category: "trust",
          severity: "warning",
          title: "Portfolio lacks outcome metrics",
          description:
            "Case studies show before/after visuals but contain no conversion rates, revenue figures, or client growth data. Metrics make social proof 63% more convincing (Nielsen Norman Group).",
          recommendation:
            "Add one headline metric to each case study: e.g. '+180% organic traffic in 6 months' or '2× lead volume after rebrand'.",
          impactScore: 8,
        },
        {
          id: "f4",
          category: "ux",
          severity: "warning",
          title: "Contact form is a separate page with no progress indicator",
          description:
            "The 7-field contact form lives on a separate URL with no indication of how long it takes. Long forms without progress signals have high abandonment.",
          recommendation:
            "Embed a 3-question inline form on the homepage. Use a multi-step flow with a progress bar if more fields are needed.",
          impactScore: 7,
        },
        {
          id: "f5",
          category: "copy",
          severity: "info",
          title: "No pricing signal or typical project size mentioned",
          description:
            "Without any pricing context, unqualified leads fill the contact form, wasting both their time and yours.",
          recommendation:
            "Add 'Projects typically start at $15k' or a 'Typical budget' qualifier to the contact form to pre-qualify leads.",
          impactScore: 6,
        },
      ],
    },
  },
];
