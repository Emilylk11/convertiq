"use client";

import { useState } from "react";

export default function SupportButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded panel */}
      {open && (
        <div className="absolute bottom-16 right-0 w-72 rounded-2xl border border-border/50 bg-background shadow-2xl shadow-black/20 p-5 mb-2">
          <h3 className="text-sm font-semibold mb-3">Need help?</h3>
          <div className="space-y-3">
            <a
              href="mailto:support@convertiq.io"
              className="flex items-center gap-3 rounded-xl border border-border/50 bg-surface/50 p-3 hover:bg-surface/80 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-bright shrink-0">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-xs font-medium">Email Support</p>
                <p className="text-xs text-muted">support@convertiq.io</p>
              </div>
            </a>
            <a
              href="/faq"
              className="flex items-center gap-3 rounded-xl border border-border/50 bg-surface/50 p-3 hover:bg-surface/80 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-bright shrink-0">
                <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs font-medium">FAQ</p>
                <p className="text-xs text-muted">Common questions answered</p>
              </div>
            </a>
            <a
              href="/pricing"
              className="flex items-center gap-3 rounded-xl border border-border/50 bg-surface/50 p-3 hover:bg-surface/80 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-bright shrink-0">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs font-medium">Buy Credits</p>
                <p className="text-xs text-muted">View plans & pricing</p>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-12 w-12 rounded-full bg-accent shadow-lg shadow-accent/30 flex items-center justify-center text-white hover:bg-accent-bright transition-colors"
        aria-label="Support"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </button>
    </div>
  );
}
