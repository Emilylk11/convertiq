import { createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/tiers";
import { redirect } from "next/navigation";
import DashboardMobileNav from "@/components/DashboardMobileNav";
import ThemeToggle from "@/components/ThemeToggle";
import SignOutButton from "@/components/SignOutButton";
import BrandingForm from "@/components/BrandingForm";
import DeleteAccountButton from "@/components/DeleteAccountButton";
import { getCreditBalance } from "@/lib/credits";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings — ConvertIQ",
  description: "Manage your account and branding settings.",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [tier, balance] = await Promise.all([
    getUserTier(user.id).catch(() => "free" as const),
    getCreditBalance(user.id).catch(() => 0),
  ]);

  // Only Agency gets branding, but all tiers can see settings
  const showBranding = tier === "agency";

  return (
    <div className="min-h-full bg-background text-foreground">
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 sm:px-6 h-16">
          <a href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center font-mono text-sm font-bold text-white shrink-0">
              C
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Convert<span className="text-accent-bright">IQ</span>
            </span>
          </a>
          <div className="hidden sm:flex items-center gap-6 text-sm text-muted">
            <a href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</a>
            <a href="/dashboard/new-audit" className="hover:text-foreground transition-colors">Run Audit</a>
            <a href="/pricing" className="hover:text-foreground transition-colors">Buy Credits</a>
            {(tier === "growth" || tier === "agency") && (
              <a href="/dashboard/competitors" className="hover:text-foreground transition-colors">Competitors</a>
            )}
            {tier === "agency" && (
              <a href="/dashboard/bulk-audit" className="hover:text-foreground transition-colors">Bulk Audit</a>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-xs font-medium text-accent-bright">
              {balance} credit{balance !== 1 ? "s" : ""}
            </span>
            <ThemeToggle />
            <span className="hidden sm:inline text-xs text-muted truncate max-w-[120px]" title={user.email ?? ""}>{user.email}</span>
            <SignOutButton />
            <DashboardMobileNav tier={tier} />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-10 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-sm text-muted mb-10">Manage your account and preferences.</p>

        {/* Account info */}
        <div className="rounded-2xl border border-border/50 bg-surface/30 p-6 mb-8">
          <h2 className="text-sm font-semibold mb-4">Account</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Plan</span>
              <span className="font-medium capitalize">{tier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Credits</span>
              <span className="font-medium">{balance}</span>
            </div>
          </div>
        </div>

        {/* Priority Processing badge for Growth+ */}
        {(tier === "growth" || tier === "agency") && (
          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 mb-8">
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-purple-400">Priority Processing Active</h3>
                <p className="text-xs text-muted">Your audits are automatically processed with priority in our queue.</p>
              </div>
            </div>
          </div>
        )}

        {/* Priority Support for Agency */}
        {tier === "agency" && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 mb-8">
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-amber-400">Priority Support</h3>
                <p className="text-xs text-muted">
                  Need help? Email us at{" "}
                  <a href="mailto:support@convertiq.io" className="text-amber-400 hover:underline">
                    support@convertiq.io
                  </a>{" "}
                  for priority assistance.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Custom Branding — Agency only */}
        {showBranding ? (
          <div>
            <h2 className="text-lg font-semibold mb-4">Custom Branding</h2>
            <p className="text-sm text-muted mb-6">
              Customize how your PDF audit reports look when you share them with clients. Your branding will appear on the header and footer of every exported PDF.
            </p>
            <BrandingForm />
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/50 p-8 text-center">
            <div className="text-3xl mb-3">&#127912;</div>
            <h3 className="text-sm font-semibold mb-2">Custom Branding</h3>
            <p className="text-xs text-muted mb-4 max-w-sm mx-auto">
              White-label your PDF reports with your own logo, colors, and footer. Available on the Agency plan.
            </p>
            <a
              href="/pricing"
              className="inline-block text-xs text-accent-bright hover:underline"
            >
              Upgrade to Agency &rarr;
            </a>
          </div>
        )}
        {/* Danger zone */}
        <div className="mt-16 pt-8 border-t border-red-500/10">
          <h2 className="text-sm font-semibold text-red-400 mb-2">Danger Zone</h2>
          <p className="text-xs text-muted mb-4">
            Once you delete your account, all your data (audits, credits, referrals, branding) will be permanently removed. This cannot be undone.
          </p>
          <DeleteAccountButton />
        </div>
      </main>
    </div>
  );
}
