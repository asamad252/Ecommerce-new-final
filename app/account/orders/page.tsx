import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AccountNav from "@/components/account/AccountNav";

export default async function OrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      status,
      payment_status,
      total,
      created_at,
      order_items (
        id,
        product_name,
        quantity
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch orders:", error);
  }

  return (
    <main className="bg-[#F1F6F4] py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <AccountNav />

        <section className="mt-6 rounded-2xl border border-[#D9E8E2] bg-white p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FF9932]">
            Purchase history
          </p>

          <h1 className="mt-2 text-3xl font-black text-[#172B36]">
            My Orders
          </h1>

          {!orders || orders.length === 0 ? (
            <div className="mt-10 rounded-2xl bg-[#F1F6F4] p-8 text-center">
              <p className="font-bold text-[#172B36]">
                You haven't placed any orders yet.
              </p>

              <Link
                href="/shop"
                className="mt-5 inline-block rounded-xl bg-[#FFC801] px-6 py-3 font-bold text-[#172B36] transition hover:bg-[#FF9932]"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {orders.map((order) => {
                const date = new Date(
                  order.created_at
                ).toLocaleDateString("en-PK", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <Link
                    key={order.id}
                    href={`/order/success/${order.id}`}
                    className="block rounded-2xl border border-[#D9E8E2] p-5 transition hover:border-[#FFC801] hover:bg-[#F1F6F4]"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-black text-[#172B36]">
                          #{order.order_number}
                        </p>

                        <p className="mt-1 text-sm text-[#114C5A]">
                          {date}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-[#D9E8E2] px-3 py-1 text-xs font-black capitalize text-[#114C5A]">
                          {order.status}
                        </span>

                        <span className="font-black text-[#114C5A]">
                          Rs.{" "}
                          {Number(order.total).toLocaleString(
                            "en-PK"
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-[#114C5A]">
                      {order.order_items.length}{" "}
                      {order.order_items.length === 1
                        ? "item"
                        : "items"}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}