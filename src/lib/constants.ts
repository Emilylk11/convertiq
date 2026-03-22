/**
 * Application-wide constants. Centralized to avoid magic strings.
 */

/** LocalStorage keys */
export const STORAGE_KEYS = {
  THEME: "convertiq-theme",
  REFERRAL: "convertiq-ref",
  ONBOARDING_DISMISSED: "convertiq-onboarding-dismissed",
} as const;

/** Audit configuration */
export const AUDIT_CONFIG = {
  /** How long audit records are stored (in days) */
  EXPIRY_DAYS: 90,
  /** Max text length sent to Claude */
  MAX_TEXT_LENGTH: 8000,
  /** Max email content length */
  MAX_EMAIL_LENGTH: 5000,
  /** Max ad copy length */
  MAX_AD_COPY_LENGTH: 3000,
  /** Max funnel stage content length */
  MAX_STAGE_LENGTH: 3000,
} as const;

/** Credit costs per audit type */
export const CREDIT_COSTS = {
  LANDING_PAGE: 1,
  EMAIL: 1,
  AD_COPY: 1,
  CHECKOUT: 1,
  FUNNEL: 2,
  COMPETITOR: 2,
} as const;

/** Support email */
export const SUPPORT_EMAIL = "hello@convertiq.com";

/** App URL (for emails, meta tags, etc.) */
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://convert-iqs.com";
