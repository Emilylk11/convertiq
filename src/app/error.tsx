"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-full bg-background text-foreground flex flex-col">
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-4 sm:px-6 h-16">
          <a href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center font-mono text-sm font-bold text-white">
              C
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Convert<span className="text-accent-bright">IQ</span>
            </span>
          </a>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-xl sm:text-2xl font-bold mb-2">
            Something went wrong
          </h1>
          <p className="text-muted text-sm mb-8 max-w-sm">
            An unexpected error occurred. Our team has been notified.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-block rounded-xl bg-gradient-to-r from-accent to-accent-dim px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Try again
            </button>
            <a
              href="/"
              className="inline-block rounded-xl border border-border/50 bg-surface px-6 py-3 text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Back to home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
