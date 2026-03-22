import { createClient } from "@/lib/supabase/server";
import { getCreditBalance } from "@/lib/credits";
import { getUserTier } from "@/lib/tiers";
import { redirect } from "next/navigation";
import AuditForm from "@/components/AuditForm";
import DashboardNav from "@/components/DashboardNav";
import SupportButton from "@/components/SupportButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Run Audit — ConvertIQ",
  description: "Run a new conversion audit on any URL.",
};

export default async function NewAuditPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [balance, tier] = await Promise.all([
    getCreditBalance(user.id).catch(() => 0),
    getUserTier(user.id).catch(() => "free" as const),
  ]);

  return (
    <div className="min-h-full bg-background text-foreground">
      <DashboardNav
        tier={tier}
        balance={balance}
        email={user.email ?? ""}
        activePage="run-audit"
      />

      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Run a New Audit
          </h1>
          <p className="text-sm text-muted">
            Enter a URL below to get an AI-powered conversion audit.
            {balance > 0 ? (
              <span> You have <span className="text-accent-bright font-medium">{balance} credit{balance !== 1 ? "s" : ""}</span> remaining.</span>
            ) : (
              <span> You&apos;re out of credits — <a href="/pricing" className="text-accent-bright hover:underline">buy more</a>.</span>
            )}
          </p>
        </div>

        <AuditForm isLoggedIn />
      </main>

      <SupportButton />
    </div>
  );
}
