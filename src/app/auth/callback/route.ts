import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const rawNext = searchParams.get("next") ?? "/dashboard";
  const ref = searchParams.get("ref"); // referral code

  // SECURITY: Validate redirect target to prevent open redirect attacks
  // Only allow relative paths starting with /
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

  const errorUrl = new URL("/login?error=auth", origin);

  // Must have either code or token_hash
  if (!code && !token_hash) {
    return NextResponse.redirect(errorUrl);
  }

  try {
    // Dynamic import to avoid any module-level crashes
    const { createServerClient } = await import("@supabase/ssr");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase env vars in auth callback");
      return NextResponse.redirect(errorUrl);
    }

    const successUrl = new URL(next, origin);
    const response = NextResponse.redirect(successUrl);

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("Code exchange failed:", error.message);
        return NextResponse.redirect(errorUrl);
      }

      // Process referral if present
      if (ref) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { trackReferralSignup } = await import("@/lib/referrals");
            const { sendWelcomeEmail } = await import("@/lib/resend");
            const result = await trackReferralSignup(ref, user.id, user.email || "");
            if (result.success && user.email) {
              await sendWelcomeEmail({ to: user.email, referralCredit: true });
            }
          }
        } catch (refError) {
          console.error("Referral tracking error (non-blocking):", refError);
        }
      }

      return response;
    }

    if (token_hash && type) {
      const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type: type as "email" | "signup" | "magiclink",
      });
      if (error) {
        console.error("OTP verify failed:", error.message);
        return NextResponse.redirect(errorUrl);
      }

      // Process referral if present
      if (ref) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { trackReferralSignup } = await import("@/lib/referrals");
            const { sendWelcomeEmail } = await import("@/lib/resend");
            const result = await trackReferralSignup(ref, user.id, user.email || "");
            if (result.success && user.email) {
              await sendWelcomeEmail({ to: user.email, referralCredit: true });
            }
          }
        } catch (refError) {
          console.error("Referral tracking error (non-blocking):", refError);
        }
      }

      return response;
    }

    return NextResponse.redirect(errorUrl);
  } catch (e) {
    console.error("Auth callback crashed:", e instanceof Error ? e.message : e);
    return NextResponse.redirect(errorUrl);
  }
}
