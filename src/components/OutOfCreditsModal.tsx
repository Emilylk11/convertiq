"use client";

const CREDIT_PACKS = [
  {
    name: "Starter",
    credits: 3,
    price: 29,
    perCredit: "9.67",
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_STARTER || "",
    color: "blue",
  },
  {
    name: "Growth",
    credits: 10,
    price: 79,
    perCredit: "7.90",
    popular: true,
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_GROWTH || "",
    color: "purple",
  },
  {
    name: "Agency",
    credits: 30,
    price: 199,
    perCredit: "6.63",
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_AGENCY || "",
    color: "amber",
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
      <div className="relative w-full max-w-lg mx-4 rounded-2xl border border-border/50 bg-background shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-bright">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-1">You&apos;re out of credits</h2>
          <p className="text-sm text-muted">
            Purchase more credits to keep running audits. Your existing reports and data are safe.
          </p>
        </div>

        {/* Credit packs */}
        <div className="px-6 pb-2 space-y-3">
          {CREDIT_PACKS.map((pack) => {
            const checkoutUrl = storeId && pack.variantId
              ? `https://${storeId}.lemonsqueezy.com/buy/${pack.variantId}`
              : "/pricing";

            return (
              <a
                key={pack.name}
                href={checkoutUrl}
                className={`block rounded-xl border p-4 transition-all hover:scale-[1.01] ${
                  pack.popular
                    ? "border-purple-500/40 bg-purple-500/5 hover:border-purple-500/60"
                    : "border-border/50 bg-surface/30 hover:border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{pack.name}</span>
                        {pack.popular && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded">
                            Best Value
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted mt-0.5">
                        {pack.credits} credits &middot; ${pack.perCredit}/audit
                      </p>
                    </div>
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
            Credits never expire &middot; Stack with existing credits
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
