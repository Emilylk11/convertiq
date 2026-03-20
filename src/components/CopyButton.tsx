"use client";

import { useState } from "react";

export default function CopyButton({
  text,
  label = "Copy",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
        copied
          ? "bg-success/10 text-success border border-success/20"
          : "bg-surface border border-border/50 text-muted hover:text-foreground hover:border-border"
      } ${className}`}
      title={copied ? "Copied!" : `Copy ${label}`}
    >
      {copied ? (
        <>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="shrink-0"
          >
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="shrink-0"
          >
            <rect
              x="4"
              y="4"
              width="7"
              height="7"
              rx="1"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M8 4V2.5A1.5 1.5 0 006.5 1h-4A1.5 1.5 0 001 2.5v4A1.5 1.5 0 002.5 8H4"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
