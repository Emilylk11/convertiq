import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/tiers";
import { getCreditBalance } from "@/lib/credits";
import DashboardNav from "@/components/DashboardNav";
import SupportButton from "@/components/SupportButton";
import FunnelAuditForm from "@/components/FunnelAuditForm";

export const metadata = {
  title: "Full Funnel Audit — ConvertIQ",
  description: "AI-powered full funnel analysis from ad to checkout — identify conversion leaks at every stage.",
};

export default async function FunnelAuditPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [tier, balance] = await Promise.all([
    getUserTier(user.id),
    getCreditBalance(user.id),
  ]);

  return (
    <div className="min-h-full bg-background text-foreground">
      <DashboardNav tier={tier} balance={balance} email={user.email || ""} displayName={user.user_metadata?.display_name} activePage="run-audit" />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Full Funnel Audit</h1>
        <p className="text-muted text-sm mb-8">
          Analyze your entire conversion funnel — from ad to landing page to checkout. Identify leaks at every stage.
          {balance > 0 && <> You have <span className="text-accent-bright font-semibold">{balance} credits</span> remaining.</>}
          <span className="block mt-1 text-amber-400">Costs 2 credits per funnel audit.</span>
        </p>
        <FunnelAuditForm isLoggedIn={true} />
      </main>
      <SupportButton />
    </div>
  );
}
