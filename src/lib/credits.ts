import { createAdminClient } from "@/lib/supabase/server";

/**
 * Get the credit balance for a user. Creates a credits row if none exists.
 */
export async function getCreditBalance(userId: string): Promise<number> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("credits")
    .select("balance")
    .eq("user_id", userId)
    .single();

  if (error && error.code === "PGRST116") {
    // Row not found — create one with 0 balance
    await supabase.from("credits").insert({ user_id: userId, balance: 0 });
    return 0;
  }

  if (error) {
    console.error("Error fetching credits:", error);
    return 0;
  }

  return data.balance;
}

/**
 * Add credits to a user's balance (used after successful payment).
 * Uses an atomic DB function to prevent race conditions.
 */
export async function addCredits(
  userId: string,
  amount: number
): Promise<number> {
  const supabase = createAdminClient();

  // Try atomic RPC first
  const { data, error } = await supabase.rpc("add_credits", {
    p_user_id: userId,
    p_amount: amount,
  });

  if (!error && data !== null) {
    return data as number;
  }

  // Fallback: ensure credits row exists, then update
  console.warn("add_credits RPC not available, using fallback:", error?.message);
  const currentBalance = await getCreditBalance(userId);

  const { data: updated, error: updateError } = await supabase
    .from("credits")
    .update({ balance: currentBalance + amount })
    .eq("user_id", userId)
    .select("balance")
    .single();

  if (updateError) {
    console.error("Error adding credits:", updateError);
    throw new Error("Failed to add credits");
  }

  return updated.balance;
}

/**
 * Atomically deduct credits from a user's balance.
 * Returns false if insufficient credits. Uses a DB-level lock to prevent race conditions.
 *
 * @param userId - The user to deduct from
 * @param amount - Number of credits to deduct (default: 1)
 */
export async function deductCredit(
  userId: string,
  amount: number = 1
): Promise<boolean> {
  const supabase = createAdminClient();

  // Atomic RPC — does SELECT FOR UPDATE + check + deduct in one transaction
  const { data, error } = await supabase.rpc("deduct_credits", {
    p_user_id: userId,
    p_amount: amount,
  });

  if (!error && data !== null) {
    // RPC returns -1 if insufficient or no row; >= 0 means success (new balance)
    return (data as number) >= 0;
  }

  // If RPC doesn't exist, fail safely rather than use a non-atomic fallback
  console.error("deduct_credits RPC failed:", error?.message);
  throw new Error(
    "Credit deduction service unavailable. Please try again in a moment."
  );
}
