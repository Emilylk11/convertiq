"use client";

import { useState } from "react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors"
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M3 6h14M3 10h14M3 14h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-xl border-t border-border/50 flex flex-col p-6 gap-1"
          onClick={() => setOpen(false)}
        >
          {[
            { label: "How It Works", href: "/#how-it-works" },
            { label: "Examples", href: "/examples" },
            { label: "Pricing", href: "/pricing" },
            { label: "FAQ", href: "/faq" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium text-muted hover:text-foreground hover:bg-surface transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="mt-4 pt-4 border-t border-border/50">
            <a
              href="/login"
              className="flex items-center justify-center rounded-xl bg-gradient-to-r from-accent to-accent-dim px-6 py-3.5 text-base font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Sign In →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
