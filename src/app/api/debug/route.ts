import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ANTHROPIC_KEY_SET: !!process.env.ANTHROPIC_API_KEY,
    ANTHROPIC_KEY_LENGTH: process.env.ANTHROPIC_API_KEY?.length ?? 0,
    SUPABASE_URL_SET: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY_SET: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_KEY_SET: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_KEY_SET: !!process.env.RESEND_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  });
}
