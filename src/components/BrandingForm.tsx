"use client";

import { useState, useEffect } from "react";

interface BrandingSettings {
  company_name: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  footer_text: string;
}

export default function BrandingForm() {
  const [settings, setSettings] = useState<BrandingSettings>({
    company_name: "",
    logo_url: "",
    primary_color: "#7c3aed",
    secondary_color: "#6d28d9",
    footer_text: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings/branding")
      .then((res) => res.json())
      .then((data) => {
        if (data.branding) {
          setSettings(data.branding);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);

    try {
      const response = await fetch("/api/settings/branding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
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

  if (loading) {
    return (
      <div className="rounded-2xl border border-border/50 bg-surface/30 p-8 text-center">
        <div className="animate-pulse text-muted text-sm">Loading settings...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Preview */}
      <div className="rounded-2xl border border-border/50 bg-surface/30 p-6">
        <p className="text-xs text-muted uppercase tracking-wider mb-4">PDF Header Preview</p>
        <div
          className="rounded-xl p-6 flex items-center gap-4"
          style={{
            background: `linear-gradient(135deg, ${settings.primary_color}, ${settings.secondary_color})`,
          }}
        >
          {settings.logo_url ? (
            <img
              src={settings.logo_url}
              alt="Logo"
              className="h-10 w-10 rounded-lg object-contain bg-white/20 p-1"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-lg">
              {settings.company_name ? settings.company_name[0].toUpperCase() : "?"}
            </div>
          )}
          <div>
            <p className="text-white font-semibold text-lg">
              {settings.company_name || "Your Company"}
            </p>
            <p className="text-white/70 text-xs">Conversion Audit Report</p>
          </div>
        </div>
        {settings.footer_text && (
          <div className="mt-3 pt-3 border-t border-border/30 text-center">
            <p className="text-xs text-muted">{settings.footer_text}</p>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <div>
          <label htmlFor="company-name" className="block text-sm font-medium text-muted mb-1.5">
            Company / Agency Name
          </label>
          <input
            id="company-name"
            type="text"
            value={settings.company_name}
            onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
            placeholder="Acme Digital Agency"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
          />
        </div>

        <div>
          <label htmlFor="logo-url" className="block text-sm font-medium text-muted mb-1.5">
            Logo URL
          </label>
          <input
            id="logo-url"
            type="url"
            value={settings.logo_url}
            onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
            placeholder="https://yoursite.com/logo.png"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
          />
          <p className="text-xs text-muted mt-1">Paste a direct link to your logo image (PNG or SVG recommended).</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="primary-color" className="block text-sm font-medium text-muted mb-1.5">
              Primary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                id="primary-color"
                type="color"
                value={settings.primary_color}
                onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                className="h-10 w-10 rounded-lg border border-border cursor-pointer"
              />
              <input
                type="text"
                value={settings.primary_color}
                onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
              />
            </div>
          </div>
          <div>
            <label htmlFor="secondary-color" className="block text-sm font-medium text-muted mb-1.5">
              Secondary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                id="secondary-color"
                type="color"
                value={settings.secondary_color}
                onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                className="h-10 w-10 rounded-lg border border-border cursor-pointer"
              />
              <input
                type="text"
                value={settings.secondary_color}
                onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="footer-text" className="block text-sm font-medium text-muted mb-1.5">
            PDF Footer Text
          </label>
          <input
            id="footer-text"
            type="text"
            value={settings.footer_text}
            onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
            placeholder="Powered by Acme Digital Agency | acme.com"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {saved && (
        <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
          Branding settings saved successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-gradient-to-r from-amber-600 to-accent px-6 py-3.5 text-base font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {saving ? "Saving..." : "Save Branding Settings"}
      </button>
    </form>
  );
}
