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
      "rewrittenCopy": "<suggested replacement text, if applicable, otherwise omit>"
    }
  ],
  "categoryScores": {
    "cta": <number 0-100>,
    "copy": <number 0-100>,
    "trust": <number 0-100>,
    "ux": <number 0-100>,
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
- Score harshly but fairly — most pages score 30-70
- Categories: cta (calls to action), copy (headlines, body text, value props), trust (social proof, testimonials, badges), ux (layout, navigation, friction), speed (perceived performance), mobile (mobile-specific issues)
- Severity: critical (major conversion killer), warning (notable issue), info (nice-to-have improvement)`;

export function buildAuditUserMessage(data: ScrapedPageData): string {
  return `Audit this landing page for conversion effectiveness.

URL: ${data.url}
Title: ${data.title}
Meta Description: ${data.metaDescription}

HEADINGS:
${data.headings.map((h) => `${"#".repeat(h.level)} ${h.text}`).join("\n")}

CALLS TO ACTION (${data.ctas.length} found):
${data.ctas.map((c) => `- [${c.type}] "${c.text}" → ${c.href}`).join("\n") || "None found"}

IMAGES (${data.images.length} total):
${data.images.slice(0, 20).map((i) => `- ${i.alt || "(no alt text)"}: ${i.src}`).join("\n")}

FORMS: ${data.formCount}
HAS TESTIMONIALS: ${data.hasTestimonials}
HAS PRICING: ${data.hasPricingSection}
WORD COUNT: ${data.wordCount}
EXTERNAL LINKS: ${data.links.filter((l) => l.isExternal).length}

PAGE CONTENT:
${data.textContent}`;
}
