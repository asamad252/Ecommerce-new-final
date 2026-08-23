import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function CartButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let cartCount = 0;

  if (user) {
    const { data: cart } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (cart) {
      const { data: cartItems } = await supabase
        .from("cart_items")
        .select("quantity")
        .eq("cart_id", cart.id);

      cartCount =
        cartItems?.reduce(
          (total, item) =>
            total + Number(item.quantity ?? 0),
          0
        ) ?? 0;
    }
  }

  return (
    <Link
      href="/cart"
      aria-label={`Shopping cart${
        cartCount > 0
          ? `, ${cartCount} items`
          : ""
      }`}
      className="
        group
        relative
        inline-flex
        h-10
        min-w-10
        items-center
        justify-center
        gap-2
        overflow-hidden
        rounded-full
        border
        border-[#D9E8E2]/10
        bg-transparent
        px-3
        text-[#F1F6F4]
        no-underline
        transition-all
        duration-200
        hover:border-[#FFC801]/40
        hover:text-[#172B36]
      "
    >
      {/* Hover circle — same idea as PillNav */}
      <span
        aria-hidden="true"
        className="
          absolute
          left-1/2
          top-1/2
          h-14
          w-14
          -translate-x-1/2
          -translate-y-1/2
          scale-0
          rounded-full
          bg-[#FFC801]
          transition-transform
          duration-300
          ease-out
          group-hover:scale-[1.35]
        "
      />

      {/* Content */}
      <span className="relative z-10 inline-flex items-center gap-2">
        <ShoppingCart
          size={17}
          strokeWidth={2}
          className="shrink-0"
        />

        <span className="hidden text-[11px] font-black uppercase tracking-[0.04em] xl:inline">
          Cart
        </span>

        {cartCount > 0 && (
          <span
            className="
              inline-flex
              min-w-[18px]
              h-[18px]
              items-center
              justify-center
              rounded-full
              bg-[#FF9932]
              px-1
              text-[9px]
              font-black
              leading-none
              text-[#172B36]
              transition-colors
              group-hover:bg-[#172B36]
              group-hover:text-[#FFC801]
            "
          >
            {cartCount > 99
              ? "99+"
              : cartCount}
          </span>
        )}
      </span>
    </Link>
  );
}