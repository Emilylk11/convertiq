import Anthropic from "@anthropic-ai/sdk";
import type { ScrapedPageData, AuditResults, RevenueImpact } from "./types";
import {
  LANDING_PAGE_AUDIT_SYSTEM_PROMPT,
  buildAuditUserMessage,
} from "./prompts/landing-page-audit";

export interface AuditContext {
  trafficType?: string;
  industry?: string;
  audience?: string;
  monthlyTraffic?: number;
  avgOrderValue?: number;
}

export async function runLandingPageAudit(
  scrapedData: ScrapedPageData,
  context?: AuditContext
): Promise<AuditResults> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Check your .env.local file."
    );
  }
  const anthropic = new Anthropic({ apiKey });

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 6000,
    temperature: 0.3,
    system: LANDING_PAGE_AUDIT_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildAuditUserMessage(scrapedData, context),
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
