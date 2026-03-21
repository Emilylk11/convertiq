"use client";

const CREDIT_TOPUPS = [
  {
    name: "5 Credits",
    credits: 5,
    price: 19,
    perCredit: "3.80",
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_CREDITS_5 || "",
  },
  {
    name: "15 Credits",
    credits: 15,
    price: 49,
    perCredit: "3.27",
    popular: true,
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_CREDITS_15 || "",
  },
  {
    name: "50 Credits",
    credits: 50,
    price: 129,
    perCredit: "2.58",
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_CREDITS_50 || "",
  },
];

export default function OutOfCreditsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  const storeId = process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 rounded-2xl border border-border/50 bg-background shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-bright">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-1">You&apos;re out of credits</h2>
          <p className="text-sm text-muted">
            Top up your credits to keep optimizing. Your reports and data are safe.
          </p>
        </div>

        {/* ROI callout */}
        <div className="mx-6 mb-4 rounded-xl bg-green-500/5 border border-green-500/20 p-4">
          <div className="flex items-start gap-3">
            <span className="text-lg mt-0.5">💰</span>
            <div>
              <p className="text-sm font-semibold text-green-400 mb-1">
                One fix can pay for itself 1,000x over
              </p>
              <p className="text-xs text-muted leading-relaxed">
                A single CRO improvement (like a better headline or CTA) typically lifts conversions 0.5–2%.
                On a page with 10K monthly visitors and $50 avg. order value, that&apos;s
                <span className="text-green-400 font-semibold"> $2,500–$10,000/mo in new revenue</span> — from
                an audit that costs less than a coffee.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison bar */}
        <div className="mx-6 mb-4 flex items-center gap-2 text-[11px] text-muted">
          <div className="flex-1 flex items-center gap-1.5 rounded-lg bg-red-500/5 border border-red-500/10 px-3 py-2">
            <span className="text-red-400">✕</span>
            <span>CRO agency: <span className="text-red-400 font-semibold">$5,000+/mo</span></span>
          </div>
          <div className="flex-1 flex items-center gap-1.5 rounded-lg bg-red-500/5 border border-red-500/10 px-3 py-2">
            <span className="text-red-400">✕</span>
            <span>Freelancer: <span className="text-red-400 font-semibold">$300/audit</span></span>
          </div>
          <div className="flex-1 flex items-center gap-1.5 rounded-lg bg-green-500/5 border border-green-500/10 px-3 py-2">
            <span className="text-green-400">✓</span>
            <span>ConvertIQ: <span className="text-green-400 font-semibold">$2.58/audit</span></span>
          </div>
        </div>

        {/* Credit packs */}
        <div className="px-6 pb-2 space-y-3">
          {CREDIT_TOPUPS.map((pack) => {
            const checkoutUrl = storeId && pack.variantId
              ? `https://${storeId}.lemonsqueezy.com/buy/${pack.variantId}`
              : "/pricing";

            return (
              <a
                key={pack.name}
                href={checkoutUrl}
                className={`block rounded-xl border p-4 transition-all hover:scale-[1.01] ${
                  pack.popular
                    ? "border-accent/40 bg-accent/5 hover:border-accent/60 ring-1 ring-accent/20"
                    : "border-border/50 bg-surface/30 hover:border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{pack.credits} Credits</span>
                      {pack.popular && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-accent/20 text-accent-bright px-1.5 py-0.5 rounded">
                          Most Popular
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-0.5">
                      ${pack.perCredit} per audit
                      {pack.credits === 50 && (
                        <span className="text-green-400 ml-1">— save 32%</span>
                      )}
                      {pack.credits === 15 && (
                        <span className="text-green-400 ml-1">— save 14%</span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">${pack.price}</span>
                    <p className="text-[10px] text-muted">one-time</p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-border/30 mt-2">
          <p className="text-[10px] text-muted">
            Credits never expire &middot; Stack with your balance
          </p>
          <button
            onClick={onClose}
            className="text-xs text-muted hover:text-foreground transition-colors"
          >
            Maybe later
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
