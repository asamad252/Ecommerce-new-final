import Link from "next/link";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface OrderSuccessPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderSuccessPage({
  params,
}: OrderSuccessPageProps) {
  const { id } = await params;

  const orderId = Number(id);

  if (!Number.isInteger(orderId)) {
    notFound();
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      status,
      payment_status,
      subtotal,
      shipping_fee,
      discount,
      total,
      shipping_name,
      shipping_phone,
      shipping_address,
      shipping_city,
      shipping_province,
      shipping_postal_code,
      shipping_country,
      created_at,
      order_items (
        id,
        product_name,
        sku,
        quantity,
        unit_price,
        total_price
      )
    `)
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch order:", error);
  }

  if (!order) {
    notFound();
  }

  const formattedDate = new Date(
    order.created_at
  ).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-[70vh] bg-[#F1F6F4] py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Success */}
        <div className="text-center">
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
            Your NexGear order has been successfully placed.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FFC801] px-5 py-2 text-sm font-black text-[#172B36]">
            Order #{order.order_number}
          </div>
        </div>

        {/* Order details */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Shipping */}
          <div className="rounded-2xl border border-[#D9E8E2] bg-white p-6">
            <div className="flex items-center gap-3">
              <Package size={21} className="text-[#114C5A]" />

              <h2 className="text-lg font-black text-[#172B36]">
                Shipping information
              </h2>
            </div>

            <div className="mt-5 space-y-2 text-sm text-[#114C5A]">
              <p className="font-bold text-[#172B36]">
                {order.shipping_name}
              </p>

              <p>{order.shipping_phone}</p>

              <p>
                {order.shipping_address}
                <br />
                {order.shipping_city}
                {order.shipping_province
                  ? `, ${order.shipping_province}`
                  : ""}
                {order.shipping_postal_code
                  ? ` ${order.shipping_postal_code}`
                  : ""}
                <br />
                {order.shipping_country}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="rounded-2xl border border-[#D9E8E2] bg-white p-6">
            <h2 className="text-lg font-black text-[#172B36]">
              Order status
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#114C5A]">
                  Order status
                </span>

                <span className="rounded-full bg-[#D9E8E2] px-3 py-1 text-xs font-black capitalize text-[#114C5A]">
                  {order.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#114C5A]">
                  Payment
                </span>

                <span className="rounded-full bg-[#D9E8E2] px-3 py-1 text-xs font-black capitalize text-[#114C5A]">
                  {order.payment_status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#114C5A]">
                  Order date
                </span>

                <span className="text-sm font-bold text-[#172B36]">
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mt-6 rounded-2xl border border-[#D9E8E2] bg-white p-6">
          <h2 className="text-xl font-black text-[#172B36]">
            Order summary
          </h2>

          <div className="mt-6 divide-y divide-[#D9E8E2]">
            {order.order_items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div className="min-w-0">
                  <p className="font-bold text-[#172B36]">
                    {item.product_name}
                  </p>

                  <p className="mt-1 text-sm text-[#114C5A]">
                    Qty: {item.quantity}
                  </p>

                  {item.sku && (
                    <p className="mt-1 text-xs text-[#114C5A]/60">
                      SKU: {item.sku}
                    </p>
                  )}
                </div>

                <p className="shrink-0 font-black text-[#114C5A]">
                  Rs.{" "}
                  {Number(item.total_price).toLocaleString(
                    "en-PK"
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-[#D9E8E2] pt-5">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#114C5A]">
                  Subtotal
                </span>

                <span className="font-bold text-[#172B36]">
                  Rs.{" "}
                  {Number(order.subtotal).toLocaleString(
                    "en-PK"
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#114C5A]">
                  Shipping
                </span>

                <span className="font-bold text-[#172B36]">
                  Rs.{" "}
                  {Number(order.shipping_fee).toLocaleString(
                    "en-PK"
                  )}
                </span>
              </div>

              {Number(order.discount) > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-[#114C5A]">
                    Discount
                  </span>

                  <span className="font-bold text-[#114C5A]">
                    - Rs.{" "}
                    {Number(order.discount).toLocaleString(
                      "en-PK"
                    )}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-[#D9E8E2] pt-4">
                <span className="text-lg font-black text-[#172B36]">
                  Total
                </span>

                <span className="text-2xl font-black text-[#114C5A]">
                  Rs.{" "}
                  {Number(order.total).toLocaleString(
                    "en-PK"
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
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