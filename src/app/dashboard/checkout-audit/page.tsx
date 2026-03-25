import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/tiers";
import { getCreditBalance } from "@/lib/credits";
import DashboardNav from "@/components/DashboardNav";
import SupportButton from "@/components/SupportButton";
import CheckoutAuditForm from "@/components/CheckoutAuditForm";

export const metadata = {
  title: "Checkout Flow Audit — ConvertIQ",
  description: "AI-powered checkout analysis for friction points, trust signals, and payment UX.",
};

export default async function CheckoutAuditPage() {
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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Checkout Flow Audit</h1>
        <p className="text-muted text-sm mb-8">
          Enter your checkout page URL for an AI-powered analysis of cart abandonment signals, friction points, trust elements, and payment UX.
          {balance > 0 && <> You have <span className="text-accent-bright font-semibold">{balance} credits</span> remaining.</>}
        </p>
        <CheckoutAuditForm isLoggedIn={true} />
      </main>
      <SupportButton />
    </div>
  );
}
