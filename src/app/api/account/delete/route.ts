import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();

    // Delete user data in order (respecting foreign keys)
    // 1. Referrals (where user is referrer or referred)
    await admin.from("referrals").delete().eq("referrer_id", user.id);
    await admin.from("referrals").delete().eq("referred_user_id", user.id);

    // 2. Referral codes
    await admin.from("referral_codes").delete().eq("user_id", user.id);

    // 3. Branding settings
    await admin.from("branding_settings").delete().eq("user_id", user.id);

    // 4. Credit transactions
    await admin.from("credit_transactions").delete().eq("user_id", user.id);

    // 5. Credits
    await admin.from("credits").delete().eq("user_id", user.id);

    // 6. Audits (set user_id to null so shared reports still work briefly)
    await admin.from("audits").update({ user_id: null }).eq("user_id", user.id);

    // 7. Delete the auth user (this cascades any remaining FK references)
    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error("Failed to delete auth user:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete account. Please contact support." },
        { status: 500 }
      );
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please contact support." },
      { status: 500 }
    );
  }
}
