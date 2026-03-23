import ThemeToggle from "./ThemeToggle";
import UserDropdown from "./UserDropdown";
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
      ? "text-foreground font-medium transition-colors"
      : "hover:text-foreground transition-colors";

  return (
    <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 sm:px-6 h-16">
        <a href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center font-mono text-sm font-bold text-white shrink-0">
            C
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Convert<span className="text-accent-bright">IQ</span>
          </span>
        </a>

        <div className="hidden sm:flex items-center gap-6 text-sm text-muted">
          <a href="/dashboard" className={linkClass("dashboard")}>Dashboard</a>
          <a href="/dashboard/new-audit" className={linkClass("run-audit")}>Run Audit</a>
          <a href="/pricing" className={linkClass("buy-credits")}>Buy Credits</a>
          {(tier === "growth" || tier === "agency") && (
            <a href="/dashboard/competitors" className={linkClass("competitors")}>Competitors</a>
          )}
          {tier === "agency" && (
            <a href="/dashboard/bulk-audit" className={linkClass("bulk-audit")}>Bulk Audit</a>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-xs font-medium text-accent-bright">
            {balance} credit{balance !== 1 ? "s" : ""}
          </span>
          <ThemeToggle />
          <span className="hidden sm:inline">
            <UserDropdown email={email} />
          </span>
          <DashboardMobileNav tier={tier} />
        </div>
      </div>
    </nav>
  );
}
