import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/tiers";

export async function GET() {
  try {
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const tier = await getUserTier(user.id);
    if (tier !== "agency") {
      return NextResponse.json({ error: "Custom branding requires the Agency plan" }, { status: 403 });
    }

    const supabase = createAdminClient();
    const { data } = await supabase
      .from("branding_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    return NextResponse.json({
      branding: data || {
        company_name: "",
        logo_url: "",
        primary_color: "#7c3aed",
        secondary_color: "#6d28d9",
        footer_text: "",
      },
    });
  } catch (error) {
    console.error("Branding GET error:", error);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const tier = await getUserTier(user.id);
    if (tier !== "agency") {
      return NextResponse.json({ error: "Custom branding requires the Agency plan" }, { status: 403 });
    }

    const body = await request.json();
    const { company_name, logo_url, primary_color, secondary_color, footer_text } = body as {
      company_name?: string;
      logo_url?: string;
      primary_color?: string;
      secondary_color?: string;
      footer_text?: string;
    };

    const supabase = createAdminClient();

    // Upsert branding settings
    const { data: existing } = await supabase
      .from("branding_settings")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (existing) {
      const { error } = await supabase
        .from("branding_settings")
        .update({
          company_name: company_name || "",
          logo_url: logo_url || "",
          primary_color: primary_color || "#7c3aed",
          secondary_color: secondary_color || "#6d28d9",
          footer_text: footer_text || "",
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) {
        console.error("Branding update error:", error);
        return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
      }
    } else {
      const { error } = await supabase.from("branding_settings").insert({
        user_id: user.id,
        company_name: company_name || "",
        logo_url: logo_url || "",
        primary_color: primary_color || "#7c3aed",
        secondary_color: secondary_color || "#6d28d9",
        footer_text: footer_text || "",
      });

      if (error) {
        console.error("Branding insert error:", error);
        return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Branding POST error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
