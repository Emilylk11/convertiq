"use client";

import { useState } from "react";

interface DashboardMobileNavProps {
  tier: string;
}

export default function DashboardMobileNav({ tier }: DashboardMobileNavProps) {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
    { label: "Run Audit", href: "/dashboard/new-audit", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
    { label: "Buy Credits", href: "/pricing", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Settings", href: "/dashboard/settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
  ];

  // Growth+ gets competitor comparison
  if (tier === "growth" || tier === "agency") {
    navItems.push({
      label: "Competitors",
      href: "/dashboard/competitors",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    });
  }

  // Agency gets bulk audit
  if (tier === "agency") {
    navItems.push({
      label: "Bulk Audit",
      href: "/dashboard/bulk-audit",
      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    });
  }

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors"
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M3 6h14M3 10h14M3 14h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-xl border-t border-border/50 flex flex-col p-6 gap-1"
          onClick={() => setOpen(false)}
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium text-muted hover:text-foreground hover:bg-surface transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <path d={item.icon} />
              </svg>
              {item.label}
            </a>
          ))}
          <div className="mt-4 pt-4 border-t border-border/50">
            <a
              href="/api/auth/signout"
              className="flex items-center justify-center rounded-xl border border-border/50 px-6 py-3.5 text-base font-medium text-muted hover:text-foreground hover:bg-surface transition-colors"
            >
              Sign Out
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
