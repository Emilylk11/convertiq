import { createAdminClient } from "@/lib/supabase/server";
import { addCredits } from "@/lib/credits";

// Reward amounts
const REFERRER_REWARD = 2; // Referrer gets 2 free credits
const REFERRED_REWARD = 1; // New user gets 1 free credit

/**
 * Generate a unique 8-char referral code
 */
function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1 to avoid confusion
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * Get or create a referral code for a user
 */
export async function getOrCreateReferralCode(userId: string): Promise<string> {
  const supabase = createAdminClient();

  // Check if user already has a code
  const { data: existing } = await supabase
    .from("referral_codes")
    .select("code")
    .eq("user_id", userId)
    .single();

  if (existing?.code) return existing.code;

  // Generate a unique code (retry up to 5 times for collisions)
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode();
    const { error } = await supabase
      .from("referral_codes")
      .insert({ user_id: userId, code });

    if (!error) return code;
    // If unique constraint violation, try again
    if (error.code !== "23505") throw error;
  }

  throw new Error("Failed to generate unique referral code");
}

/**
 * Get referral stats for a user
 */
export async function getReferralStats(userId: string) {
  const supabase = createAdminClient();

  const { data: codeData } = await supabase
    .from("referral_codes")
    .select("code, total_referrals, total_conversions, total_credits_earned")
    .eq("user_id", userId)
    .single();

  const { data: referrals } = await supabase
    .from("referrals")
    .select("id, referred_email, status, referrer_credits_awarded, created_at, converted_at")
    .eq("referrer_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  return {
    code: codeData?.code || null,
    totalReferrals: codeData?.total_referrals || 0,
    totalConversions: codeData?.total_conversions || 0,
    totalCreditsEarned: codeData?.total_credits_earned || 0,
    referrals: referrals || [],
  };
}

/**
 * Track a referral signup — called when a new user signs up with a referral code
 */
export async function trackReferralSignup(
  referralCode: string,
  newUserId: string,
  newUserEmail: string
): Promise<{ success: boolean; referrerId?: string }> {
  const supabase = createAdminClient();

  // Look up the referral code
  const { data: codeData } = await supabase
    .from("referral_codes")
    .select("user_id")
    .eq("code", referralCode.toUpperCase())
    .single();

  if (!codeData) return { success: false };

  // Don't allow self-referral
  if (codeData.user_id === newUserId) return { success: false };

  // Check if this user was already referred
  const { data: existingRef } = await supabase
    .from("referrals")
    .select("id")
    .eq("referred_user_id", newUserId)
    .single();

  if (existingRef) return { success: false }; // Already referred

  // Create referral record
  await supabase.from("referrals").insert({
    referrer_id: codeData.user_id,
    referral_code: referralCode.toUpperCase(),
    referred_user_id: newUserId,
    referred_email: newUserEmail,
    status: "signed_up",
  });

  // Update referral code stats
  await supabase
    .from("referral_codes")
    .update({
      total_referrals: (await supabase
        .from("referrals")
        .select("id", { count: "exact" })
        .eq("referral_code", referralCode.toUpperCase())).count || 0,
    })
    .eq("code", referralCode.toUpperCase());

  // Give the new user their welcome credit
  await addCredits(newUserId, REFERRED_REWARD);

  // Log the transaction
  await supabase.from("credit_transactions").insert({
    user_id: newUserId,
    amount: REFERRED_REWARD,
    type: "purchase",
    source: "referral_bonus",
  });

  return { success: true, referrerId: codeData.user_id };
}

/**
 * Reward the referrer when the referred user makes their first purchase
 */
export async function rewardReferrerOnConversion(purchasingUserId: string): Promise<void> {
  const supabase = createAdminClient();

  // Find the referral record for this user
  const { data: referral } = await supabase
    .from("referrals")
    .select("id, referrer_id, referral_code, status")
    .eq("referred_user_id", purchasingUserId)
    .in("status", ["signed_up"])
    .single();

  if (!referral) return; // No referral or already rewarded

  // Award credits to referrer
  await addCredits(referral.referrer_id, REFERRER_REWARD);

  // Log the transaction
  await supabase.from("credit_transactions").insert({
    user_id: referral.referrer_id,
    amount: REFERRER_REWARD,
    type: "purchase",
    source: "referral_reward",
  });

  // Update referral status
  await supabase
    .from("referrals")
    .update({
      status: "rewarded",
      referrer_credits_awarded: REFERRER_REWARD,
      converted_at: new Date().toISOString(),
      rewarded_at: new Date().toISOString(),
    })
    .eq("id", referral.id);

  // Update referral code stats
  await supabase
    .from("referral_codes")
    .update({
      total_conversions: (await supabase
        .from("referrals")
        .select("id", { count: "exact" })
        .eq("referral_code", referral.referral_code)
        .eq("status", "rewarded")).count || 0,
      total_credits_earned: (await supabase.rpc("sum_referral_credits", {
        p_code: referral.referral_code,
      }).then(r => r.data)) || REFERRER_REWARD,
    })
    .eq("code", referral.referral_code);
}

export { REFERRER_REWARD, REFERRED_REWARD };
