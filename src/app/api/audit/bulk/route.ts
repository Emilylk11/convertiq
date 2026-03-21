import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { scrapeUrl } from "@/lib/scraper";
import { runLandingPageAudit } from "@/lib/claude";
import { getUserTier } from "@/lib/tiers";
import { deductCredit } from "@/lib/credits";

export async function POST(request: NextRequest) {
  try {
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const tier = await getUserTier(user.id);
    if (tier !== "agency") {
      return NextResponse.json(
        { error: "Bulk audit requires the Agency plan" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { urls, context } = body as {
      urls?: string[];
      context?: { trafficType?: string; industry?: string; audience?: string };
    };

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: "At least one URL is required" }, { status: 400 });
    }

    if (urls.length > 10) {
      return NextResponse.json({ error: "Maximum 10 URLs per batch" }, { status: 400 });
    }

    // Validate all URLs
    const validUrls: string[] = [];
    for (const rawUrl of urls) {
      try {
        const u = new URL(rawUrl.trim());
        if (!["http:", "https:"].includes(u.protocol)) throw new Error();
        validUrls.push(u.toString());
      } catch {
        return NextResponse.json({ error: `Invalid URL: ${rawUrl}` }, { status: 400 });
      }
    }

    // Deduct credits (1 per URL)
    for (let i = 0; i < validUrls.length; i++) {
      const success = await deductCredit(user.id);
      if (!success) {
        return NextResponse.json(
          {
            error: `Insufficient credits. You need ${validUrls.length} credits but only have ${i} remaining.`,
          },
          { status: 402 }
        );
      }
    }

    const supabase = createAdminClient();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);
    const batchId = crypto.randomUUID();

    // Create all audit records
    const inserts = await Promise.all(
      validUrls.map((url) =>
        supabase
          .from("audits")
          .insert({
            url,
            email: user.email,
            user_id: user.id,
            audit_type: "full",
            status: "pending",
            expires_at: expiresAt.toISOString(),
          })
          .select("id")
          .single()
      )
    );

    const auditIds: string[] = [];
    for (const insert of inserts) {
      if (insert.error || !insert.data) {
        return NextResponse.json({ error: "Failed to create audit records" }, { status: 500 });
      }
      auditIds.push(insert.data.id);
    }

    // Process each URL sequentially to avoid overloading APIs
    const results: {
      auditId: string;
      url: string;
      status: "completed" | "failed";
      score: number | null;
      error?: string;
    }[] = [];

    for (let i = 0; i < validUrls.length; i++) {
      const url = validUrls[i];
      const auditId = auditIds[i];

      try {
        // Scrape
        const scrapedData = await scrapeUrl(url);
        await supabase
          .from("audits")
          .update({ scraped_data: scrapedData, status: "processing" })
          .eq("id", auditId);

        // Run AI audit
        const auditResults = await runLandingPageAudit(scrapedData, context);
        await supabase
          .from("audits")
          .update({
            results: auditResults,
            overall_score: auditResults.overallScore,
            status: "completed",
          })
          .eq("id", auditId);

        results.push({
          auditId,
          url,
          status: "completed",
          score: auditResults.overallScore,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Processing failed";
        await supabase
          .from("audits")
          .update({ status: "failed", error_message: msg })
          .eq("id", auditId);

        results.push({
          auditId,
          url,
          status: "failed",
          score: null,
          error: msg,
        });
      }
    }

    return NextResponse.json(
      {
        batchId,
        totalUrls: validUrls.length,
        completed: results.filter((r) => r.status === "completed").length,
        failed: results.filter((r) => r.status === "failed").length,
        results,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Bulk audit route error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
