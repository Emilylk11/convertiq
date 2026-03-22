import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";

export async function POST(
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
        { error: "Authentication required. Please sign in to share reports." },
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

  const supabase = createAdminClient();

  // 2. Check audit exists and is completed
  const { data: audit, error: fetchError } = await supabase
    .from("audits")
    .select("id, status, share_token, user_id")
    .eq("id", id)
    .single();

  if (fetchError || !audit) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }

  // 3. Verify ownership — user must own this audit
  if (!audit.user_id || audit.user_id !== userId) {
    return NextResponse.json(
      { error: "You do not have permission to share this audit" },
      { status: 403 }
    );
  }

  if (audit.status !== "completed") {
    return NextResponse.json(
      { error: "Audit is not yet completed" },
      { status: 409 }
    );
  }

  // Return existing token if already generated
  if (audit.share_token) {
    return NextResponse.json({ token: audit.share_token });
  }

  // Generate a new share token (URL-safe, 32 hex chars)
  const token = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const { error: updateError } = await supabase
    .from("audits")
    .update({ share_token: token })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to generate share link" },
      { status: 500 }
    );
  }

  return NextResponse.json({ token });
}
