"use client";

import { useState, useEffect } from "react";

interface ReferralData {
  code: string;
  referralLink: string;
  stats: {
    totalReferrals: number;
    totalConversions: number;
    totalCreditsEarned: number;
  };
  referrals: {
    id: string;
    referred_email: string;
    status: string;
    referrer_credits_awarded: number;
    created_at: string;
  }[];
}

export default function ReferralPanel() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<"link" | "code" | null>(null);

  useEffect(() => {
    fetch("/api/referral")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function copyToClipboard(text: string, type: "link" | "code") {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-border/50 bg-surface/50 p-6 animate-pulse">
        <div className="h-5 bg-surface rounded w-1/3 mb-4" />
        <div className="h-10 bg-surface rounded mb-3" />
        <div className="h-8 bg-surface rounded w-1/2" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="rounded-2xl border border-border/50 bg-surface/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🎁</span>
          <h3 className="text-base font-semibold">Refer &amp; Earn Credits</h3>
        </div>
        <p className="text-xs text-muted">
          Share your link. When someone signs up and makes a purchase, you earn{" "}
          <span className="text-accent-bright font-semibold">2 free credits</span>.
          They get <span className="text-accent-bright font-semibold">1 free credit</span> just for signing up.
        </p>
      </div>

      {/* Referral link */}
      <div className="px-6 pb-4">
        <label className="block text-xs text-muted mb-1.5">Your referral link</label>
        <div className="flex gap-2">
          <div className="flex-1 rounded-lg border border-border/50 bg-background px-3 py-2.5 text-sm text-muted truncate font-mono">
            {data.referralLink}
          </div>
          <button
            onClick={() => copyToClipboard(data.referralLink, "link")}
            className="shrink-0 rounded-lg border border-border/50 bg-background px-4 py-2.5 text-xs font-medium hover:bg-surface transition-colors"
          >
            {copied === "link" ? (
              <span className="text-green-400">Copied!</span>
            ) : (
              "Copy Link"
            )}
          </button>
        </div>

        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => copyToClipboard(data.code, "code")}
            className="text-xs text-muted hover:text-foreground transition-colors"
          >
            Code: <span className="font-mono font-semibold text-foreground">{data.code}</span>
            {copied === "code" && <span className="text-green-400 ml-1">Copied!</span>}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 border-t border-border/30">
        <div className="px-4 py-4 text-center border-r border-border/30">
          <p className="text-xl font-bold">{data.stats.totalReferrals}</p>
          <p className="text-[10px] text-muted uppercase tracking-wider">Signups</p>
        </div>
        <div className="px-4 py-4 text-center border-r border-border/30">
          <p className="text-xl font-bold">{data.stats.totalConversions}</p>
          <p className="text-[10px] text-muted uppercase tracking-wider">Converted</p>
        </div>
        <div className="px-4 py-4 text-center">
          <p className="text-xl font-bold text-accent-bright">{data.stats.totalCreditsEarned}</p>
          <p className="text-[10px] text-muted uppercase tracking-wider">Credits Earned</p>
        </div>
      </div>

      {/* Recent referrals */}
      {data.referrals.length > 0 && (
        <div className="border-t border-border/30 px-6 py-4">
          <p className="text-xs font-semibold text-muted mb-2">Recent referrals</p>
          <div className="space-y-2">
            {data.referrals.slice(0, 5).map((ref) => (
              <div key={ref.id} className="flex items-center justify-between text-xs">
                <span className="text-muted truncate max-w-[180px]">
                  {ref.referred_email || "Unknown"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    ref.status === "rewarded"
                      ? "bg-green-500/10 text-green-400"
                      : ref.status === "signed_up"
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-zinc-500/10 text-zinc-400"
                  }`}
                >
                  {ref.status === "rewarded"
                    ? `+${ref.referrer_credits_awarded} credits`
                    : ref.status === "signed_up"
                      ? "Signed up"
                      : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share buttons */}
      <div className="border-t border-border/30 px-6 py-3 flex items-center gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `I've been using ConvertIQ to audit my landing pages for conversion issues — it's like having a CRO consultant for $3/audit. Try it here:`
          )}&url=${encodeURIComponent(data.referralLink)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center rounded-lg border border-border/50 bg-background px-3 py-2 text-xs font-medium hover:bg-surface transition-colors"
        >
          Share on X
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.referralLink)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center rounded-lg border border-border/50 bg-background px-3 py-2 text-xs font-medium hover:bg-surface transition-colors"
        >
          Share on LinkedIn
        </a>
        <a
          href={`mailto:?subject=${encodeURIComponent("Check out ConvertIQ")}&body=${encodeURIComponent(
            `I've been using ConvertIQ to audit my landing pages — it finds conversion issues and gives you exact copy rewrites. Way cheaper than hiring a CRO agency.\n\nTry it here (you'll get a free credit): ${data.referralLink}`
          )}`}
          className="flex-1 text-center rounded-lg border border-border/50 bg-background px-3 py-2 text-xs font-medium hover:bg-surface transition-colors"
        >
          Email a Friend
        </a>
      </div>
    </div>
  );
}
