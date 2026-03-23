"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserDropdown({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  async function handleSignOut() {
    setOpen(false);
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-muted hover:text-foreground hover:bg-surface transition-all"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {/* Avatar circle */}
        <span className="h-6 w-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-[10px] font-semibold text-accent-bright uppercase shrink-0">
          {email.charAt(0)}
        </span>
        <span className="hidden sm:inline truncate max-w-[120px]">{email}</span>
        {/* Chevron */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-56 rounded-xl border border-border/50 bg-surface shadow-lg shadow-black/20 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Email header */}
          <div className="px-3.5 py-2.5 border-b border-border/30">
            <p className="text-xs text-muted truncate">{email}</p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <a
              href="/dashboard/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-muted hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" />
                <path d="M2 14c0-3.3 2.7-5 6-5s6 1.7 6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              Account
            </a>
            <a
              href="/dashboard/settings#branding"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-muted hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
                <circle cx="5.5" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M2 11l3-3 2 2 3-3 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Branding
            </a>
          </div>

          {/* Divider + Sign Out */}
          <div className="border-t border-border/30 pt-1 mt-1">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors w-full text-left"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <path d="M6 2H4a2 2 0 00-2 2v8a2 2 0 002 2h2M10.5 11.5L14 8l-3.5-3.5M14 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
