import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { scrapeUrl, isPrivateUrl } from "@/lib/scraper";
import { captureScreenshot } from "@/lib/screenshot";
import { runLandingPageAudit } from "@/lib/claude";
import { sendAuditEmail, sendLowCreditEmail } from "@/lib/resend";
import { getUserTier, hasPriorityProcessing } from "@/lib/tiers";
import { deductCredit, getCreditBalance } from "@/lib/credits";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export const maxDuration = 300; // 5 minutes — Vercel Pro supports up to 300s

export async function POST(request: NextRequest) {
  try {
    // Limit request body size (16KB should be plenty for audit requests)
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 16384) {
      return NextResponse.json(
        { error: "Request too large" },
        { status: 413 }
      );
    }

    const body = await request.json();
    const { url, email, context } = body as {
      url?: string;
      email?: string;
      context?: {
        trafficType?: string;
        industry?: string;
        audience?: string;
        monthlyTraffic?: number;
        avgOrderValue?: number;
      };
    };

    // Check if user is logged in for tier features & credit deduction
    let userId: string | null = null;
    let userEmail: string | null = null;
    let isPriority = false;
    let auditType: "free" | "full" = "free";

    try {
      const authClient = await createClient();
      const { data: { user } } = await authClient.auth.getUser();
      if (user) {
        userId = user.id;
        userEmail = user.email || null;
        const tier = await getUserTier(user.id);
        isPriority = hasPriorityProcessing(tier);
        if (tier !== "free") {
          auditType = "full";
          // Deduct credit for logged-in paid users (atomic operation)
          const hasCredit = await deductCredit(user.id);
          if (!hasCredit) {
            return NextResponse.json(
              { error: "Insufficient credits. Please purchase more credits." },
              { status: 402 }
            );
          }
        }
      }
    } catch {
      // Not logged in — free audit
    }

    // Rate limit — use user ID if logged in, fall back to IP
    const rateLimitKey = userId
      || request.headers.get("x-forwarded-for")
      || request.headers.get("x-real-ip")
      || "anonymous";
    const rl = rateLimit(
      `audit:${rateLimitKey}`,
      RATE_LIMITS.audit.maxRequests,
      RATE_LIMITS.audit.windowMs
    );
    if (!rl.allowed) {
      const waitSec = Math.ceil(rl.retryAfterMs / 1000);
      return NextResponse.json(
        { error: `Too many requests. Please wait ${waitSec} seconds.` },
        { status: 429, headers: { "Retry-After": String(waitSec) } }
      );
    }

    // Resolve email: logged-in users use session email, guests must provide one
    const resolvedEmail = userEmail || email;

    // Validate input
    if (!url || !resolvedEmail) {
      return NextResponse.json(
        { error: userId ? "URL is required" : "URL and email are required" },
        { status: 400 }
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      return NextResponse.json(
        { error: "Please enter a valid URL (including https://)" },
        { status: 400 }
      );
    }

    // Block private/internal URLs
    if (isPrivateUrl(url)) {
      return NextResponse.json(
        { error: "Private or internal URLs cannot be audited. Please enter a public URL." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(resolvedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Validate and sanitize context values if provided
    if (context) {
      if (context.monthlyTraffic !== undefined) {
        if (typeof context.monthlyTraffic !== "number" || context.monthlyTraffic < 0 || context.monthlyTraffic > 100_000_000) {
          return NextResponse.json(
            { error: "Monthly traffic must be between 0 and 100,000,000" },
            { status: 400 }
          );
        }
      }
      if (context.avgOrderValue !== undefined) {
        if (typeof context.avgOrderValue !== "number" || context.avgOrderValue < 0 || context.avgOrderValue > 1_000_000) {
          return NextResponse.json(
            { error: "Average order value must be between 0 and 1,000,000" },
            { status: 400 }
          );
        }
      }
      // Sanitize text fields — strip HTML and limit length
      const MAX_CONTEXT_LEN = 500;
      if (context.trafficType) {
        context.trafficType = context.trafficType.replace(/<[^>]*>/g, "").slice(0, MAX_CONTEXT_LEN);
      }
      if (context.industry) {
        context.industry = context.industry.replace(/<[^>]*>/g, "").slice(0, MAX_CONTEXT_LEN);
      }
      if (context.audience) {
        context.audience = context.audience.replace(/<[^>]*>/g, "").slice(0, MAX_CONTEXT_LEN);
      }
    }

    const supabase = createAdminClient();

    // Create audit record (expires 90 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);

    const insertPayload: Record<string, unknown> = {
      url: parsedUrl.toString(),
      email: resolvedEmail,
      audit_type: auditType,
      status: "pending",
      expires_at: expiresAt.toISOString(),
    };
    if (userId) {
      insertPayload.user_id = userId;
    }

    const { data: audit, error: insertError } = await supabase
      .from("audits")
      .insert(insertPayload)
      .select("id")
      .single();

    if (insertError || !audit) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create audit" },
        { status: 500 }
      );
    }

    // Scrape the URL and capture screenshot in parallel
    let scrapedData;
    let screenshot: string | null = null;
    try {
      const [scrapeResult, screenshotResult] = await Promise.all([
        scrapeUrl(parsedUrl.toString()),
        captureScreenshot(parsedUrl.toString()).catch(() => null),
      ]);
      scrapedData = scrapeResult;
      screenshot = screenshotResult;

      await supabase
        .from("audits")
        .update({ scraped_data: scrapedData, status: "processing" })
        .eq("id", audit.id);
    } catch (scrapeError) {
      const message =
        scrapeError instanceof Error
          ? scrapeError.message
          : "Failed to scrape URL";

      await supabase
        .from("audits")
        .update({ status: "failed", error_message: message })
        .eq("id", audit.id);

      return NextResponse.json(
        { error: `Could not access that URL: ${message}` },
        { status: 422 }
      );
    }

    // Run Claude audit with scraped data + optional screenshot for visual analysis
    let results;
    try {
      results = await runLandingPageAudit(scrapedData, context, screenshot);

      await supabase
        .from("audits")
        .update({
          results,
          overall_score: results.overallScore,
          status: "completed",
        })
        .eq("id", audit.id);
    } catch (auditError) {
      const message =
        auditError instanceof Error
          ? auditError.message
          : "Audit analysis failed";

      console.error("Claude audit error:", {
        message,
        status: (auditError as { status?: number })?.status,
        auditId: audit.id,
        url: parsedUrl.toString(),
      });

      await supabase
        .from("audits")
        .update({ status: "failed", error_message: message })
        .eq("id", audit.id);

      return NextResponse.json(
        { error: "AI analysis failed. Please try again." },
        { status: 500 }
      );
    }

    // Send email (non-blocking — don't fail the request if email fails)
    try {
      await sendAuditEmail({
        to: resolvedEmail,
        auditId: audit.id,
        url: parsedUrl.toString(),
        results,
      });
    } catch (emailError) {
      console.error("Email send failed:", emailError);
    }

    // Send low credit warning email if balance is 1-2 after deduction
    if (userId) {
      try {
        const remainingBalance = await getCreditBalance(userId);
        if (remainingBalance > 0 && remainingBalance <= 2) {
          await sendLowCreditEmail({ to: resolvedEmail, balance: remainingBalance });
        }
      } catch (lowCreditError) {
        console.error("Low credit email failed:", lowCreditError);
      }
    }

    return NextResponse.json({ auditId: audit.id }, { status: 201 });
  } catch (error) {
    console.error("Audit route error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
