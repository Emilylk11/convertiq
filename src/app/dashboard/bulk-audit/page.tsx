import { createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/tiers";
import { redirect } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";
import BulkAuditForm from "@/components/BulkAuditForm";
import { getCreditBalance } from "@/lib/credits";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bulk Audit — ConvertIQ",
  description: "Audit multiple URLs at once.",
};

export default async function BulkAuditPage() {
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

  // Only Agency can access
  if (tier !== "agency") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-full bg-background text-foreground">
      <DashboardNav tier={tier} balance={balance} email={user.email ?? ""} displayName={user.user_metadata?.display_name} activePage="bulk-audit" />

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Bulk Audit</h1>
        <p className="text-sm text-muted mb-8">
          Paste up to 10 URLs to audit them all at once. Perfect for auditing entire client sites.
          You have <span className="text-accent-bright font-medium">{balance} credit{balance !== 1 ? "s" : ""}</span> remaining.
        </p>

        <BulkAuditForm />
      </main>
    </div>
  );
}
