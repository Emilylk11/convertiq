import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { scrapeUrl } from "@/lib/scraper";
import { runLandingPageAudit } from "@/lib/claude";
import { getUserTier } from "@/lib/tiers";
import { deductCredit } from "@/lib/credits";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Rate limit
    const rl = rateLimit(
      `compare:${user.id}`,
      RATE_LIMITS.compare.maxRequests,
      RATE_LIMITS.compare.windowMs
    );
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    const tier = await getUserTier(user.id);
    if (tier !== "growth" && tier !== "agency") {
      return NextResponse.json(
        { error: "Competitor comparison requires Growth or Agency plan" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { yourUrl, competitorUrl, context } = body as {
      yourUrl?: string;
      competitorUrl?: string;
      context?: { trafficType?: string; industry?: string; audience?: string };
    };

    if (!yourUrl || !competitorUrl) {
      return NextResponse.json(
        { error: "Both your URL and competitor URL are required" },
        { status: 400 }
      );
    }

    // Validate URLs
    for (const rawUrl of [yourUrl, competitorUrl]) {
      try {
        const u = new URL(rawUrl);
        if (!["http:", "https:"].includes(u.protocol)) throw new Error();
      } catch {
        return NextResponse.json(
          { error: `Invalid URL: ${rawUrl}` },
          { status: 400 }
        );
      }
    }

    // Deduct 2 credits atomically (single operation, no partial deductions)
    const hasCredits = await deductCredit(user.id, 2);
    if (!hasCredits) {
      return NextResponse.json(
        { error: "Insufficient credits. Each comparison uses 2 credits." },
        { status: 402 }
      );
    }

    const supabase = createAdminClient();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);

    // Create both audit records
    const [yourInsert, compInsert] = await Promise.all([
      supabase
        .from("audits")
        .insert({
          url: yourUrl,
          email: user.email,
          user_id: user.id,
          audit_type: "full",
          status: "pending",
          expires_at: expiresAt.toISOString(),
        })
        .select("id")
        .single(),
      supabase
        .from("audits")
        .insert({
          url: competitorUrl,
          email: user.email,
          user_id: user.id,
          audit_type: "full",
          status: "pending",
          expires_at: expiresAt.toISOString(),
        })
        .select("id")
        .single(),
    ]);

    if (yourInsert.error || !yourInsert.data || compInsert.error || !compInsert.data) {
      return NextResponse.json({ error: "Failed to create audit records" }, { status: 500 });
    }

    const yourAuditId = yourInsert.data.id;
    const compAuditId = compInsert.data.id;

    // Scrape both URLs in parallel
    let yourScraped, compScraped;
    try {
      [yourScraped, compScraped] = await Promise.all([
        scrapeUrl(yourUrl),
        scrapeUrl(competitorUrl),
      ]);

      await Promise.all([
        supabase
          .from("audits")
          .update({ scraped_data: yourScraped, status: "processing" })
          .eq("id", yourAuditId),
        supabase
          .from("audits")
          .update({ scraped_data: compScraped, status: "processing" })
          .eq("id", compAuditId),
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to scrape URL";
      await Promise.all([
        supabase.from("audits").update({ status: "failed", error_message: msg }).eq("id", yourAuditId),
        supabase.from("audits").update({ status: "failed", error_message: msg }).eq("id", compAuditId),
      ]);
      return NextResponse.json({ error: `Could not scrape: ${msg}` }, { status: 422 });
    }

    // Run AI audits in parallel
    let yourResults, compResults;
    try {
      [yourResults, compResults] = await Promise.all([
        runLandingPageAudit(yourScraped, context),
        runLandingPageAudit(compScraped, context),
      ]);

      await Promise.all([
        supabase
          .from("audits")
          .update({ results: yourResults, overall_score: yourResults.overallScore, status: "completed" })
          .eq("id", yourAuditId),
        supabase
          .from("audits")
          .update({ results: compResults, overall_score: compResults.overallScore, status: "completed" })
          .eq("id", compAuditId),
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "AI analysis failed";
      await Promise.all([
        supabase.from("audits").update({ status: "failed", error_message: msg }).eq("id", yourAuditId),
        supabase.from("audits").update({ status: "failed", error_message: msg }).eq("id", compAuditId),
      ]);
      return NextResponse.json({ error: "AI analysis failed. Please try again." }, { status: 500 });
    }

    return NextResponse.json(
      {
        yourAuditId,
        competitorAuditId: compAuditId,
        comparison: {
          yourUrl,
          competitorUrl,
          yourScore: yourResults.overallScore,
          competitorScore: compResults.overallScore,
          yourCategories: yourResults.categoryScores,
          competitorCategories: compResults.categoryScores,
          yourSummary: yourResults.summary,
          competitorSummary: compResults.summary,
          yourFindingsCount: yourResults.findings.length,
          competitorFindingsCount: compResults.findings.length,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Compare route error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
