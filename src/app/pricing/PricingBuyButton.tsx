"use client";

import { useState } from "react";

export default function PricingBuyButton({
  label,
  popular,
  variantId,
}: {
  label: string;
  popular: boolean;
  variantId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId }),
      });

      const data = await res.json();

      if (!res.ok) {
        // If not authenticated, redirect to login
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Redirect to Lemon Squeezy checkout
      window.location.href = data.checkoutUrl;
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`w-full rounded-xl px-6 py-3.5 text-sm font-semibold transition-all disabled:opacity-50 ${
          popular
            ? "bg-gradient-to-r from-accent to-accent-dim text-white hover:opacity-90"
            : "bg-surface-light border border-border text-foreground hover:bg-surface hover:border-accent/30"
        }`}
      >
        {loading ? "Loading…" : label}
      </button>
      {error && (
        <p className="mt-2 text-xs text-red-400 text-center">{error}</p>
      )}
    </div>
  );
}
