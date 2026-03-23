import Anthropic from "@anthropic-ai/sdk";
import type { ScrapedPageData, AuditResults, RevenueImpact } from "./types";
import {
  LANDING_PAGE_AUDIT_SYSTEM_PROMPT,
  buildAuditUserMessage,
} from "./prompts/landing-page-audit";
import { EMAIL_AUDIT_SYSTEM_PROMPT, buildEmailAuditUserMessage } from "./prompts/email-audit";
import { AD_COPY_AUDIT_SYSTEM_PROMPT, buildAdCopyAuditUserMessage } from "./prompts/ad-copy-audit";
import { CHECKOUT_AUDIT_SYSTEM_PROMPT, buildCheckoutAuditUserMessage } from "./prompts/checkout-audit";
import { FUNNEL_AUDIT_SYSTEM_PROMPT, buildFunnelAuditUserMessage } from "./prompts/funnel-audit";

export interface AuditContext {
  trafficType?: string;
  industry?: string;
  audience?: string;
  monthlyTraffic?: number;
  avgOrderValue?: number;
}

const CLAUDE_TIMEOUT_MS = 120_000; // 120 second timeout for Claude API calls

export async function runLandingPageAudit(
  scrapedData: ScrapedPageData,
  context?: AuditContext,
  screenshot?: string | null
): Promise<AuditResults> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Check your .env.local file."
    );
  }
  const anthropic = new Anthropic({ apiKey, timeout: CLAUDE_TIMEOUT_MS });

  // Build message content — with or without screenshot
  const textContent = buildAuditUserMessage(scrapedData, context);
  type ContentBlock =
    | { type: "image"; source: { type: "base64"; media_type: "image/jpeg"; data: string } }
    | { type: "text"; text: string };

  const userContent: string | ContentBlock[] = screenshot
    ? [
        {
          type: "image" as const,
          source: {
            type: "base64" as const,
            media_type: "image/jpeg" as const,
            data: screenshot,
          },
        },
        { type: "text" as const, text: textContent },
      ]
    : textContent;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    system: LANDING_PAGE_AUDIT_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: userContent,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  // Strip markdown code fences if Claude wraps JSON in ```json ... ```
  let rawText = textBlock.text.trim();
  if (rawText.startsWith("```")) {
    rawText = rawText.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }

  const parsed = JSON.parse(rawText) as AuditResults;

  // Basic validation
  if (
    typeof parsed.overallScore !== "number" ||
    !Array.isArray(parsed.findings) ||
    !parsed.categoryScores
  ) {
    throw new Error("Invalid audit response structure");
  }

  // Calculate revenue impact if traffic data provided
  if (context?.monthlyTraffic && context?.avgOrderValue) {
    parsed.revenueImpact = calculateRevenueImpact(
      parsed,
      context.monthlyTraffic,
      context.avgOrderValue
    );
  }

  return parsed;
}

// Generic Claude audit runner for text-based audits (email, ad copy)
async function runTextAudit(
  systemPrompt: string,
  userMessage: string
): Promise<AuditResults> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set.");
  const anthropic = new Anthropic({ apiKey, timeout: CLAUDE_TIMEOUT_MS });

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") throw new Error("No text response from Claude");

  let rawText = textBlock.text.trim();
  if (rawText.startsWith("```")) {
    rawText = rawText.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }

  const parsed = JSON.parse(rawText) as AuditResults;
  if (typeof parsed.overallScore !== "number" || !Array.isArray(parsed.findings) || !parsed.categoryScores) {
    throw new Error("Invalid audit response structure");
  }

  // Clamp overall score to 0-100
  parsed.overallScore = Math.max(0, Math.min(100, Math.round(parsed.overallScore)));

  // Clamp category scores to 0-100
  for (const key of Object.keys(parsed.categoryScores)) {
    parsed.categoryScores[key] = Math.max(0, Math.min(100, Math.round(parsed.categoryScores[key])));
  }

  // Validate findings have required fields
  parsed.findings = parsed.findings.filter(
    (f) => f && typeof f.id === "string" && typeof f.title === "string" && f.category && f.severity
  );

  return parsed;
}

export async function runEmailAudit(
  emailContent: string,
  context?: { emailType?: string; audience?: string; goal?: string; sequencePosition?: string }
): Promise<AuditResults> {
  return runTextAudit(EMAIL_AUDIT_SYSTEM_PROMPT, buildEmailAuditUserMessage(emailContent, context));
}

export async function runAdCopyAudit(
  adContent: string,
  context?: { platform?: string; adType?: string; audience?: string; goal?: string; industry?: string }
): Promise<AuditResults> {
  return runTextAudit(AD_COPY_AUDIT_SYSTEM_PROMPT, buildAdCopyAuditUserMessage(adContent, context));
}

export async function runCheckoutAudit(
  scrapedData: ScrapedPageData,
  context?: { industry?: string; avgOrderValue?: string; audience?: string }
): Promise<AuditResults> {
  return runTextAudit(CHECKOUT_AUDIT_SYSTEM_PROMPT, buildCheckoutAuditUserMessage({
    url: scrapedData.url,
    title: scrapedData.title,
    textContent: scrapedData.textContent,
    headings: scrapedData.headings,
    ctas: scrapedData.ctas,
    images: scrapedData.images,
    links: scrapedData.links,
    formCount: scrapedData.formCount,
  }, context));
}

export async function runFunnelAudit(
  stages: Array<{ stageName: string; content: string }>,
  context?: { industry?: string; audience?: string; goal?: string; avgOrderValue?: string }
): Promise<AuditResults> {
  return runTextAudit(FUNNEL_AUDIT_SYSTEM_PROMPT, buildFunnelAuditUserMessage(stages, context));
}

function calculateRevenueImpact(
  results: AuditResults,
  monthlyTraffic: number,
  avgOrderValue: number
): RevenueImpact {
  // Estimate current conversion rate from the overall score
  // Score 0-100 maps roughly to 0.5%-5% conversion rate
  const currentEstimatedConversionRate = Math.max(
    0.5,
    (results.overallScore / 100) * 4.5 + 0.5
  );

  // Sum up all potential conversion lifts from findings
  const totalPotentialLift = results.findings.reduce(
    (sum, f) => sum + (f.estimatedConversionLift || 0),
    0
  );

  const potentialConversionRate = Math.min(
    currentEstimatedConversionRate + totalPotentialLift,
    15 // cap at 15%
  );

  const currentMonthlyRevenue =
    monthlyTraffic * (currentEstimatedConversionRate / 100) * avgOrderValue;
  const potentialMonthlyRevenue =
    monthlyTraffic * (potentialConversionRate / 100) * avgOrderValue;
  const monthlyRevenueGap = potentialMonthlyRevenue - currentMonthlyRevenue;

  // Build top costly issues
  const topCostlyIssues = results.findings
    .filter((f) => f.estimatedConversionLift && f.estimatedConversionLift > 0)
    .map((f) => ({
      findingId: f.id,
      title: f.title,
      conversionLift: f.estimatedConversionLift!,
      estimatedMonthlyLoss:
        monthlyTraffic * (f.estimatedConversionLift! / 100) * avgOrderValue,
    }))
    .sort((a, b) => b.estimatedMonthlyLoss - a.estimatedMonthlyLoss)
    .slice(0, 5);

  return {
    monthlyTraffic,
    avgOrderValue,
    currentEstimatedConversionRate: Math.round(currentEstimatedConversionRate * 100) / 100,
    potentialConversionRate: Math.round(potentialConversionRate * 100) / 100,
    currentMonthlyRevenue: Math.round(currentMonthlyRevenue),
    potentialMonthlyRevenue: Math.round(potentialMonthlyRevenue),
    monthlyRevenueGap: Math.round(monthlyRevenueGap),
    annualRevenueGap: Math.round(monthlyRevenueGap * 12),
    topCostlyIssues,
  };
}
