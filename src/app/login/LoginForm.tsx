"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

type Mode = "signin" | "signup" | "magic-link";
type Status = "idle" | "loading" | "sent" | "error" | "google-loading" | "confirmed";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState<Mode>("signin");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const paramRef = searchParams.get("ref") || "";
  const [ref, setRef] = useState(paramRef);
  const authError = searchParams.get("error");

  // Check sessionStorage for referral code
  useState(() => {
    if (!paramRef && typeof window !== "undefined") {
      const stored = sessionStorage.getItem("convertiq_ref");
      if (stored) setRef(stored);
    }
  });

  async function handleGoogleSignIn() {
    setStatus("google-loading");
    setErrorMsg("");

    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}${ref ? `&ref=${encodeURIComponent(ref)}` : ""}`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setStatus("error");
      }
    } catch {
      setErrorMsg("Failed to connect to Google. Please try again.");
      setStatus("error");
    }
  }

  async function handlePasswordSignIn(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMsg("Invalid email or password. Try again or use a magic link.");
        } else if (error.message.includes("Email not confirmed")) {
          setErrorMsg("Please confirm your email first. Check your inbox for the confirmation link.");
        } else {
          setErrorMsg(error.message);
        }
        setStatus("error");
        return;
      }

      router.push(redirect);
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      setStatus("error");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords don't match.");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, ref }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong");
        setStatus("error");
        return;
      }

      setStatus("confirmed");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, redirect, ref }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong");
        setStatus("error");
        return;
      }

      setStatus("sent");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  // Confirmation sent after signup
  if (status === "confirmed") {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 text-center">
        <div className="text-3xl mb-3">✉️</div>
        <h2 className="text-lg font-semibold mb-2">Confirm your email</h2>
        <p className="text-sm text-muted leading-relaxed">
          We sent a confirmation link to{" "}
          <span className="font-medium text-foreground">{email}</span>.
          Click the link to activate your account and sign in.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setMode("signin");
          }}
          className="mt-4 text-xs text-accent-bright hover:underline"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  // Magic link sent
  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 text-center">
        <div className="text-3xl mb-3">✉️</div>
        <h2 className="text-lg font-semibold mb-2">Check your email</h2>
        <p className="text-sm text-muted leading-relaxed">
          We sent a magic link to{" "}
          <span className="font-medium text-foreground">{email}</span>. Click
          the link to sign in.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setMode("signin");
            setEmail("");
          }}
          className="mt-4 text-xs text-accent-bright hover:underline"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  const isLoading = status === "loading" || status === "google-loading";
  const inputClass =
    "w-full rounded-xl border border-border bg-surface/50 px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="space-y-5">
      {authError && (
        <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-center">
          <p className="text-sm text-red-400">
            Sign-in link expired or was invalid. Please try again.
          </p>
        </div>
      )}

      {/* Google Sign-In */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-surface/50 px-6 py-3 text-sm font-medium text-foreground hover:bg-surface hover:border-border/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "google-loading" ? (
          <svg className="animate-spin h-5 w-5 text-muted" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
        )}
        {status === "google-loading" ? "Connecting to Google..." : "Continue with Google"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <span className="flex-1 h-px bg-border/50" />
        <span className="text-xs text-muted/50">or</span>
        <span className="flex-1 h-px bg-border/50" />
      </div>

      {/* Sign In with Password */}
      {mode === "signin" && (
        <form onSubmit={handlePasswordSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              disabled={isLoading}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              disabled={isLoading}
              className={inputClass}
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-400">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-gradient-to-r from-accent to-accent-dim px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Signing in..." : "Sign In"}
          </button>

          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                setMode("magic-link");
                setErrorMsg("");
                setStatus("idle");
              }}
              className="text-accent-bright hover:underline"
            >
              Forgot password? Use magic link
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorMsg("");
                setStatus("idle");
                setPassword("");
              }}
              className="text-accent-bright hover:underline"
            >
              Create account
            </button>
          </div>
        </form>
      )}

      {/* Sign Up with Password */}
      {mode === "signup" && (
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium mb-1.5">
              Email address
            </label>
            <input
              id="signup-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              disabled={isLoading}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium mb-1.5">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              disabled={isLoading}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium mb-1.5">
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              disabled={isLoading}
              className={inputClass}
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-400">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-gradient-to-r from-accent to-accent-dim px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-xs text-center">
            <span className="text-muted">Already have an account? </span>
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setErrorMsg("");
                setStatus("idle");
                setPassword("");
                setConfirmPassword("");
              }}
              className="text-accent-bright hover:underline"
            >
              Sign in
            </button>
          </p>
        </form>
      )}

      {/* Magic Link (fallback / forgot password) */}
      {mode === "magic-link" && (
        <form onSubmit={handleMagicLink} className="space-y-4">
          <div>
            <label htmlFor="magic-email" className="block text-sm font-medium mb-1.5">
              Email address
            </label>
            <input
              id="magic-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              disabled={isLoading}
              className={inputClass}
            />
          </div>

          <p className="text-xs text-muted">
            We&apos;ll send a sign-in link to your email. No password needed.
          </p>

          {errorMsg && (
            <p className="text-sm text-red-400">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-gradient-to-r from-accent to-accent-dim px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Sending link..." : "Send Magic Link"}
          </button>

          <p className="text-xs text-center">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setErrorMsg("");
                setStatus("idle");
              }}
              className="text-accent-bright hover:underline"
            >
              Back to password sign in
            </button>
          </p>
        </form>
      )}
    </div>
  );
}
