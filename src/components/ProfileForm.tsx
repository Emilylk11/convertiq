"use client";

import { useState } from "react";

export default function ProfileForm({
  initialDisplayName = "",
  initialCompanyName = "",
}: {
  initialDisplayName?: string;
  initialCompanyName?: string;
}) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [companyName, setCompanyName] = useState(initialCompanyName);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);

    try {
      const response = await fetch("/api/settings/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: displayName,
          company_name: companyName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to save");
        setSaving(false);
        return;
      }

      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="display-name" className="block text-sm font-medium text-muted mb-1.5">
          Display Name
        </label>
        <input
          id="display-name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your name"
          maxLength={100}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
        />
      </div>

      <div>
        <label htmlFor="company-name-profile" className="block text-sm font-medium text-muted mb-1.5">
          Company Name <span className="text-muted/50">(optional)</span>
        </label>
        <input
          id="company-name-profile"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Your company"
          maxLength={100}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {saved && (
        <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
          Profile saved successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-bright transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
