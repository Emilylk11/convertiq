"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const UTM_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

/**
 * Captures UTM parameters from the URL and stores them in sessionStorage.
 * These are then available for attribution when a user signs up or purchases.
 */
export default function UTMCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const utmData: Record<string, string> = {};
    let hasUtm = false;

    for (const param of UTM_PARAMS) {
      const value = searchParams.get(param);
      if (value) {
        utmData[param] = value;
        hasUtm = true;
      }
    }

    if (hasUtm) {
      sessionStorage.setItem("convertiq_utm", JSON.stringify(utmData));
      // Also store the landing page
      sessionStorage.setItem("convertiq_landing_page", window.location.pathname);
    }
  }, [searchParams]);

  return null;
}

/**
 * Get stored UTM data (call from client components)
 */
export function getStoredUTM(): Record<string, string> | null {
  if (typeof window === "undefined") return null;
  try {
    const data = sessionStorage.getItem("convertiq_utm");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}
