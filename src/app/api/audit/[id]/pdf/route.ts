import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { AuditRecord } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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

  if (record.status !== "completed" || !record.results) {
    return NextResponse.json(
      { error: "Audit is not yet completed" },
      { status: 409 }
    );
  }

  // Lazy-import to avoid edge runtime issues
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
