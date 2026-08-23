import Link from "next/link";

interface CartSummaryProps {
  subtotal: number;
}

export default function CartSummary({
  subtotal,
}: CartSummaryProps) {
  return (
    <aside className="h-fit rounded-2xl border border-[#D9E8E2] bg-white p-6">
      <h2 className="text-xl font-black text-[#172B36]">
        Order summary
      </h2>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#114C5A]">Subtotal</span>

          <span className="font-bold text-[#172B36]">
            Rs. {subtotal.toLocaleString("en-PK")}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-[#D9E8E2] pb-4 text-sm">
          <span className="text-[#114C5A]">Shipping</span>

          <span className="font-bold text-[#172B36]">
            Calculated at checkout
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-black text-[#172B36]">
            Total
          </span>

          <span className="text-2xl font-black text-[#114C5A]">
            Rs. {subtotal.toLocaleString("en-PK")}
          </span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="mt-7 flex h-12 items-center justify-center rounded-xl bg-[#FFC801] font-black text-[#172B36] transition hover:bg-[#FF9932]"
      >
        Proceed to Checkout
      </Link>

      <Link
        href="/shop"
        className="mt-3 flex h-11 items-center justify-center rounded-xl border border-[#114C5A] font-bold text-[#114C5A] transition hover:bg-[#D9E8E2]"
      >
        Continue Shopping
      </Link>
    </aside>
  );
}