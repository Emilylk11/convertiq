import crypto from "crypto";

// ─── Config ────────────────────────────────────────────
export const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY!;
export const LEMONSQUEEZY_WEBHOOK_SECRET =
  process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
export const LEMONSQUEEZY_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID!;

// Map variant IDs to credit amounts
// Set these in .env.local once you create products in Lemon Squeezy
// Tier packages (unlock features + credits)
// Credit top-ups (just credits, for existing users)
export const VARIANT_CREDIT_MAP: Record<string, number> = {
  // Tier packages
  [process.env.LEMONSQUEEZY_VARIANT_STARTER || "starter"]: 3,
  [process.env.LEMONSQUEEZY_VARIANT_GROWTH || "growth"]: 10,
  [process.env.LEMONSQUEEZY_VARIANT_AGENCY || "agency"]: 30,
  // Credit top-ups
  [process.env.LEMONSQUEEZY_VARIANT_CREDITS_5 || "credits_5"]: 5,
  [process.env.LEMONSQUEEZY_VARIANT_CREDITS_15 || "credits_15"]: 15,
  [process.env.LEMONSQUEEZY_VARIANT_CREDITS_50 || "credits_50"]: 50,
};

// ─── Checkout URL generator ───────────────────────────
export async function createCheckoutUrl({
  variantId,
  userEmail,
  userId,
}: {
  variantId: string;
  userEmail: string;
  userId: string;
}): Promise<string> {
  const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${LEMONSQUEEZY_API_KEY}`,
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: userEmail,
            custom: {
              user_id: userId,
            },
          },
          product_options: {
            redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?purchased=true`,
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: LEMONSQUEEZY_STORE_ID,
            },
          },
          variant: {
            data: {
              type: "variants",
              id: variantId,
            },
          },
        },
      },
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("Lemon Squeezy checkout error:", error);
    throw new Error("Failed to create checkout");
  }

  const json = await res.json();
  return json.data.attributes.url;
}

// ─── Webhook verification ─────────────────────────────
export function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  if (!signature || !LEMONSQUEEZY_WEBHOOK_SECRET) {
    return false;
  }
  const hmac = crypto.createHmac("sha256", LEMONSQUEEZY_WEBHOOK_SECRET);
  const digest = hmac.update(payload).digest("hex");
  const sigBuf = Buffer.from(signature);
  const digestBuf = Buffer.from(digest);
  // timingSafeEqual throws if lengths differ — check first
  if (sigBuf.length !== digestBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(sigBuf, digestBuf);
}
