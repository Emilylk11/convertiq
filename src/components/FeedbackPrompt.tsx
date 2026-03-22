"use client";

import { useState, useEffect } from "react";

export default function FeedbackPrompt({ auditId }: { auditId: string }) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<"rating" | "comment" | "done">("rating");
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Show feedback prompt 3 seconds after page load, but only once per audit
    const key = `convertiq_feedback_${auditId}`;
    if (sessionStorage.getItem(key)) return;

    const timer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(key, "shown");
    }, 3000);

    return () => clearTimeout(timer);
  }, [auditId]);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditId, rating, comment }),
      });
    } catch {
      // Non-blocking — don't fail if feedback submission fails
    }
    setStep("done");
    setSubmitting(false);
  }

  if (!visible || step === "done") {
    if (step === "done") {
      return (
        <div className="fixed bottom-6 left-6 z-40 rounded-2xl border border-green-500/30 bg-background shadow-xl p-4 max-w-xs animate-in fade-in">
          <p className="text-sm font-semibold text-green-400">Thanks for your feedback! 🙏</p>
          <button
            onClick={() => setVisible(false)}
            className="absolute top-2 right-2 text-muted hover:text-foreground"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 rounded-2xl border border-border/50 bg-background shadow-xl p-5 max-w-xs">
      <button
        onClick={() => setVisible(false)}
        className="absolute top-3 right-3 text-muted hover:text-foreground transition-colors"
        aria-label="Close"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {step === "rating" && (
        <>
          <p className="text-sm font-semibold mb-1">How useful was this audit?</p>
          <p className="text-xs text-muted mb-3">Your feedback helps us improve.</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => {
                  setRating(n);
                  setStep("comment");
                }}
                className={`w-10 h-10 rounded-lg border text-lg transition-all hover:scale-110 ${
                  rating === n
                    ? "border-accent bg-accent/10"
                    : "border-border/50 bg-surface/30 hover:border-accent/30"
                }`}
              >
                {n <= 1 ? "😕" : n <= 2 ? "😐" : n <= 3 ? "🙂" : n <= 4 ? "😊" : "🤩"}
              </button>
            ))}
          </div>
        </>
      )}

      {step === "comment" && (
        <>
          <p className="text-sm font-semibold mb-1">
            {rating && rating >= 4 ? "Glad you found it useful!" : "How can we do better?"}
          </p>
          <p className="text-xs text-muted mb-3">
            {rating && rating >= 4
              ? "Would you recommend ConvertIQ? A quick testimonial helps a lot."
              : "What would have made this audit more helpful?"}
          </p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              rating && rating >= 4
                ? "e.g. ConvertIQ found issues on my page I never would have noticed..."
                : "e.g. I wish the recommendations were more specific to my industry..."
            }
            rows={3}
            className="w-full rounded-lg border border-border/50 bg-surface/30 px-3 py-2 text-xs text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-lg bg-accent px-4 py-1.5 text-xs font-semibold text-white hover:bg-accent-bright transition-colors disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Submit"}
            </button>
            <button
              onClick={() => {
                setComment("");
                handleSubmit();
              }}
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              Skip
            </button>
          </div>
        </>
      )}
    </div>
  );
}
