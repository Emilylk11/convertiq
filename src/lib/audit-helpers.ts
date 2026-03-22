/**
 * Shared helpers for audit API routes.
 * Eliminates duplicated auth, rate limiting, credit deduction, and record creation logic.
 */

import { NextResponse, type NextRequest } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/tiers";
import { deductCredit } from "@/lib/credits";
import { rateLimit } from "@/lib/rate-limit";
import type { AuditResults } from "@/lib/types";

interface AuditContext {
  user: { id: string; email: string } | null;
  userId: string | null;
  auditType: "free" | "full";
}

interface AuthAndRateLimitOptions {
  /** Rate limit max requests per window */
  maxRequests?: number;
  /** Rate limit window in ms */
  windowMs?: number;
  /** Number of credits to deduct (default 1) */
  creditCost?: number;
  /** Require login (default false) */
  requireAuth?: boolean;
  /** Require paid tier (default false) */
  requirePaid?: boolean;
}

type AuthResult =
  | { ok: true; context: AuditContext }
  | { ok: false; response: NextResponse };

/**
 * Handles auth check, rate limiting, and credit deduction for an audit route.
 * Returns either a context object (success) or a NextResponse (error).
 */
export async function authenticateAndRateLimit(
  request: NextRequest,
  options: AuthAndRateLimitOptions = {}
): Promise<AuthResult> {
  const {
    maxRequests = 5,
    windowMs = 60000,
    creditCost = 1,
    requireAuth = false,
    requirePaid = false,
  } = options;

  // 1. Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (requireAuth && !user) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Please sign in to use this feature." },
        { status: 401 }
      ),
    };
  }

  // 2. Rate limit
  const rateLimitKey = user?.id || request.headers.get("x-forwarded-for") || "anonymous";
  const rl = rateLimit(rateLimitKey, maxRequests, windowMs);
  if (!rl.allowed) {
    const waitSec = Math.ceil(rl.retryAfterMs / 1000);
    return {
      ok: false,
      response: NextResponse.json(
        { error: `Too many requests. Please wait ${waitSec} seconds.` },
        { status: 429, headers: { "Retry-After": String(waitSec) } }
      ),
    };
  }

  // 3. Determine tier and deduct credits
  let userId: string | null = null;
  let auditType: "free" | "full" = "free";

  if (user) {
    userId = user.id;
    const tier = await getUserTier(user.id);

    if (requirePaid && tier === "free") {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Upgrade to access this feature." },
          { status: 403 }
        ),
      };
    }

    if (tier !== "free") {
      const success = await deductCredit(user.id, creditCost);
      if (!success) {
        return {
          ok: false,
          response: NextResponse.json(
            { error: "Insufficient credits.", balance: 0 },
            { status: 402 }
          ),
        };
      }
      auditType = "full";
    }
  }

  return {
    ok: true,
    context: {
      user: user ? { id: user.id, email: user.email || "" } : null,
      userId,
      auditType,
    },
  };
}

/**
 * Creates an audit record, runs the audit function, stores results, and returns the response.
 */
export async function createAndRunAudit(options: {
  /** The URL or label for this audit (e.g., "email-audit", actual URL, etc.) */
  url: string;
  /** User email for the record */
  email: string;
  /** "free" or "full" */
  auditType: "free" | "full";
  /** User ID (null for anonymous) */
  userId: string | null;
  /** Data to store in scraped_data column */
  scrapedData?: Record<string, unknown>;
  /** Initial status (default "processing") */
  initialStatus?: string;
  /** The async function that runs the audit and returns results */
  runAudit: () => Promise<AuditResults>;
}): Promise<NextResponse> {
  const {
    url,
    email,
    auditType,
    userId,
    scrapedData,
    initialStatus = "processing",
    runAudit,
  } = options;

  const admin = createAdminClient();

  // Create audit record
  const { data: audit, error: insertError } = await admin
    .from("audits")
    .insert({
      url,
      email,
      audit_type: auditType,
      status: initialStatus,
      scraped_data: scrapedData || null,
      user_id: userId,
      expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select("id")
    .single();

  if (insertError || !audit) {
    return NextResponse.json(
      { error: "Failed to create audit record." },
      { status: 500 }
    );
  }

  // Run the audit
  const results = await runAudit();

  // Store results
  await admin
    .from("audits")
    .update({
      status: "completed",
      results,
      overall_score: results.overallScore,
    })
    .eq("id", audit.id);

  return NextResponse.json({ auditId: audit.id, results });
}
