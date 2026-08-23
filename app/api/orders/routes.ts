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
    const addressId = Number(body.addressId);

    if (!Number.isInteger(addressId)) {
      return NextResponse.json(
        { error: "Invalid address." },
        { status: 400 }
      );
    }

    // Get shipping address
    const { data: address, error: addressError } =
      await supabase
        .from("addresses")
        .select("*")
        .eq("id", addressId)
        .eq("user_id", user.id)
        .maybeSingle();

    if (addressError || !address) {
      return NextResponse.json(
        { error: "Shipping address not found." },
        { status: 404 }
      );
    }

    // Get user's cart
    const { data: cart } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!cart) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    // Get cart items
    const { data: cartItems, error: cartError } =
      await supabase
        .from("cart_items")
        .select(`
          id,
          quantity,
          product_id,
          products (
            id,
            name,
            sku,
            price,
            stock,
            is_active
          )
        `)
        .eq("cart_id", cart.id);

    if (cartError) {
      console.error(cartError);

      return NextResponse.json(
        { error: "Unable to load cart." },
        { status: 500 }
      );
    }

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    // Validate stock and calculate subtotal
    let subtotal = 0;

    for (const item of cartItems) {
      const product = Array.isArray(item.products)
        ? item.products[0]
        : item.products;

      if (!product || !product.is_active) {
        return NextResponse.json(
          {
            error:
              "One of the products in your cart is no longer available.",
          },
          { status: 400 }
        );
      }

      if (item.quantity > product.stock) {
        return NextResponse.json(
          {
            error: `${product.name} only has ${product.stock} item(s) available.`,
          },
          { status: 400 }
        );
      }

      subtotal +=
        Number(product.price) * item.quantity;
    }

    const shippingFee = 0;
    const discount = 0;
    const total = subtotal + shippingFee - discount;

    const orderNumber = `NG-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    // Create order
    const { data: order, error: orderError } =
      await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          status: "pending",
          payment_status: "pending",
          subtotal,
          shipping_fee: shippingFee,
          discount,
          total,

          shipping_name: address.recipient_name,
          shipping_phone: address.phone,
          shipping_address: [
            address.address_line1,
            address.address_line2,
          ]
            .filter(Boolean)
            .join(", "),
          shipping_city: address.city,
          shipping_province: address.province,
          shipping_postal_code: address.postal_code,
          shipping_country: address.country,
        })
        .select()
        .single();

    if (orderError || !order) {
      console.error("Order creation error:", orderError);

      return NextResponse.json(
        { error: "Unable to create order." },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = cartItems
      .map((item) => ({
        item,
        product: Array.isArray(item.products)
          ? item.products[0]
          : item.products,
      }))
      .filter(({ product }) => product)
      .map((item) => ({
        order_id: order.id,
        product_id: item.item.product_id,
        product_name: item.product!.name,
        sku: item.product!.sku,
        quantity: item.item.quantity,
        unit_price: Number(item.product!.price),
        total_price:
          Number(item.product!.price) * item.item.quantity,
      }));

    const { error: orderItemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (orderItemsError) {
      console.error(
        "Order items creation error:",
        orderItemsError
      );

      // Remove incomplete order
      await supabase
        .from("orders")
        .delete()
        .eq("id", order.id);

      return NextResponse.json(
        { error: "Unable to create order items." },
        { status: 500 }
      );
    }

    // Clear cart
    const { error: clearCartError } = await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cart.id);

    if (clearCartError) {
      console.error(
        "Cart cleanup error:",
        clearCartError
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        total: order.total,
      },
    });
  } catch (error) {
    console.error("Order API error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}