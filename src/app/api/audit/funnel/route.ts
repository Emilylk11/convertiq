import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { authenticateAndRateLimit } from "@/lib/audit-helpers";
import { runFunnelAudit } from "@/lib/claude";
import { scrapeUrl } from "@/lib/scraper";

// Allow up to 300s for scraping multiple URLs + Claude analysis (Vercel Pro)
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    let auth;
    try {
      auth = await authenticateAndRateLimit(request, {
        maxRequests: 3,
        creditCost: 2,
        requireAuth: true,
        requirePaid: true,
      });
    } catch (authError) {
      console.error("Funnel auth/credit error:", authError instanceof Error ? authError.message : authError);
      return NextResponse.json(
        { error: authError instanceof Error ? authError.message : "Authentication failed. Please try again." },
        { status: 500 }
      );
    }
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

    // Create audit record immediately
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

    // Process everything INLINE (no after()) — we have 300s on Vercel Pro
    try {
      // Scrape all URL stages in parallel for speed
      const processedStages = await Promise.all(
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
                content: `URL: ${stage.content} (could not be scraped — site may block automated access)`,
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

      // Run funnel audit via Claude
      const results = await runFunnelAudit(processedStages, auditContext);

      await admin
        .from("audits")
        .update({
          status: "completed",
          results,
          overall_score: results.overallScore,
        })
        .eq("id", audit.id);
    } catch (processingError) {
      const message = processingError instanceof Error ? processingError.message : String(processingError);
      console.error("Funnel processing error:", message);

      await admin
        .from("audits")
        .update({
          status: "failed",
          error_message: message.substring(0, 500),
        })
        .eq("id", audit.id);
    }

    // Return the auditId — client redirects to /audit/[id] which shows results or error
    return NextResponse.json({ auditId: audit.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Funnel audit error:", message);
    return NextResponse.json(
      { error: "Audit failed. Please try again." },
      { status: 500 }
    );
  }
}
