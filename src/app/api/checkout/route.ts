import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutUrl } from "@/lib/lemonsqueezy";

// Whitelist of valid Lemon Squeezy variant IDs
function getValidVariantIds(): string[] {
  return [
    process.env.LEMONSQUEEZY_VARIANT_STARTER,
    process.env.LEMONSQUEEZY_VARIANT_GROWTH,
    process.env.LEMONSQUEEZY_VARIANT_AGENCY,
    process.env.LEMONSQUEEZY_VARIANT_CREDITS_5,
    process.env.LEMONSQUEEZY_VARIANT_CREDITS_15,
    process.env.LEMONSQUEEZY_VARIANT_CREDITS_50,
  ].filter(Boolean) as string[];
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to purchase credits" },
        { status: 401 }
      );
    }

    const { variantId } = (await request.json()) as { variantId?: string };

    if (!variantId) {
      return NextResponse.json(
        { error: "Missing variantId" },
        { status: 400 }
      );
    }

    // Validate against known variant IDs
    const validIds = getValidVariantIds();
    if (validIds.length > 0 && !validIds.includes(variantId)) {
      return NextResponse.json(
        { error: "Invalid product variant" },
        { status: 400 }
      );
    }

    const checkoutUrl = await createCheckoutUrl({
      variantId,
      userEmail: user.email || "",
      userId: user.id,
    });

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}
