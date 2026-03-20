"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReAuditButton({ auditId }: { auditId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleReAudit() {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/audit/${auditId}/reaudit`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to start re-audit");
      }

      const { auditId: newId } = await res.json();
      router.push(`/audit/${newId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleReAudit}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium bg-surface border border-border/50 text-muted hover:text-foreground hover:border-border transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        title="Re-run this audit with a fresh scrape (uses 1 credit)"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
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
            Starting re-audit…
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M13.5 2.5A6.5 6.5 0 112.5 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M2.5 5V8H5.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Re-audit
          </>
        )}
      </button>
      {error && (
        <p className="mt-1.5 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
