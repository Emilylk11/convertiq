"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Captures the ?ref= param from the URL and stores it in sessionStorage.
 * This way the referral code persists across page navigations until the user signs up.
 */
export default function ReferralCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      sessionStorage.setItem("convertiq_ref", ref);
    }
  }, [searchParams]);

  return null;
}

/**
 * Hook to get the stored referral code and append it to login URLs.
 */
export function getLoginUrlWithRef(basePath: string = "/login"): string {
  if (typeof window === "undefined") return basePath;
  const ref = sessionStorage.getItem("convertiq_ref");
  return ref ? `${basePath}?ref=${encodeURIComponent(ref)}` : basePath;
}
