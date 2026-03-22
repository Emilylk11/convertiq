import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/tiers";
import { deductCredit } from "@/lib/credits";
import { runFunnelAudit } from "@/lib/claude";
import { scrapeUrl } from "@/lib/scraper";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const rateLimitKey = user?.id || request.headers.get("x-forwarded-for") || "anonymous";
    const rl = rateLimit(rateLimitKey, 3, 60000);
    if (!rl.allowed) {
      const waitSec = Math.ceil(rl.retryAfterMs / 1000);
      return NextResponse.json(
        { error: `Too many requests. Please wait ${waitSec} seconds.` },
        { status: 429, headers: { "Retry-After": String(waitSec) } }
      );
    }

    const body = await request.json();
    const { stages, context } = body;

    // stages: [{ type: "url" | "text", stageName: string, content: string }]
    if (!stages || !Array.isArray(stages) || stages.length < 2 || stages.length > 5) {
      return NextResponse.json({ error: "Provide 2-5 funnel stages." }, { status: 400 });
    }

    // Auth — funnel audit requires login + credits (costs 2 credits)
    if (!user) {
      return NextResponse.json({ error: "Please sign in to use funnel audit." }, { status: 401 });
    }

    const tier = await getUserTier(user.id);
    if (tier === "free") {
      return NextResponse.json({ error: "Upgrade to use funnel audit." }, { status: 403 });
    }

    // Deduct 2 credits atomically for funnel audit
    const success = await deductCredit(user.id, 2);
    if (!success) {
      return NextResponse.json({ error: "Insufficient credits. Funnel audit costs 2 credits." }, { status: 402 });
    }

    const admin = createAdminClient();
    const { data: audit, error: insertError } = await admin.from("audits").insert({
      url: "funnel-audit",
      email: user.email || "",
      audit_type: "full",
      status: "processing",
      user_id: user.id,
      expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    }).select("id").single();

    if (insertError || !audit) {
      return NextResponse.json({ error: "Failed to create audit record." }, { status: 500 });
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
    await admin.from("audits").update({ scraped_data: { stages: processedStages } }).eq("id", audit.id);

    // Run funnel audit
    const results = await runFunnelAudit(processedStages, context);

    await admin.from("audits").update({
      status: "completed",
      results,
      overall_score: results.overallScore,
    }).eq("id", audit.id);

    return NextResponse.json({ auditId: audit.id, results });
  } catch (error) {
    console.error("Funnel audit error:", error);
    return NextResponse.json({ error: "Audit failed. Please try again." }, { status: 500 });
  }
}
