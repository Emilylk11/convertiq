import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { scrapeUrl } from "@/lib/scraper";
import { runLandingPageAudit } from "@/lib/claude";
import { getUserTier, canReaudit } from "@/lib/tiers";
import { deductCredit } from "@/lib/credits";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import type { AuditRecord } from "@/lib/types";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1. Require authentication
  let userId: string;
  try {
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to re-audit." },
        { status: 401 }
      );
    }
    userId = user.id;
  } catch {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  // 2. Rate limit
  const rl = rateLimit(
    `reaudit:${userId}`,
    RATE_LIMITS.reaudit.maxRequests,
    RATE_LIMITS.reaudit.windowMs
  );
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment before trying again." },
      { status: 429 }
    );
  }

  // 3. Check tier — re-audit requires Starter+
  const tier = await getUserTier(userId);
  if (!canReaudit(tier)) {
    return NextResponse.json(
      {
        error:
          "Re-audit requires a Starter plan or above. Purchase credits to unlock this feature.",
      },
      { status: 403 }
    );
  }

  const supabase = createAdminClient();

  // 4. Fetch original audit and verify ownership
  const { data: original, error: fetchError } = await supabase
    .from("audits")
    .select("url, email, audit_type, user_id")
    .eq("id", id)
    .single();

  if (fetchError || !original) {
    return NextResponse.json(
      { error: "Original audit not found" },
      { status: 404 }
    );
  }

  const record = original as Pick<
    AuditRecord,
    "url" | "email" | "audit_type"
  > & { user_id: string | null };

  // Verify the user owns this audit
  if (!record.user_id || record.user_id !== userId) {
    return NextResponse.json(
      { error: "You do not have permission to re-audit this report" },
      { status: 403 }
    );
  }

  // 5. Deduct 1 credit
  const hasCredit = await deductCredit(userId);
  if (!hasCredit) {
    return NextResponse.json(
      { error: "Insufficient credits. Please purchase more credits." },
      { status: 402 }
    );
  }

  // 6. Create a new audit record (expires 90 days from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 90);

  const { data: newAudit, error: insertError } = await supabase
    .from("audits")
    .insert({
      url: record.url,
      email: record.email,
      audit_type: "full",
      user_id: userId,
      status: "pending",
      expires_at: expiresAt.toISOString(),
    })
    .select("id")
    .single();

  if (insertError || !newAudit) {
    return NextResponse.json(
      { error: "Failed to create re-audit" },
      { status: 500 }
    );
  }

  // 7. Run audit asynchronously (fire and forget) so we can redirect immediately
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
