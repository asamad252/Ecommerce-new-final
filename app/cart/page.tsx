import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/data/storeData";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";

export default async function CartPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="min-h-[60vh] bg-[#F1F6F4] px-4 py-16">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D9E8E2] text-[#114C5A]">
            <ShoppingCart size={28} />
          </div>

          <h1 className="mt-6 text-3xl font-black text-[#172B36]">
            Your cart is empty
          </h1>

          <p className="mt-3 text-[#114C5A]">
            You haven&apos;t added anything to your cart yet. Explore our catalog to find your next gear!
          </p>

          <div className="mt-7 flex justify-center gap-3">
            <Link
              href="/shop"
              className="rounded-xl bg-[#FFC801] px-6 py-3 font-bold text-[#172B36] transition hover:bg-[#FF9932]"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  let user = null;
  let supabase = null;
  try {
    supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch {
    user = null;
  }

  if (!user || !supabase) {
    return (
      <main className="min-h-[60vh] bg-[#F1F6F4] px-4 py-16">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D9E8E2] text-[#114C5A]">
            <ShoppingCart size={28} />
          </div>

          <h1 className="mt-6 text-3xl font-black text-[#172B36]">
            Login to view your cart
          </h1>

          <p className="mt-3 text-[#114C5A]">
            Sign in to access your NexGear shopping cart.
          </p>

          <div className="mt-7 flex justify-center gap-3">
            <Link
              href="/login"
              className="rounded-xl bg-[#FFC801] px-6 py-3 font-bold text-[#172B36] transition hover:bg-[#FF9932]"
            >
              Login
            </Link>

            <Link
              href="/shop"
              className="rounded-xl border border-[#114C5A] px-6 py-3 font-bold text-[#114C5A] transition hover:bg-[#D9E8E2]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { data: cart, error: cartError } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (cartError) {
    console.error("Failed to fetch cart:", cartError);
  }

  if (!cart) {
    return (
      <main className="min-h-[60vh] bg-[#F1F6F4] px-4 py-16">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D9E8E2] text-[#114C5A]">
            <ShoppingCart size={28} />
          </div>

          <h1 className="mt-6 text-3xl font-black text-[#172B36]">
            Your cart is empty
          </h1>

          <p className="mt-3 text-[#114C5A]">
            You haven&apos;t added anything to your cart yet.
          </p>

          <Link
            href="/shop"
            className="mt-7 inline-block rounded-xl bg-[#FFC801] px-6 py-3 font-bold text-[#172B36] transition hover:bg-[#FF9932]"
          >
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  const { data: cartItems, error: itemsError } = await supabase
    .from("cart_items")
    .select(`
      id,
      quantity,
      product_id,
      products (
        id,
        name,
        slug,
        price,
        stock,
        product_images (
          image_url,
          is_primary,
          sort_order
        )
      )
    `)
    .eq("cart_id", cart.id)
    .order("created_at", { ascending: true });

  if (itemsError) {
    console.error("Failed to fetch cart items:", itemsError);
  }

  const items = cartItems ?? [];

  if (items.length === 0) {
    return (
      <main className="min-h-[60vh] bg-[#F1F6F4] px-4 py-16">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D9E8E2] text-[#114C5A]">
            <ShoppingCart size={28} />
          </div>

          <h1 className="mt-6 text-3xl font-black text-[#172B36]">
            Your cart is empty
          </h1>

          <p className="mt-3 text-[#114C5A]">
            Add some gear and come back here.
          </p>

          <Link
            href="/shop"
            className="mt-7 inline-block rounded-xl bg-[#FFC801] px-6 py-3 font-bold text-[#172B36] transition hover:bg-[#FF9932]"
          >
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  const subtotal = items.reduce((total, item) => {
    const product = Array.isArray(item.products)
      ? item.products[0]
      : item.products;

    if (!product) return total;

    return total + Number(product.price) * item.quantity;
  }, 0);

  return (
    <main className="bg-[#F1F6F4] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FF9932]">
            Shopping cart
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-[#172B36]">
            Your cart
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((item) => {
              const product = Array.isArray(item.products)
                ? item.products[0]
                : item.products;

              if (!product) return null;

              const images = Array.isArray(product.product_images)
                ? product.product_images
                : [];

              const primaryImage =
                images.find((image) => image.is_primary) ??
                [...images].sort(
                  (a, b) => a.sort_order - b.sort_order
                )[0];

              return (
                <CartItem
                  key={item.id}
                  cartItemId={item.id}
                  productId={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={Number(product.price)}
                  quantity={item.quantity}
                  stock={product.stock}
                  imageUrl={primaryImage?.image_url ?? null}
                />
              );
            })}
          </div>

          <CartSummary subtotal={subtotal} />
        </div>
      </div>
    </main>
  );
}