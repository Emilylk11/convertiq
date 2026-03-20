"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { label: "Connecting to your page...", duration: 2000 },
  { label: "Scraping content and structure...", duration: 3000 },
  { label: "Analysing with AI...", duration: 8000 },
  { label: "Building your report...", duration: 4000 },
];

export default function LoadingState({ timedOut = false }: { timedOut?: boolean }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (timedOut) return;
    if (currentStep >= STEPS.length - 1) return;

    const timer = setTimeout(() => {
      setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, STEPS[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep, timedOut]);

  if (timedOut) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="text-4xl mb-4">⏳</div>
        <h2 className="text-xl font-bold mb-2">Taking longer than usual</h2>
        <p className="text-muted text-sm mb-6 max-w-sm">
          Your audit is still running. Complex pages can take up to 2 minutes.
          Try refreshing in a moment.
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
    <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4">
      {/* Animated logo spinner */}
      <div className="relative mb-10">
        <div className="h-16 w-16 rounded-full border-4 border-border border-t-accent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center font-mono text-xs font-bold text-white">
            C
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3.5 w-full max-w-xs mb-8">
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex items-center gap-3">
            <div
              className={`h-6 w-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all duration-300 ${
                i < currentStep
                  ? "bg-success/20 text-success border border-success/30"
                  : i === currentStep
                    ? "bg-accent/20 text-accent-bright border border-accent/30 animate-pulse"
                    : "bg-surface border border-border/50 text-muted/40"
              }`}
            >
              {i < currentStep ? (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2 5l2.5 2.5 3.5-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <span
              className={`text-sm transition-colors duration-300 ${
                i < currentStep
                  ? "text-muted line-through"
                  : i === currentStep
                    ? "text-foreground font-medium"
                    : "text-muted/40"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted">This usually takes 15–30 seconds</p>
    </div>
  );
}
