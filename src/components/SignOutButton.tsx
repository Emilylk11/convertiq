"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    setLoading(true);
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="rounded-full border border-border/50 px-4 py-2 text-sm text-muted hover:text-foreground hover:border-border transition-colors disabled:opacity-50"
    >
      {loading ? "Signing out…" : "Sign Out"}
    </button>
  );
}
