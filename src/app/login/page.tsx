import type { Metadata } from "next";
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
              Sign in to ConvertIQ
            </h1>
            <p className="text-sm text-muted">
              Enter your email and we&apos;ll send you a magic link.
            </p>
          </div>

          <LoginForm />

          <p className="mt-8 text-center text-xs text-muted/60">
            Don&apos;t have an account? One will be created automatically.
          </p>
        </div>
      </main>
    </div>
  );
}
