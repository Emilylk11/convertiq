import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    return NextResponse.json({
      profile: {
        display_name: user.user_metadata?.display_name || "",
        company_name: user.user_metadata?.company_name || "",
      },
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const { display_name, company_name } = body as {
      display_name?: string;
      company_name?: string;
    };

    // Validate lengths
    if (display_name && display_name.length > 100) {
      return NextResponse.json({ error: "Display name must be under 100 characters" }, { status: 400 });
    }
    if (company_name && company_name.length > 100) {
      return NextResponse.json({ error: "Company name must be under 100 characters" }, { status: 400 });
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        display_name: display_name?.trim() || "",
        company_name: company_name?.trim() || "",
      },
    });

    if (error) {
      console.error("Profile update error:", error);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile POST error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
