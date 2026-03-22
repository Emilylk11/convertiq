"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteAccountButton() {
  const router = useRouter();
  const [step, setStep] = useState<"idle" | "confirm" | "typing" | "deleting">("idle");
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");

  async function handleDelete() {
    setStep("deleting");
    setError("");

    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to delete account");
        setStep("typing");
        return;
      }

      // Account deleted — redirect to homepage
      router.push("/?deleted=true");
    } catch {
      setError("Network error. Please try again.");
      setStep("typing");
    }
  }

  if (step === "idle") {
    return (
      <button
        onClick={() => setStep("confirm")}
        className="text-xs text-red-400 hover:text-red-300 transition-colors"
      >
        Delete my account
      </button>
    );
  }

  if (step === "confirm") {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 space-y-3">
        <p className="text-sm font-semibold text-red-400">Are you sure?</p>
        <p className="text-xs text-muted leading-relaxed">
          This will permanently delete your account, all audit history, credits, referral data, and branding settings.
          This action <strong className="text-foreground">cannot be undone</strong>.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setStep("typing")}
            className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
          >
            Yes, I want to delete
          </button>
          <button
            onClick={() => setStep("idle")}
            className="rounded-lg border border-border/50 px-4 py-2 text-xs text-muted hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 space-y-3">
      <p className="text-sm font-semibold text-red-400">Final confirmation</p>
      <p className="text-xs text-muted">
        Type <span className="font-mono font-semibold text-foreground">DELETE</span> to confirm permanent account deletion.
      </p>
      <input
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder="Type DELETE"
        disabled={step === "deleting"}
        className="w-full rounded-lg border border-red-500/20 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:opacity-50"
      />
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={confirmText !== "DELETE" || step === "deleting"}
          className="rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {step === "deleting" ? "Deleting..." : "Permanently Delete Account"}
        </button>
        <button
          onClick={() => {
            setStep("idle");
            setConfirmText("");
            setError("");
          }}
          disabled={step === "deleting"}
          className="rounded-lg border border-border/50 px-4 py-2 text-xs text-muted hover:text-foreground transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
