import type { ScrapedPageData } from "../types";

export const LANDING_PAGE_AUDIT_SYSTEM_PROMPT = `You are an expert conversion rate optimisation (CRO) consultant. You audit landing pages and provide actionable, specific recommendations to improve conversion rates.

You MUST respond with valid JSON matching this exact schema — no markdown, no explanation, just the JSON object:

{
  "overallScore": <number 0-100>,
  "summary": "<2-3 sentence executive summary>",
  "findings": [
    {
      "id": "<unique string>",
      "category": "<cta|copy|trust|ux|speed|mobile>",
      "severity": "<critical|warning|info>",
      "title": "<short finding title>",
      "description": "<what the issue is and why it hurts conversions>",
      "recommendation": "<specific, actionable fix>",
      "impactScore": <number 1-10>,
      "rewrittenCopy": "<suggested replacement text, if applicable, otherwise omit>",
      "estimatedConversionLift": <number 0.1-5.0, estimated percentage point conversion rate improvement if this issue is fixed>
    }
  ],
  "categoryScores": {
    "cta": <number 0-100>,
    "copy": <number 0-100>,
    "trust": <number 0-100>,
    "ux": <number 0-100>,
    "speed": <number 0-100>,
    "mobile": <number 0-100>
  },
  "rewrittenHeadline": "<suggested new headline if the current one is weak>",
  "rewrittenSubheadline": "<suggested new subheadline if applicable>"
}

Rules:
- Return 6-12 findings, sorted by impactScore descending
- Be specific and reference actual content from the page
- For each finding, suggest a concrete fix — not generic advice
- If you suggest rewritten copy, make it compelling and conversion-focused
- For estimatedConversionLift: estimate the realistic percentage point improvement in conversion rate if this single issue is fixed. Critical issues typically cause 1-5% lift, warnings 0.3-2%, info 0.1-0.5%. Be realistic and conservative — the total across all findings should not exceed 8-15% combined.
- Score harshly but fairly — most pages score 30-70
- Categories: cta (calls to action), copy (headlines, body text, value props), trust (social proof, testimonials, badges), ux (layout, navigation, friction), speed (perceived performance), mobile (mobile-specific issues)
- Severity: critical (major conversion killer), warning (notable issue), info (nice-to-have improvement)

CONTEXT-AWARE ANALYSIS — if the user provides context about their traffic, industry, or audience, you MUST factor it into every recommendation:
- TRAFFIC TYPE matters enormously. Cold traffic needs more trust signals, education, and objection handling. Warm traffic needs reinforcement and urgency. Hot traffic (existing leads/customers) needs minimal friction, clear pricing, and direct CTAs. Do NOT suggest cold-traffic tactics (like heavy social proof or lengthy explainers) for hot traffic pages, and vice versa.
- INDUSTRY context affects what "good" looks like. A health supplement page needs FDA disclaimers and scientific credibility. A SaaS page needs feature clarity and free trial CTAs. A portfolio site needs work samples, not pricing urgency. Tailor your recommendations to the industry norms and buyer expectations.
- AUDIENCE/DEMOGRAPHIC affects tone, copy style, and trust signals. Copy for enterprise buyers should be professional and ROI-focused. Copy for Gen Z consumers can be casual and social-proof-heavy. Copy for medical professionals needs clinical accuracy. Match the audience.
- If no context is provided, analyse the page on its own merits and infer the most likely traffic/audience from the page content. State your assumptions in the summary.

ACCURACY IS CRITICAL — follow these rules strictly:
- ONLY make claims that are directly supported by the scraped data provided below. Do NOT guess or assume.
- Before claiming something is "missing" (e.g., no social links, no images, no testimonials), carefully check ALL links, images, CTAs, and page content provided. If the data shows LinkedIn, GitHub, Dribbble, or any social links — they ARE on the page.
- The LINKS section lists every link on the page with its text and URL. Check it thoroughly before making any claim about missing links.
- The IMAGES section shows images on the page. Check it before claiming "no images."
- The PAGE CONTENT section contains the visible text. Check it before claiming content is missing.
- If you are unsure whether something exists on the page, do NOT make a finding about its absence. Focus on what you CAN verify.
- Never fabricate page content, link URLs, or element details that aren't in the scraped data.`;

interface AuditContext {
  trafficType?: string;
  industry?: string;
  audience?: string;
  monthlyTraffic?: number;
  avgOrderValue?: number;
}

const TRAFFIC_LABELS: Record<string, string> = {
  cold: "Cold traffic — first-time visitors who don't know the brand",
  warm: "Warm traffic — visitors who've seen ads or content before",
  hot: "Hot traffic — existing leads, email list, or retargeting",
  existing: "Existing customers — upsell, renewal, or loyalty",
  mixed: "Mixed — combination of traffic types",
};

const INDUSTRY_LABELS: Record<string, string> = {
  ecommerce: "E-commerce / DTC",
  saas: "SaaS / Software",
  agency: "Agency / Consulting",
  health: "Health & Wellness",
  finance: "Finance / Fintech",
  education: "Education / Courses",
  realestate: "Real Estate",
  b2b: "B2B / Enterprise",
  nonprofit: "Non-profit",
  portfolio: "Portfolio / Personal Brand",
  other: "Other",
};

export function buildAuditUserMessage(data: ScrapedPageData, context?: AuditContext): string {
  const contextLines: string[] = [];
  if (context?.trafficType) {
    contextLines.push(`TRAFFIC TYPE: ${TRAFFIC_LABELS[context.trafficType] || context.trafficType}`);
  }
  if (context?.industry) {
    contextLines.push(`INDUSTRY: ${INDUSTRY_LABELS[context.industry] || context.industry}`);
  }
  if (context?.audience) {
    contextLines.push(`TARGET AUDIENCE: ${context.audience}`);
  }

  const contextBlock = contextLines.length > 0
    ? `\nAUDIT CONTEXT (tailor all recommendations to this):\n${contextLines.join("\n")}\n`
    : "\nAUDIT CONTEXT: None provided — infer the most likely traffic type, industry, and audience from the page content and state your assumptions in the summary.\n";

  return `Audit this landing page for conversion effectiveness.

URL: ${data.url}
Title: ${data.title}
Meta Description: ${data.metaDescription}
${contextBlock}
HEADINGS:
${data.headings.map((h) => `${"#".repeat(h.level)} ${h.text}`).join("\n")}

CALLS TO ACTION (${data.ctas.length} found):
${data.ctas.map((c) => `- [${c.type}] "${c.text}" → ${c.href}`).join("\n") || "None found"}

IMAGES (${data.images.length} total):
${data.images.slice(0, 30).map((i) => `- ${i.alt || "(no alt text)"}: ${i.src}`).join("\n")}

FORMS: ${data.formCount}
HAS TESTIMONIALS: ${data.hasTestimonials}
HAS PRICING: ${data.hasPricingSection}
WORD COUNT: ${data.wordCount}

LINKS (${data.links.length} total, ${data.links.filter((l) => l.isExternal).length} external):
${data.links.map((l) => `- [${l.isExternal ? "EXT" : "INT"}] "${l.text}" → ${l.href}`).join("\n") || "None found"}

PAGE CONTENT:
${data.textContent}`;
}
