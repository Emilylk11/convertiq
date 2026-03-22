import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "./LoginForm";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Sign In — ConvertIQ",
  description: "Sign in to your ConvertIQ account to manage audits and credits.",
};

export default function LoginPage() {
  return (
    <div className="min-h-full bg-background text-foreground flex flex-col">
      {/* Minimal nav */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 sm:px-6 h-16">
          <a href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center font-mono text-sm font-bold text-white shrink-0">
              C
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Convert<span className="text-accent-bright">IQ</span>
            </span>
          </a>
          <ThemeToggle />
        </div>
      </nav>

      {/* Login form */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              Welcome to ConvertIQ
            </h1>
            <p className="text-sm text-muted">
              Sign in with your email and password, Google, or a magic link.
            </p>
          </div>

          <Suspense fallback={<div className="text-center text-muted text-sm">Loading…</div>}>
            <LoginForm />
          </Suspense>

          <div className="mt-8">
            <p className="text-center text-xs text-muted/60">
              New here? Create an account with email and password, or sign in with Google.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
