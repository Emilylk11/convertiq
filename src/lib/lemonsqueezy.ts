import crypto from "crypto";

// ─── Config ────────────────────────────────────────────
export const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY!;
export const LEMONSQUEEZY_WEBHOOK_SECRET =
  process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
export const LEMONSQUEEZY_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID!;

// Map variant IDs to credit amounts
// Set these in .env.local once you create products in Lemon Squeezy
// Uses NEXT_PUBLIC_ prefix so same IDs work on both client and server
export const VARIANT_CREDIT_MAP: Record<string, number> = {
  [process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_STARTER || "starter"]: 3,
  [process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_GROWTH || "growth"]: 10,
  [process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_AGENCY || "agency"]: 30,
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
  const hmac = crypto.createHmac("sha256", LEMONSQUEEZY_WEBHOOK_SECRET);
  const digest = hmac.update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}
