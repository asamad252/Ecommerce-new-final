import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface AddToCartBody {
  productId: number;
  quantity: number;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "You must be logged in to add items to your cart.",
        },
        { status: 401 }
      );
    }

    // Read request body
    const body = (await request.json()) as AddToCartBody;

    const productId = Number(body.productId);
    const requestedQuantity = Number(body.quantity);

    if (
      !Number.isInteger(productId) ||
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity <= 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid product or quantity.",
        },
        { status: 400 }
      );
    }

    // Get product
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, name, stock, is_active")
      .eq("id", productId)
      .maybeSingle();

    if (productError) {
      console.error("Product lookup error:", productError);

      return NextResponse.json(
        {
          error: "Unable to retrieve product.",
        },
        { status: 500 }
      );
    }

    if (!product || !product.is_active) {
      return NextResponse.json(
        {
          error: "Product not found.",
        },
        { status: 404 }
      );
    }

    if (product.stock <= 0) {
      return NextResponse.json(
        {
          error: "This product is out of stock.",
        },
        { status: 400 }
      );
    }

    if (requestedQuantity > product.stock) {
      return NextResponse.json(
        {
          error: `Only ${product.stock} item(s) are available.`,
        },
        { status: 400 }
      );
    }

    // Find user's cart
    const { data: existingCart, error: cartLookupError } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (cartLookupError) {
      console.error("Cart lookup error:", cartLookupError);

      return NextResponse.json(
        {
          error: "Unable to retrieve cart.",
        },
        { status: 500 }
      );
    }

    let cartId = existingCart?.id;

    // Create cart if the user doesn't have one
    if (!cartId) {
      const { data: newCart, error: createCartError } = await supabase
        .from("carts")
        .insert({
          user_id: user.id,
        })
        .select("id")
        .single();

      if (createCartError) {
        console.error("Cart creation error:", createCartError);

        return NextResponse.json(
          {
            error: "Unable to create cart.",
          },
          { status: 500 }
        );
      }

      cartId = newCart.id;
    }

    // Check whether product is already in cart
    const { data: existingItem, error: itemLookupError } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", cartId)
      .eq("product_id", productId)
      .maybeSingle();

    if (itemLookupError) {
      console.error("Cart item lookup error:", itemLookupError);

      return NextResponse.json(
        {
          error: "Unable to retrieve cart item.",
        },
        { status: 500 }
      );
    }

    if (existingItem) {
      const newQuantity =
        existingItem.quantity + requestedQuantity;

      if (newQuantity > product.stock) {
        return NextResponse.json(
          {
            error: `You can only have up to ${product.stock} of this product in your cart.`,
          },
          { status: 400 }
        );
      }

      const { data: updatedItem, error: updateError } = await supabase
        .from("cart_items")
        .update({
          quantity: newQuantity,
        })
        .eq("id", existingItem.id)
        .select("id, cart_id, product_id, quantity")
        .single();

      if (updateError) {
        console.error("Cart item update error:", updateError);

        return NextResponse.json(
          {
            error: "Unable to update cart.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Cart updated successfully.",
        item: updatedItem,
      });
    }

    // Add new item
    const { data: newItem, error: insertError } = await supabase
      .from("cart_items")
      .insert({
        cart_id: cartId,
        product_id: productId,
        quantity: requestedQuantity,
      })
      .select("id, cart_id, product_id, quantity")
      .single();

    if (insertError) {
      console.error("Cart item insert error:", insertError);

      return NextResponse.json(
        {
          error: "Unable to add item to cart.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product added to cart.",
      item: newItem,
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
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

    const cartItemId = Number(body.cartItemId);
    const quantity = Number(body.quantity);

    if (
      !Number.isInteger(cartItemId) ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid cart item or quantity." },
        { status: 400 }
      );
    }

    const { data: item, error: itemError } = await supabase
      .from("cart_items")
      .select(`
        id,
        product_id,
        carts!inner (
          user_id
        )
      `)
      .eq("id", cartItemId)
      .maybeSingle();

    if (itemError || !item) {
      return NextResponse.json(
        { error: "Cart item not found." },
        { status: 404 }
      );
    }

    if (item.carts[0]?.user_id !== user.id) {
      return NextResponse.json(
        { error: "You cannot modify this cart item." },
        { status: 403 }
      );
    }

    const { data: product } = await supabase
      .from("products")
      .select("stock")
      .eq("id", item.product_id)
      .maybeSingle();

    if (!product || quantity > product.stock) {
      return NextResponse.json(
        {
          error: `Only ${product?.stock ?? 0} item(s) are available.`,
        },
        { status: 400 }
      );
    }

    const { data: updatedItem, error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", cartItemId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Unable to update cart." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      item: updatedItem,
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

    const cartItemId = Number(body.cartItemId);

    if (!Number.isInteger(cartItemId)) {
      return NextResponse.json(
        { error: "Invalid cart item." },
        { status: 400 }
      );
    }

    const { data: item } = await supabase
      .from("cart_items")
      .select(`
        id,
        carts!inner (
          user_id
        )
      `)
      .eq("id", cartItemId)
      .maybeSingle();

    if (!item) {
      return NextResponse.json(
        { error: "Cart item not found." },
        { status: 404 }
      );
    }

    if (item.carts[0]?.user_id !== user.id) {
      return NextResponse.json(
        { error: "You cannot remove this cart item." },
        { status: 403 }
      );
    }

    const { error: deleteError } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId);

    if (deleteError) {
      return NextResponse.json(
        { error: "Unable to remove cart item." },
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