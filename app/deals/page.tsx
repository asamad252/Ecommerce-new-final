import { getDealsProducts } from "@/lib/data/storeData";
import ProductCard from "@/components/home/ProductCard";
import ElectricBorder from "@/components/ui/ElectricBorder";
import { Zap } from "lucide-react";

export default async function DealsPage() {
  const deals = await getDealsProducts(30);

  return (
    <main className="bg-[#F1F6F4] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Electrifying Header Banner */}
        <div className="mb-12">
          <ElectricBorder
            color="#FFC801"
            speed={1}
            chaos={0.12}
            borderRadius={28}
            className="w-full shadow-xl"
          >
            <div className="relative overflow-hidden rounded-[28px] bg-[#172B36] p-8 md:p-12 text-[#F1F6F4]">
              {/* Background gradient lights */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#FFC801]/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[#FF9932]/15 blur-3xl" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#FFC801]/30 bg-[#FFC801]/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#FFC801]">
                    <Zap size={14} className="fill-[#FFC801] stroke-[#FFC801]" />
                    <span>NexGear Electric Deals</span>
                  </div>

                  <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
                    Level up for less.
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm md:text-base text-[#D9E8E2]/90">
                    Explore high-voltage discounts, flash bundle deals, and premium hardware markdowns.
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <div className="rounded-2xl border border-[#FFC801]/30 bg-[#12242F] px-5 py-3 text-center">
                    <p className="text-2xl font-black text-[#FFC801]">{deals.length}</p>
                    <p className="text-xs font-bold text-[#D9E8E2]/70 uppercase tracking-wider">Active Deals</p>
                  </div>
                  <div className="rounded-2xl border border-[#FF9932]/30 bg-[#12242F] px-5 py-3 text-center">
                    <p className="text-2xl font-black text-[#FF9932]">-40%</p>
                    <p className="text-xs font-bold text-[#D9E8E2]/70 uppercase tracking-wider">Max Savings</p>
                  </div>
                </div>
              </div>
            </div>
          </ElectricBorder>
        </div>

        {/* Deals Listing */}
        {deals.length === 0 ? (
          <div className="rounded-2xl border border-[#D9E8E2] bg-white p-12 text-center">
            <h2 className="text-2xl font-black text-[#172B36]">
              No deals available right now
            </h2>

            <p className="mt-2 text-[#114C5A]">
              Check back soon for new offers.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {deals.map((product) => {
              const images = Array.isArray(product.product_images)
                ? product.product_images
                : [];

              const primaryImage =
                images.find((image) => image.is_primary) ??
                [...images].sort(
                  (a, b) => a.sort_order - b.sort_order
                )[0];

              return (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={Number(product.price)}
                  compareAtPrice={
                    product.compare_at_price !== null
                      ? Number(product.compare_at_price)
                      : null
                  }
                  imageUrl={primaryImage?.image_url ?? null}
                />
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
