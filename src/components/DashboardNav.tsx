import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import SignOutButton from "./SignOutButton";
import DashboardMobileNav from "./DashboardMobileNav";

interface DashboardNavProps {
  tier: string;
  balance: number;
  email: string;
  activePage?: "dashboard" | "run-audit" | "buy-credits" | "competitors" | "bulk-audit" | "settings";
}

export default function DashboardNav({ tier, balance, email, activePage }: DashboardNavProps) {
  const linkClass = (page: string) =>
    activePage === page
      ? "text-foreground font-medium"
      : "text-muted hover:text-foreground transition-colors";

  return (
    <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 sm:px-6 h-16">
        <div className="flex items-center gap-6">
          <Logo href="/dashboard" size="small" />
          <div className="hidden md:flex items-center gap-5 text-sm">
            <a href="/dashboard" className={linkClass("dashboard")}>
              Dashboard
            </a>
            <a href="/dashboard/new-audit" className={linkClass("run-audit")}>
              Run Audit
            </a>
            <a href="/pricing" className={linkClass("buy-credits")}>
              Buy Credits
            </a>
            {(tier === "growth" || tier === "agency") && (
              <a href="/dashboard/competitors" className={linkClass("competitors")}>
                Competitors
              </a>
            )}
            {tier === "agency" && (
              <a href="/dashboard/bulk-audit" className={linkClass("bulk-audit")}>
                Bulk Audit
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-2.5 py-1 text-xs font-medium text-accent-bright whitespace-nowrap">
            {balance} credit{balance !== 1 ? "s" : ""}
          </span>
          <ThemeToggle />
          <span className="hidden lg:inline text-xs text-muted truncate max-w-[140px]" title={email}>
            {email}
          </span>
          <SignOutButton />
          <DashboardMobileNav tier={tier} />
        </div>
      </div>
    </nav>
  );
}
