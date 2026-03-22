import { NextResponse, type NextRequest } from "next/server";
import { authenticateAndRateLimit, createAndRunAudit } from "@/lib/audit-helpers";
import { runCheckoutAudit } from "@/lib/claude";
import { scrapeUrl, isPrivateUrl } from "@/lib/scraper";

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateAndRateLimit(request);
    if (!auth.ok) return auth.response;
    const { context } = auth;

    const body = await request.json();
    const { url, context: auditContext } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Please provide a checkout URL." },
        { status: 400 }
      );
    }

    if (isPrivateUrl(url)) {
      return NextResponse.json(
        { error: "Private or internal URLs cannot be audited." },
        { status: 400 }
      );
    }

    // Scrape first, then create record and run audit
    const scrapedData = await scrapeUrl(url);

    return await createAndRunAudit({
      url,
      email: context.user?.email || "anonymous",
      auditType: context.auditType,
      userId: context.userId,
      scrapedData: scrapedData as unknown as Record<string, unknown>,
      runAudit: () => runCheckoutAudit(scrapedData, auditContext),
    });
  } catch (error) {
    console.error("Checkout audit error:", error);
    const message = error instanceof Error ? error.message : "Audit failed.";
    return NextResponse.json(
      { error: message.includes("not allowed") || message.includes("too large") ? message : "Audit failed. Please try again." },
      { status: 500 }
    );
  }
}
