import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy handles:
 * 1. Magic link redirect (/?code= → /auth/callback)
 * 2. Supabase session refresh
 * 3. Protected route enforcement
 * 4. Security headers
 */

const PROTECTED_PATHS = ["/dashboard", "/settings", "/api/audit/bulk"];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some((p) => pathname.startsWith(p));
}

function applySecurityHeaders(response: NextResponse): void {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );
}

export async function proxy(request: NextRequest) {
  // If a magic link lands on the homepage with ?code=, redirect to /auth/callback
  const { searchParams, pathname } = request.nextUrl;
  if (pathname === "/" && searchParams.has("code")) {
    const callbackUrl = request.nextUrl.clone();
    callbackUrl.pathname = "/auth/callback";
    return NextResponse.redirect(callbackUrl);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Skip Supabase session refresh if env vars aren't configured yet
  if (!supabaseUrl || !supabaseAnonKey) {
    const response = NextResponse.next({ request });
    applySecurityHeaders(response);
    return response;
  }

  let supabaseResponse = NextResponse.next({ request });
  applySecurityHeaders(supabaseResponse);

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
        // Re-apply security headers after creating new response
        applySecurityHeaders(supabaseResponse);
      },
    },
  });

  // Refresh the session (extends token expiry)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected route enforcement — redirect unauthenticated users to login
  if (isProtectedPath(pathname) && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
