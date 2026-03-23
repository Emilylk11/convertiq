/**
 * Shared audit category definitions used across all report components.
 * Single source of truth — do NOT duplicate these in individual components.
 */

/** Short labels for category score cards (uppercase display) */
export const CATEGORY_SHORT_LABELS: Record<string, string> = {
  // Landing page
  cta: "CTA",
  copy: "Copy",
  trust: "Trust",
  ux: "UX",
  speed: "Speed",
  mobile: "Mobile",
  design: "Design",
  // Checkout
  friction: "Friction",
  pricing: "Pricing",
  forms: "Forms",
  payment: "Payment",
  // Email
  subject: "Subject",
  body: "Body",
  flow: "Flow",
  deliverability: "Deliver.",
  personalization: "Personal.",
  // Ad copy
  hook: "Hook",
  offer: "Offer",
  audience: "Audience",
  creative: "Creative",
  compliance: "Compliance",
  // Funnel
  traffic: "Traffic",
  landing: "Landing",
  objections: "Objections",
  checkout: "Checkout",
  followup: "Follow-up",
};

/** Full labels for section headings */
export const CATEGORY_FULL_LABELS: Record<string, string> = {
  // Landing page
  cta: "Calls to Action",
  copy: "Copy & Messaging",
  trust: "Trust Signals",
  ux: "User Experience",
  speed: "Page Speed",
  mobile: "Mobile Experience",
  design: "Visual Design & Layout",
  // Checkout
  friction: "Friction Points",
  pricing: "Pricing Transparency",
  forms: "Form UX",
  payment: "Payment Options",
  // Email
  subject: "Subject Line",
  body: "Email Body",
  flow: "Email Flow",
  deliverability: "Deliverability",
  personalization: "Personalization",
  // Ad copy
  hook: "Hook Strength",
  offer: "Offer Clarity",
  audience: "Audience Targeting",
  creative: "Creative Quality",
  compliance: "Ad Compliance",
  // Funnel
  traffic: "Traffic Quality",
  landing: "Landing Experience",
  objections: "Objection Handling",
  checkout: "Checkout Flow",
  followup: "Follow-up Strategy",
};

/** Icons for report section headings */
export const CATEGORY_ICONS: Record<string, string> = {
  // Landing page
  cta: "🎯",
  copy: "✍️",
  trust: "🛡️",
  ux: "🧭",
  speed: "⚡",
  mobile: "📱",
  design: "🎨",
  // Checkout
  friction: "🚧",
  pricing: "💲",
  forms: "📋",
  payment: "💳",
  // Email
  subject: "📧",
  body: "📝",
  flow: "🔄",
  deliverability: "📬",
  personalization: "👤",
  // Ad copy
  hook: "🪝",
  offer: "🎁",
  audience: "🎯",
  creative: "🎨",
  compliance: "✅",
  // Funnel
  traffic: "📊",
  landing: "🛬",
  objections: "🤔",
  checkout: "🛒",
  followup: "📩",
};

/** Get a short label for a category, with fallback */
export function getCategoryLabel(cat: string): string {
  return CATEGORY_SHORT_LABELS[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
}

/** Get a full label for a category, with fallback */
export function getCategoryFullLabel(cat: string): string {
  return CATEGORY_FULL_LABELS[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
}

/** Get an icon for a category, with fallback */
export function getCategoryIcon(cat: string): string {
  return CATEGORY_ICONS[cat] || "📌";
}

/** Score color for web components (Tailwind classes) */
export function scoreColor(score: number): string {
  if (score >= 70) return "text-green-400";
  if (score >= 40) return "text-yellow-400";
  return "text-red-400";
}

/** Score color for PDF (hex values) */
export function scoreColorHex(score: number): string {
  if (score >= 70) return "#16a34a";
  if (score >= 40) return "#d97706";
  return "#dc2626";
}
