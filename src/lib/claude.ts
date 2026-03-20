import Anthropic from "@anthropic-ai/sdk";
import type { ScrapedPageData, AuditResults } from "./types";
import {
  LANDING_PAGE_AUDIT_SYSTEM_PROMPT,
  buildAuditUserMessage,
} from "./prompts/landing-page-audit";

export async function runLandingPageAudit(
  scrapedData: ScrapedPageData
): Promise<AuditResults> {
  const anthropic = new Anthropic();

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    temperature: 0.3,
    system: LANDING_PAGE_AUDIT_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildAuditUserMessage(scrapedData),
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  const parsed = JSON.parse(textBlock.text) as AuditResults;

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
