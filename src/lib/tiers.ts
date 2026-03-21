import { createAdminClient } from "@/lib/supabase/server";

export type UserTier = "free" | "starter" | "growth" | "agency";

/**
 * Variant ID to tier mapping (LemonSqueezy variant IDs).
 */
const VARIANT_TO_TIER: Record<string, UserTier> = {
  "1427550": "starter",
  "1427553": "growth",
  "1427555": "agency",
};

/**
 * Tier hierarchy — higher index = higher tier.
 */
const TIER_RANK: Record<UserTier, number> = {
  free: 0,
  starter: 1,
  growth: 2,
  agency: 3,
};

/**
 * Determine a user's highest purchased tier by checking credit_transactions.
 * Falls back to "free" if no purchases found.
 */
export async function getUserTier(userId: string): Promise<UserTier> {
  const supabase = createAdminClient();

  const { data: transactions, error } = await supabase
    .from("credit_transactions")
    .select("variant_id")
    .eq("user_id", userId);

  if (error || !transactions || transactions.length === 0) {
    return "free";
  }

  let highestTier: UserTier = "free";

  for (const tx of transactions) {
    const variantId = String(tx.variant_id);
    const tier = VARIANT_TO_TIER[variantId];
    if (tier && TIER_RANK[tier] > TIER_RANK[highestTier]) {
      highestTier = tier;
    }
  }

  return highestTier;
}

/* ─── Feature gate helpers ─────────────────────────────── */

/** Full findings + recommendations (Starter+) */
export function canViewFullFindings(tier: UserTier): boolean {
  return TIER_RANK[tier] >= TIER_RANK["starter"];
}

/** PDF export (Starter+) */
export function canExportPdf(tier: UserTier): boolean {
  return TIER_RANK[tier] >= TIER_RANK["starter"];
}

/** Re-audit / track changes (Starter+) */
export function canReaudit(tier: UserTier): boolean {
  return TIER_RANK[tier] >= TIER_RANK["starter"];
}

/** AI copy rewrites (Growth+) */
export function hasAiRewrites(tier: UserTier): boolean {
  return TIER_RANK[tier] >= TIER_RANK["growth"];
}

/** Competitor comparison (Growth+) */
export function hasCompetitorComparison(tier: UserTier): boolean {
  return TIER_RANK[tier] >= TIER_RANK["growth"];
}

/** Priority processing (Growth+) */
export function hasPriorityProcessing(tier: UserTier): boolean {
  return TIER_RANK[tier] >= TIER_RANK["growth"];
}

/** Custom branding on PDFs (Agency) */
export function hasCustomBranding(tier: UserTier): boolean {
  return TIER_RANK[tier] >= TIER_RANK["agency"];
}

/** Bulk audit / multiple URLs (Agency) */
export function hasBulkAudit(tier: UserTier): boolean {
  return TIER_RANK[tier] >= TIER_RANK["agency"];
}

/** Priority support (Agency) */
export function hasPrioritySupport(tier: UserTier): boolean {
  return TIER_RANK[tier] >= TIER_RANK["agency"];
}
