import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { getUserTier, canExportPdf } from "@/lib/tiers";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import type { AuditRecord } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1. Require authentication
  let userId: string;
  try {
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to export PDFs." },
        { status: 401 }
      );
    }
    userId = user.id;
  } catch {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  // 2. Rate limit
  const rl = rateLimit(
    `pdf:${userId}`,
    RATE_LIMITS.pdf.maxRequests,
    RATE_LIMITS.pdf.windowMs
  );
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  // 3. Check tier — PDF export requires Starter+
  const tier = await getUserTier(userId);
  if (!canExportPdf(tier)) {
    return NextResponse.json(
      {
        error:
          "PDF export requires a Starter plan or above. Visit /pricing to upgrade.",
      },
      { status: 403 }
    );
  }

  const supabase = createAdminClient();
  const { data: audit, error } = await supabase
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !audit) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }

  const record = audit as AuditRecord;

  // 4. Verify ownership — user must own this audit
  if (!record.user_id || record.user_id !== userId) {
    return NextResponse.json(
      { error: "You do not have permission to export this audit" },
      { status: 403 }
    );
  }

  if (record.status !== "completed" || !record.results) {
    return NextResponse.json(
      { error: "Audit is not yet completed" },
      { status: 409 }
    );
  }

  // 5. Generate PDF
  const { renderToBuffer } = await import("@react-pdf/renderer");
  const { default: AuditPdf } = await import("@/lib/pdf/AuditPdf");
  const { createElement } = await import("react");
  type ReactPDFDocument = Parameters<typeof renderToBuffer>[0];

  const pdfBuffer = await renderToBuffer(
    createElement(AuditPdf, {
      results: record.results,
      url: record.url,
      createdAt: record.created_at,
      isFree: record.audit_type === "free",
    }) as ReactPDFDocument
  );

  const hostname = new URL(record.url).hostname.replace(/^www\./, "");
  const filename = `convertiq-audit-${hostname}.pdf`;

  return new Response(pdfBuffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": pdfBuffer.byteLength.toString(),
    },
  });
}
