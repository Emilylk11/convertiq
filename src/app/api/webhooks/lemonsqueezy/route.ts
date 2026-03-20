import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature, VARIANT_CREDIT_MAP } from "@/lib/lemonsqueezy";
import { addCredits } from "@/lib/credits";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature") || "";

    // Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;

    // We only care about successful orders
    if (eventName !== "order_created") {
      return NextResponse.json({ received: true });
    }

    const order = payload.data;
    const attributes = order.attributes;

    // Extract user_id from custom data
    const userId = payload.meta?.custom_data?.user_id;
    if (!userId) {
      console.error("No user_id in webhook custom data:", payload.meta);
      return NextResponse.json(
        { error: "Missing user_id" },
        { status: 400 }
      );
    }

    // Only process paid/successful orders
    if (attributes.status !== "paid") {
      console.log(`Order status is ${attributes.status}, skipping`);
      return NextResponse.json({ received: true });
    }

    // Get variant ID to determine credit amount
    const variantId = String(attributes.first_order_item?.variant_id || "");
    const creditsToAdd = VARIANT_CREDIT_MAP[variantId];

    if (!creditsToAdd) {
      console.error(`Unknown variant ID: ${variantId}`);
      return NextResponse.json(
        { error: "Unknown variant" },
        { status: 400 }
      );
    }

    // Add credits to user's balance
    const newBalance = await addCredits(userId, creditsToAdd);

    // Log the transaction
    const supabase = createAdminClient();
    await supabase.from("credit_transactions").insert({
      user_id: userId,
      amount: creditsToAdd,
      type: "purchase",
      lemon_squeezy_order_id: String(order.id),
      variant_id: variantId,
      balance_after: newBalance,
    });

    console.log(
      `Added ${creditsToAdd} credits for user ${userId}. New balance: ${newBalance}`
    );

    return NextResponse.json({
      received: true,
      credits_added: creditsToAdd,
      new_balance: newBalance,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
