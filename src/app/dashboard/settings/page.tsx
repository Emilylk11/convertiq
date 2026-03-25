import { createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/tiers";
import { redirect } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";
import BrandingForm from "@/components/BrandingForm";
import ProfileForm from "@/components/ProfileForm";
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
      <DashboardNav tier={tier} balance={balance} email={user.email ?? ""} displayName={user.user_metadata?.display_name} activePage="settings" />

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

        {/* Profile */}
        <div className="rounded-2xl border border-border/50 bg-surface/30 p-6 mb-8">
          <h2 className="text-sm font-semibold mb-4">Profile</h2>
          <ProfileForm
            initialDisplayName={user.user_metadata?.display_name || ""}
            initialCompanyName={user.user_metadata?.company_name || ""}
          />
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
            <h2 id="branding" className="text-lg font-semibold mb-4 scroll-mt-24">Custom Branding</h2>
            <p className="text-sm text-muted mb-6">
              Customize how your PDF audit reports look when you share them with clients. Your branding will appear on the header and footer of every exported PDF.
            </p>
            <BrandingForm />
          </div>
        ) : (
          <div id="branding" className="rounded-2xl border border-dashed border-border/50 p-8 text-center scroll-mt-24">
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
