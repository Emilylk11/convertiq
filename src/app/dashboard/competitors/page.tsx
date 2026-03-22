import { createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/tiers";
import { redirect } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";
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
      <DashboardNav tier={tier} balance={balance} email={user.email ?? ""} activePage="competitors" />

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
