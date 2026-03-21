import { createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/tiers";
import { redirect } from "next/navigation";
import DashboardMobileNav from "@/components/DashboardMobileNav";
import ThemeToggle from "@/components/ThemeToggle";
import SignOutButton from "@/components/SignOutButton";
import CompetitorForm from "@/components/CompetitorForm";
import { getCreditBalance } from "@/lib/credits";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Competitor Analysis — ConvertIQ",
  description: "Compare your conversion performance against competitors.",
};

export default async function CompetitorsPage() {
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

  // Only Growth+ can access
  if (tier !== "growth" && tier !== "agency") {
    redirect("/dashboard");
  }

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
            <a href="/dashboard/competitors" className="text-foreground font-medium transition-colors">Competitors</a>
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

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Competitor Analysis</h1>
        <p className="text-sm text-muted mb-8">
          Enter your page and a competitor&apos;s page to get a side-by-side conversion comparison.
          You have <span className="text-accent-bright font-medium">{balance} credit{balance !== 1 ? "s" : ""}</span> remaining.
        </p>

        <CompetitorForm />
      </main>
    </div>
  );
}
