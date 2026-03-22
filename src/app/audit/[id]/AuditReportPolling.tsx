"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuditReportSkeleton from "@/components/AuditReportSkeleton";

const POLL_INTERVAL_MS = 3000;
const TIMEOUT_MS = 300000; // 5 minutes — generous for funnel audits

const STEPS = [
  { label: "Connecting to your pages...", duration: 0 },
  { label: "Scraping page content...", duration: 4000 },
  { label: "Analyzing structure and CTAs...", duration: 12000 },
  { label: "Running AI conversion analysis...", duration: 25000 },
  { label: "Evaluating copy and trust signals...", duration: 50000 },
  { label: "Generating recommendations...", duration: 80000 },
  { label: "Building your report...", duration: 110000 },
  { label: "Almost done — finalizing scores...", duration: 140000 },
];

export default function AuditReportPolling({ auditId }: { auditId: string }) {
  const router = useRouter();
  const [timedOut, setTimedOut] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, POLL_INTERVAL_MS);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setTimedOut(true);
    }, TIMEOUT_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [auditId, router]);

  // Progress steps
  useEffect(() => {
    if (timedOut || currentStep >= STEPS.length - 1) return;
    const timer = setTimeout(() => {
      setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, STEPS[currentStep + 1]?.duration || 5000);
    return () => clearTimeout(timer);
  }, [currentStep, timedOut]);

  if (timedOut) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="text-4xl mb-4">⏳</div>
        <h2 className="text-xl font-bold mb-2">Still working on it</h2>
        <p className="text-muted text-sm mb-6 max-w-sm">
          Multi-page audits can take up to 5 minutes. Your report is still being generated — try refreshing in a moment.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-xl bg-surface border border-border/50 px-6 py-3 text-sm font-medium text-muted hover:text-foreground hover:border-border transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M13.5 2.5A6.5 6.5 0 112.5 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M2.5 5V8H5.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Refresh page
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Progress indicator */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-6">
          <div className="h-12 w-12 rounded-full border-4 border-border border-t-accent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center font-mono text-[10px] font-bold text-white">
              C
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full transition-all duration-500 ${
                i <= currentStep ? "bg-accent" : "bg-surface"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-muted animate-pulse">
          {STEPS[currentStep].label}
        </p>
      </div>

      {/* Skeleton preview of what the report will look like */}
      <AuditReportSkeleton />
    </div>
  );
}
