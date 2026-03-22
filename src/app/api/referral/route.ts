import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateReferralCode, getReferralStats } from "@/lib/referrals";

// GET — get user's referral code and stats
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const code = await getOrCreateReferralCode(user.id);
    const stats = await getReferralStats(user.id);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return NextResponse.json({
      code,
      referralLink: `${appUrl}/?ref=${code}`,
      stats: {
        totalReferrals: stats.totalReferrals,
        totalConversions: stats.totalConversions,
        totalCreditsEarned: stats.totalCreditsEarned,
      },
      referrals: stats.referrals,
    });
  } catch (error) {
    console.error("Referral API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch referral data" },
      { status: 500 }
    );
  }
}
