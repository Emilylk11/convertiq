import Anthropic from "@anthropic-ai/sdk";
import type { ScrapedPageData, AuditResults } from "./types";
import {
  LANDING_PAGE_AUDIT_SYSTEM_PROMPT,
  buildAuditUserMessage,
} from "./prompts/landing-page-audit";

export interface AuditContext {
  trafficType?: string;
  industry?: string;
  audience?: string;
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
    max_tokens: 4096,
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

  return parsed;
}
