import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      label,
      recipientName,
      phone,
      addressLine1,
      addressLine2,
      city,
      province,
      postalCode,
      country,
      isDefault,
    } = body;

    if (
      !recipientName ||
      !phone ||
      !addressLine1 ||
      !city ||
      !country
    ) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (isDefault) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);
    }

    const { data: address, error } = await supabase
      .from("addresses")
      .insert({
        user_id: user.id,
        label: label || null,
        recipient_name: recipientName,
        phone,
        address_line1: addressLine1,
        address_line2: addressLine2 || null,
        city,
        province: province || null,
        postal_code: postalCode || null,
        country,
        is_default: Boolean(isDefault),
      })
      .select()
      .single();

    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: "Unable to save address." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      address,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const addressId = Number(body.addressId);

    if (!Number.isInteger(addressId)) {
      return NextResponse.json(
        { error: "Invalid address." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", addressId)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json(
        { error: "Unable to delete address." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}