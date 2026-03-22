import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { authenticateAndRateLimit } from "@/lib/audit-helpers";
import { runFunnelAudit } from "@/lib/claude";
import { scrapeUrl } from "@/lib/scraper";

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

    // Process stages — scrape URLs, keep text as-is
    const processedStages: Array<{ stageName: string; content: string }> = [];

    for (const stage of stages) {
      if (stage.type === "url" && stage.content) {
        try {
          const scraped = await scrapeUrl(stage.content);
          processedStages.push({
            stageName: stage.stageName,
            content: `URL: ${stage.content}\nTitle: ${scraped.title}\nHeadings: ${scraped.headings.map((h: { level: number; text: string }) => h.text).join(", ")}\nCTAs: ${scraped.ctas.map((c: { text: string }) => c.text).join(", ")}\nContent: ${scraped.textContent.substring(0, 2000)}`,
          });
        } catch {
          processedStages.push({
            stageName: stage.stageName,
            content: `URL: ${stage.content} (could not be scraped)`,
          });
        }
      } else {
        processedStages.push({
          stageName: stage.stageName,
          content: stage.content.substring(0, 3000),
        });
      }
    }

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
    console.error("Funnel audit error:", error);
    return NextResponse.json(
      { error: "Audit failed. Please try again." },
      { status: 500 }
    );
  }
}
