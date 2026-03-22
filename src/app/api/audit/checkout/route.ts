import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/tiers";
import { deductCredit } from "@/lib/credits";
import { runCheckoutAudit } from "@/lib/claude";
import { scrapeUrl } from "@/lib/scraper";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const rateLimitKey = user?.id || request.headers.get("x-forwarded-for") || "anonymous";
    if (!rateLimit(rateLimitKey, 5, 60000)) {
      return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
    }

    const body = await request.json();
    const { url, context } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Please provide a checkout URL." }, { status: 400 });
    }

    let userId: string | null = null;
    let auditType: "free" | "full" = "free";

    if (user) {
      userId = user.id;
      const tier = await getUserTier(user.id);
      if (tier !== "free") {
        const success = await deductCredit(user.id);
        if (!success) {
          return NextResponse.json({ error: "Insufficient credits.", balance: 0 }, { status: 402 });
        }
        auditType = "full";
      }
    }

    const admin = createAdminClient();
    const { data: audit, error: insertError } = await admin.from("audits").insert({
      url,
      email: user?.email || "anonymous",
      audit_type: auditType,
      status: "pending",
      user_id: userId,
      expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    }).select("id").single();

    if (insertError || !audit) {
      return NextResponse.json({ error: "Failed to create audit record." }, { status: 500 });
    }

    // Scrape
    const scrapedData = await scrapeUrl(url);
    await admin.from("audits").update({ status: "processing", scraped_data: scrapedData }).eq("id", audit.id);

    // Run checkout audit
    const results = await runCheckoutAudit(scrapedData, context);

    await admin.from("audits").update({
      status: "completed",
      results,
      overall_score: results.overallScore,
    }).eq("id", audit.id);

    return NextResponse.json({ auditId: audit.id, results });
  } catch (error) {
    console.error("Checkout audit error:", error);
    return NextResponse.json({ error: "Audit failed. Please try again." }, { status: 500 });
  }
}
