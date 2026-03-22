import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { authenticateAndRateLimit } from "@/lib/audit-helpers";
import { runFunnelAudit } from "@/lib/claude";
import { scrapeUrl } from "@/lib/scraper";

// Funnel audits scrape multiple URLs + run Claude — need more time
export const maxDuration = 120; // seconds (requires Vercel Pro for >60s)

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateAndRateLimit(request, {
      maxRequests: 3,
      creditCost: 2,
      requireAuth: true,
      requirePaid: true,
    });
    if (!auth.ok) return auth.response;
    const { context } = auth;

    const body = await request.json();
    const { stages, context: auditContext } = body;

    if (!stages || !Array.isArray(stages) || stages.length < 2 || stages.length > 5) {
      return NextResponse.json(
        { error: "Provide 2-5 funnel stages." },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const { data: audit, error: insertError } = await admin
      .from("audits")
      .insert({
        url: "funnel-audit",
        email: context.user?.email || "",
        audit_type: "full",
        status: "processing",
        user_id: context.userId,
        expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select("id")
      .single();

    if (insertError || !audit) {
      return NextResponse.json(
        { error: "Failed to create audit record." },
        { status: 500 }
      );
    }

    // Process stages — scrape URLs in parallel, keep text as-is
    const processedStages: Array<{ stageName: string; content: string }> = await Promise.all(
      stages.map(async (stage: { type: string; content: string; stageName: string }) => {
        if (stage.type === "url" && stage.content) {
          try {
            const scraped = await scrapeUrl(stage.content);
            return {
              stageName: stage.stageName,
              content: `URL: ${stage.content}\nTitle: ${scraped.title}\nHeadings: ${scraped.headings.map((h: { level: number; text: string }) => h.text).join(", ")}\nCTAs: ${scraped.ctas.map((c: { text: string }) => c.text).join(", ")}\nContent: ${scraped.textContent.substring(0, 1500)}`,
            };
          } catch {
            return {
              stageName: stage.stageName,
              content: `URL: ${stage.content} (could not be scraped — site may be blocking automated requests)`,
            };
          }
        }
        return {
          stageName: stage.stageName,
          content: stage.content.substring(0, 3000),
        };
      })
    );

    // Store scraped data
    await admin
      .from("audits")
      .update({ scraped_data: { stages: processedStages } })
      .eq("id", audit.id);

    // Run funnel audit
    const results = await runFunnelAudit(processedStages, auditContext);

    await admin
      .from("audits")
      .update({
        status: "completed",
        results,
        overall_score: results.overallScore,
      })
      .eq("id", audit.id);

    return NextResponse.json({ auditId: audit.id, results });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : "";
    console.error("Funnel audit error:", message, stack);

    let userError = "Audit failed. Please try again.";
    if (message.includes("timeout") || message.includes("Timeout") || message.includes("FUNCTION_INVOCATION_TIMEOUT")) {
      userError = "Audit timed out — try using fewer stages or paste text instead of URLs.";
    } else if (message.includes("JSON") || message.includes("parse")) {
      userError = "AI analysis returned invalid results. Please try again.";
    } else if (message.includes("credit") || message.includes("balance")) {
      userError = "Credit deduction failed. Your credits were not charged.";
    }

    // Try to mark the audit as failed if we created one
    try {
      const admin = createAdminClient();
      // Find the most recent processing funnel audit for this request
      // (best-effort cleanup)
      await admin
        .from("audits")
        .update({ status: "failed", error_message: message.substring(0, 500) })
        .eq("url", "funnel-audit")
        .eq("status", "processing")
        .order("created_at", { ascending: false })
        .limit(1);
    } catch {
      // Non-blocking
    }

    return NextResponse.json(
      { error: userError },
      { status: 500 }
    );
  }
}
