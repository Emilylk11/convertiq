"use client";

import { useState, useEffect } from "react";

interface OnboardingBannerProps {
  hasAudits: boolean;
  balance: number;
  tier: string;
  userName?: string;
}

const STEPS = [
  {
    id: "run-audit",
    title: "Run your first audit",
    description: "Paste any URL and get a detailed conversion analysis.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    href: "/dashboard/new-audit",
    cta: "Run Audit",
  },
  {
    id: "buy-credits",
    title: "Get credits for full reports",
    description: "Unlock detailed findings, PDF exports, and re-audits.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    href: "/pricing",
    cta: "View Plans",
  },
  {
    id: "explore-settings",
    title: "Customize your settings",
    description: "Set up branding, check your plan, and manage your account.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    href: "/dashboard/settings",
    cta: "Settings",
  },
];

export default function OnboardingBanner({
  hasAudits,
  balance,
  tier,
  userName,
}: OnboardingBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if user previously dismissed onboarding
    const wasDismissed = localStorage.getItem("convertiq-onboarding-dismissed");
    if (wasDismissed === "true") {
      setDismissed(true);
    }
    setLoaded(true);
  }, []);

  // Don't show if user has completed onboarding indicators or dismissed
  if (!loaded || dismissed) return null;

  // Only show for new-ish users: no audits, or free tier with no credits
  const isNewUser = !hasAudits && tier === "free" && balance === 0;
  const needsCredits = hasAudits && tier === "free" && balance === 0;

  if (!isNewUser && !needsCredits) return null;

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("convertiq-onboarding-dismissed", "true");
  };

  // Filter steps based on what user has already done
  const activeSteps = STEPS.filter((step) => {
    if (step.id === "run-audit" && hasAudits) return false;
    if (step.id === "buy-credits" && balance > 0) return false;
    return true;
  });

  if (activeSteps.length === 0) return null;

  return (
    <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 to-transparent p-6 mb-8 relative">
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors"
        aria-label="Dismiss onboarding"
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Welcome header */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold mb-1">
          {userName ? `Welcome, ${userName.split("@")[0]}!` : "Welcome to ConvertIQ!"}
        </h2>
        <p className="text-sm text-muted">
          {isNewUser
            ? "Get started in just a few steps. Here's what to do first:"
            : "Here's what to do next to get the most out of ConvertIQ:"}
        </p>
      </div>

      {/* Steps */}
      <div className="grid sm:grid-cols-3 gap-3">
        {activeSteps.map((step, index) => (
          <a
            key={step.id}
            href={step.href}
            className="rounded-xl border border-border/50 bg-surface/30 p-4 hover:bg-surface/60 hover:border-accent/30 transition-all group"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 rounded-lg bg-accent/10 flex items-center justify-center text-accent-bright shrink-0">
                {step.icon}
              </div>
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                Step {index + 1}
              </span>
            </div>
            <h3 className="text-sm font-semibold mb-1 group-hover:text-accent-bright transition-colors">
              {step.title}
            </h3>
            <p className="text-xs text-muted leading-relaxed mb-3">
              {step.description}
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-accent-bright">
              {step.cta}
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
