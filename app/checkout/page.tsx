import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";

export default async function CheckoutPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!cart) {
    redirect("/cart");
  }

  const { data: cartItems } = await supabase
    .from("cart_items")
    .select(`
      id,
      quantity,
      product_id,
      products (
        id,
        name,
        price,
        stock
      )
    `)
    .eq("cart_id", cart.id);

  if (!cartItems || cartItems.length === 0) {
    redirect("/cart");
  }

  const checkoutItems = cartItems.flatMap((item) => {
    const product = item.products[0];

    return product ? [{ ...item, products: product }] : [];
  });

  const subtotal = checkoutItems.reduce((total, item) => {
    if (!item.products) return total;

    return (
      total +
      Number(item.products.price) * item.quantity
    );
  }, 0);

  return (
    <main className="bg-[#F1F6F4] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <Link
            href="/cart"
            className="text-sm font-bold text-[#114C5A] hover:text-[#FF9932]"
          >
            ← Back to cart
          </Link>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-[#172B36]">
            Checkout
          </h1>

          <p className="mt-2 text-[#114C5A]">
            Complete your order securely.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <CheckoutForm
            addresses={addresses ?? []}
          />

          <CheckoutSummary
            items={checkoutItems}
            subtotal={subtotal}
          />
        </div>
      </div>
    </main>
  );
}