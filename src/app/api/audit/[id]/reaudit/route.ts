import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { scrapeUrl } from "@/lib/scraper";
import { runLandingPageAudit } from "@/lib/claude";
import type { AuditRecord } from "@/lib/types";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = createAdminClient();

  // Fetch original audit
  const { data: original, error: fetchError } = await supabase
    .from("audits")
    .select("url, email, audit_type")
    .eq("id", id)
    .single();

  if (fetchError || !original) {
    return NextResponse.json(
      { error: "Original audit not found" },
      { status: 404 }
    );
  }

  const record = original as Pick<AuditRecord, "url" | "email" | "audit_type">;

  // Create a new audit record
  const { data: newAudit, error: insertError } = await supabase
    .from("audits")
    .insert({
      url: record.url,
      email: record.email,
      audit_type: record.audit_type,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !newAudit) {
    return NextResponse.json(
      { error: "Failed to create re-audit" },
      { status: 500 }
    );
  }

  // Run audit asynchronously (fire and forget) so we can redirect immediately
  (async () => {
    try {
      const scrapedData = await scrapeUrl(record.url);

      await supabase
        .from("audits")
        .update({ scraped_data: scrapedData, status: "processing" })
        .eq("id", newAudit.id);

      const results = await runLandingPageAudit(scrapedData);

      await supabase
        .from("audits")
        .update({
          results,
          overall_score: results.overallScore,
          status: "completed",
        })
        .eq("id", newAudit.id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Re-audit failed";
      await supabase
        .from("audits")
        .update({ status: "failed", error_message: message })
        .eq("id", newAudit.id);
    }
  })();

  return NextResponse.json({ auditId: newAudit.id }, { status: 201 });
}
