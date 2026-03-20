import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { scrapeUrl } from "@/lib/scraper";
import { runLandingPageAudit } from "@/lib/claude";
import { sendAuditEmail } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, email } = body as { url?: string; email?: string };

    // Validate input
    if (!url || !email) {
      return NextResponse.json(
        { error: "URL and email are required" },
        { status: 400 }
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      return NextResponse.json(
        { error: "Please enter a valid URL (including https://)" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Create audit record
    const { data: audit, error: insertError } = await supabase
      .from("audits")
      .insert({
        url: parsedUrl.toString(),
        email,
        audit_type: "free",
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError || !audit) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create audit" },
        { status: 500 }
      );
    }

    // Scrape the URL
    let scrapedData;
    try {
      scrapedData = await scrapeUrl(parsedUrl.toString());

      await supabase
        .from("audits")
        .update({ scraped_data: scrapedData, status: "processing" })
        .eq("id", audit.id);
    } catch (scrapeError) {
      const message =
        scrapeError instanceof Error
          ? scrapeError.message
          : "Failed to scrape URL";

      await supabase
        .from("audits")
        .update({ status: "failed", error_message: message })
        .eq("id", audit.id);

      return NextResponse.json(
        { error: `Could not access that URL: ${message}` },
        { status: 422 }
      );
    }

    // Run Claude audit
    let results;
    try {
      results = await runLandingPageAudit(scrapedData);

      await supabase
        .from("audits")
        .update({
          results,
          overall_score: results.overallScore,
          status: "completed",
        })
        .eq("id", audit.id);
    } catch (auditError) {
      const message =
        auditError instanceof Error
          ? auditError.message
          : "Audit analysis failed";

      await supabase
        .from("audits")
        .update({ status: "failed", error_message: message })
        .eq("id", audit.id);

      return NextResponse.json(
        { error: "AI analysis failed. Please try again." },
        { status: 500 }
      );
    }

    // Send email (non-blocking — don't fail the request if email fails)
    try {
      await sendAuditEmail({
        to: email,
        auditId: audit.id,
        url: parsedUrl.toString(),
        results,
      });
    } catch (emailError) {
      console.error("Email send failed:", emailError);
    }

    return NextResponse.json({ auditId: audit.id }, { status: 201 });
  } catch (error) {
    console.error("Audit route error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
