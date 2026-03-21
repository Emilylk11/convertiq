import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/dashboard";

  // Use the configured app URL to avoid origin mismatches on Vercel
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

  const redirectTo = `${baseUrl}${next}`;
  const errorRedirect = `${baseUrl}/login?error=auth`;

  // Create the success redirect response first so cookies can be set on it
  const response = NextResponse.redirect(redirectTo);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Set cookies on the redirect response
            response.cookies.set(name, value, {
              ...options,
              // Ensure cookies work across the domain
              sameSite: "lax",
              secure: true,
            });
          });
        },
      },
    }
  );

  // Handle PKCE code exchange
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return response;
    }
    console.error("Code exchange error:", error.message, error);
  }

  // Handle magic link token_hash verification
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as "email" | "signup" | "magiclink",
    });
    if (!error) {
      return response;
    }
    console.error("OTP verification error:", error.message, error);
  }

  return NextResponse.redirect(errorRedirect);
}
