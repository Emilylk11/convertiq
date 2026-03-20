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
 */
export async function addCredits(
  userId: string,
  amount: number
): Promise<number> {
  const supabase = createAdminClient();

  // Ensure credits row exists
  const currentBalance = await getCreditBalance(userId);

  const { data, error } = await supabase
    .from("credits")
    .update({ balance: currentBalance + amount })
    .eq("user_id", userId)
    .select("balance")
    .single();

  if (error) {
    console.error("Error adding credits:", error);
    throw new Error("Failed to add credits");
  }

  return data.balance;
}

/**
 * Deduct 1 credit from a user's balance. Returns false if insufficient credits.
 */
export async function deductCredit(userId: string): Promise<boolean> {
  const supabase = createAdminClient();

  const currentBalance = await getCreditBalance(userId);

  if (currentBalance < 1) {
    return false;
  }

  const { error } = await supabase
    .from("credits")
    .update({ balance: currentBalance - 1 })
    .eq("user_id", userId);

  if (error) {
    console.error("Error deducting credit:", error);
    return false;
  }

  return true;
}
