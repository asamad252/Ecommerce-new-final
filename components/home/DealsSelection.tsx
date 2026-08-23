import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function DealsSection() {
  const supabase = await createClient();

  const { data: deals, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      compare_at_price
    `)
    .eq("is_active", true)
    .not("compare_at_price", "is", null)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Failed to fetch deals:", error);
  }

  const validDeals =
    deals?.filter(
      (product) =>
        product.compare_at_price !== null &&
        Number(product.compare_at_price) > Number(product.price)
    ) ?? [];

  return (
    <section className="relative bg-transparent py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 rounded-[2rem] bg-[#172B36] p-8 md:p-12 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 text-[#FFC801]">
              <Tag size={20} />

              <p className="text-sm font-bold uppercase tracking-[0.18em]">
                Limited time deals
              </p>
            </div>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#F1F6F4] md:text-5xl">
              Level up without breaking the bank.
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-[#D9E8E2]">
              Get more gaming gear for less with exclusive NexGear offers.
            </p>

            <Link
              href="/deals"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#FFC801] px-6 py-3.5 font-bold text-[#172B36] transition hover:bg-[#FF9932]"
            >
              Shop Deals
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-4">
            {validDeals.length === 0 ? (
              <div className="rounded-2xl bg-[#FFC801] p-8">
                <p className="text-2xl font-black text-[#172B36]">
                  Deals coming soon.
                </p>

                <p className="mt-2 text-[#172B36]/80">
                  Check back soon for exclusive NexGear discounts.
                </p>
              </div>
            ) : (
              validDeals.map((deal) => {
                const oldPrice = Number(deal.compare_at_price);
                const newPrice = Number(deal.price);

                const discount = Math.round(
                  ((oldPrice - newPrice) / oldPrice) * 100
                );

                return (
                  <Link
                    key={deal.id}
                    href={`/product/${deal.slug}`}
                    className="flex items-center justify-between rounded-2xl bg-[#F1F6F4] p-5 transition hover:bg-[#D9E8E2]"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-bold text-[#172B36]">
                        {deal.name}
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-black text-[#114C5A]">
                          Rs. {newPrice.toLocaleString("en-PK")}
                        </span>

                        <span className="text-sm text-[#114C5A]/50 line-through">
                          Rs. {oldPrice.toLocaleString("en-PK")}
                        </span>
                      </div>
                    </div>

                    <span className="ml-4 shrink-0 rounded-full bg-[#FF9932] px-3 py-1 text-sm font-black text-[#172B36]">
                      -{discount}%
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}