import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/tiers";
import { deductCredit } from "@/lib/credits";
import { runEmailAudit } from "@/lib/claude";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const rateLimitKey = user?.id || request.headers.get("x-forwarded-for") || "anonymous";
    if (!rateLimit(rateLimitKey, 5, 60000)) {
      return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
    }

    const body = await request.json();
    const { emailContent, context } = body;

    if (!emailContent || typeof emailContent !== "string" || emailContent.trim().length < 20) {
      return NextResponse.json({ error: "Please provide email content (at least 20 characters)." }, { status: 400 });
    }

    // Auth & credits
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

    // Create audit record
    const admin = createAdminClient();
    const { data: audit, error: insertError } = await admin.from("audits").insert({
      url: "email-audit",
      email: user?.email || "anonymous",
      audit_type: auditType,
      status: "processing",
      scraped_data: { emailContent: emailContent.substring(0, 5000) },
      user_id: userId,
      expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    }).select("id").single();

    if (insertError || !audit) {
      return NextResponse.json({ error: "Failed to create audit record." }, { status: 500 });
    }

    // Run audit
    const results = await runEmailAudit(emailContent.substring(0, 5000), context);

    // Store results
    await admin.from("audits").update({
      status: "completed",
      results,
      overall_score: results.overallScore,
    }).eq("id", audit.id);

    return NextResponse.json({ auditId: audit.id, results });
  } catch (error) {
    console.error("Email audit error:", error);
    return NextResponse.json({ error: "Audit failed. Please try again." }, { status: 500 });
  }
}
