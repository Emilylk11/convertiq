import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 signups per minute per IP
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const rl = rateLimit(`signup:${ip}`, 3, 60000);
    if (!rl.allowed) {
      const waitSec = Math.ceil(rl.retryAfterMs / 1000);
      return NextResponse.json(
        { error: `Too many signup attempts. Please wait ${waitSec} seconds.` },
        { status: 429, headers: { "Retry-After": String(waitSec) } }
      );
    }

    const { email, password, ref } = (await request.json()) as {
      email?: string;
      password?: string;
      ref?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/dashboard${ref ? `&ref=${encodeURIComponent(ref)}` : ""}`,
      },
    });

    if (error) {
      console.error("Signup error:", error);

      // Supabase returns specific error messages
      if (error.message.includes("already registered")) {
        return NextResponse.json(
          { error: "An account with this email already exists. Try signing in instead." },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ confirmationSent: true });
  } catch (error) {
    console.error("Signup route error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
