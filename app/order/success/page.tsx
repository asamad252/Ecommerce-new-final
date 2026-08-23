import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function OrderSuccessGeneralPage() {
  return (
    <main className="min-h-[70vh] bg-[#F1F6F4] py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#D9E8E2] text-[#114C5A]">
          <CheckCircle2 size={42} />
        </div>

        <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-[#FF9932]">
          Order confirmed
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-tight text-[#172B36]">
          Thank you for your order!
        </h1>

        <p className="mt-3 text-[#114C5A]">
          Your NexGear order has been successfully placed and is being processed.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFC801] px-6 py-3 font-bold text-[#172B36] transition hover:bg-[#FF9932]"
          >
            Continue Shopping
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/account/orders"
            className="inline-flex items-center justify-center rounded-xl border border-[#114C5A] px-6 py-3 font-bold text-[#114C5A] transition hover:bg-[#D9E8E2]"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </main>
  );
}
