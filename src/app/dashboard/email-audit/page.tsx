import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/tiers";
import { getCreditBalance } from "@/lib/credits";
import DashboardNav from "@/components/DashboardNav";
import SupportButton from "@/components/SupportButton";
import EmailAuditForm from "@/components/EmailAuditForm";

export const metadata = {
  title: "Email Audit — ConvertIQ",
  description: "AI-powered email sequence analysis for subject lines, CTAs, flow, and deliverability.",
};

export default async function EmailAuditPage() {
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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Email Sequence Audit</h1>
        <p className="text-muted text-sm mb-8">
          Paste your email copy below for an AI-powered analysis of subject lines, CTAs, flow, and deliverability.
          {balance > 0 && <> You have <span className="text-accent-bright font-semibold">{balance} credits</span> remaining.</>}
        </p>
        <EmailAuditForm isLoggedIn={true} />
      </main>
      <SupportButton />
    </div>
  );
}
