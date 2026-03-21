"use client";

import { useState } from "react";

export default function LowCreditWarning({ balance }: { balance: number }) {
  const [dismissed, setDismissed] = useState(false);

  // Show warning when credits are 1-2 (but not 0 — that's handled by the out-of-credits modal)
  if (dismissed || balance > 2 || balance === 0) return null;

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 mb-6 flex items-start gap-3">
      <span className="text-xl mt-0.5">⚠️</span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-amber-400">
          Low credits — {balance} remaining
        </p>
        <p className="text-xs text-muted mt-0.5">
          You have {balance} credit{balance !== 1 ? "s" : ""} left.
          {balance === 1
            ? " After your next audit, you'll need to purchase more."
            : " Purchase more to keep running audits without interruption."}
        </p>
        <div className="flex items-center gap-3 mt-3">
          <a
            href="/pricing"
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-semibold text-black hover:bg-amber-400 transition-colors"
          >
            Buy More Credits
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="text-xs text-muted hover:text-foreground transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-muted hover:text-foreground transition-colors"
        aria-label="Dismiss"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
