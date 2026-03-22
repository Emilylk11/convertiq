import { NextResponse, type NextRequest } from "next/server";
import { authenticateAndRateLimit, createAndRunAudit } from "@/lib/audit-helpers";
import { runEmailAudit } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateAndRateLimit(request);
    if (!auth.ok) return auth.response;
    const { context } = auth;

    const body = await request.json();
    const { emailContent, context: auditContext } = body;

    if (!emailContent || typeof emailContent !== "string" || emailContent.trim().length < 20) {
      return NextResponse.json(
        { error: "Please provide email content (at least 20 characters)." },
        { status: 400 }
      );
    }

    const trimmed = emailContent.substring(0, 5000);

    return await createAndRunAudit({
      url: "email-audit",
      email: context.user?.email || "anonymous",
      auditType: context.auditType,
      userId: context.userId,
      scrapedData: { emailContent: trimmed },
      runAudit: () => runEmailAudit(trimmed, auditContext),
    });
  } catch (error) {
    console.error("Email audit error:", error);
    return NextResponse.json(
      { error: "Audit failed. Please try again." },
      { status: 500 }
    );
  }
}
