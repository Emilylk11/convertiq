import { NextResponse, type NextRequest } from "next/server";
import { authenticateAndRateLimit, createAndRunAudit } from "@/lib/audit-helpers";
import { runAdCopyAudit } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateAndRateLimit(request);
    if (!auth.ok) return auth.response;
    const { context } = auth;

    const body = await request.json();
    const { adContent, context: auditContext } = body;

    if (!adContent || typeof adContent !== "string" || adContent.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide ad copy (at least 10 characters)." },
        { status: 400 }
      );
    }

    const trimmed = adContent.substring(0, 3000);

    return await createAndRunAudit({
      url: "ad-copy-audit",
      email: context.user?.email || "anonymous",
      auditType: context.auditType,
      userId: context.userId,
      scrapedData: { adContent: trimmed },
      runAudit: () => runAdCopyAudit(trimmed, auditContext),
    });
  } catch (error) {
    console.error("Ad copy audit error:", error);
    return NextResponse.json(
      { error: "Audit failed. Please try again." },
      { status: 500 }
    );
  }
}
