import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { auditId, rating, comment } = (await request.json()) as {
      auditId?: string;
      rating?: number;
      comment?: string;
    };

    if (!auditId || !rating) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Get user if logged in
    let userId: string | null = null;
    let userEmail: string | null = null;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
        userEmail = user.email || null;
      }
    } catch {
      // Anonymous feedback is fine
    }

    const admin = createAdminClient();

    // Store feedback — using credit_transactions table format for simplicity
    // In production you'd have a dedicated feedback table
    await admin.from("feedback").insert({
      audit_id: auditId,
      user_id: userId,
      user_email: userEmail,
      rating,
      comment: comment || null,
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    // Don't fail — feedback is non-critical
    console.error("Feedback error:", error);
    return NextResponse.json({ received: true });
  }
}
