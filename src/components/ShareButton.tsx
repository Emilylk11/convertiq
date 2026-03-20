"use client";

import { useState } from "react";

export default function ShareButton({ auditId }: { auditId: string }) {
  const [state, setState] = useState<"idle" | "loading" | "copied" | "error">(
    "idle"
  );

  async function handleShare() {
    if (state === "loading") return;
    setState("loading");

    try {
      const res = await fetch(`/api/audit/${auditId}/share`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to generate share link");

      const { token } = await res.json();
      const url = `${window.location.origin}/report/${token}`;

      await navigator.clipboard.writeText(url);
      setState("copied");
      setTimeout(() => setState("idle"), 3000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  }

  return (
    <button
      onClick={handleShare}
      disabled={state === "loading"}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
        state === "copied"
          ? "bg-success/10 text-success border border-success/20"
          : state === "error"
            ? "bg-red-500/10 text-red-400 border border-red-500/20"
            : "bg-surface border border-border/50 text-muted hover:text-foreground hover:border-border"
      }`}
    >
      {state === "loading" ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Generating…
        </>
      ) : state === "copied" ? (
        <>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8l4 4 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Link copied!
        </>
      ) : state === "error" ? (
        <>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 5v4M8 11v1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Failed — try again
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 2H6a1 1 0 00-1 1v2H3a1 1 0 00-1 1v7a1 1 0 001 1h10a1 1 0 001-1V6a1 1 0 00-1-1h-2V3a1 1 0 00-1-1z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M10 8.5L8 11l-2-2.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 11V5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Share report
        </>
      )}
    </button>
  );
}
