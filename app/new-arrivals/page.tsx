import { getShopProducts } from "@/lib/data/storeData";
import ProductCard from "@/components/home/ProductCard";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import MaskedHeading from "@/components/ui/MaskedHeading";

export default async function NewArrivalsPage() {
  const products = await getShopProducts({ sort: "newest" });

  return (
    <main className="bg-[#F1F6F4] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[#FF9932]">
              <Sparkles size={18} />
              <p className="text-sm font-bold uppercase tracking-[0.18em]">
                Fresh Drops
              </p>
            </div>

            <div className="mt-2">
              <MaskedHeading
                text="New Arrivals"
                tag="h1"
                align="left"
                weight={900}
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80"
                fillScale={1.3}
                parallax={24}
                drift={14}
                reveal="wipe"
                trigger="mount"
                textScale={0.09}
                className="font-black drop-shadow-sm text-[#172B36]"
              />
            </div>

            <p className="mt-4 max-w-2xl text-[#114C5A]">
              The latest flagship releases, hardware drops, and newly restocked gaming gear.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#114C5A] px-5 py-3 text-sm font-bold text-[#F1F6F4] shadow-md transition hover:bg-[#172B36] active:scale-95"
          >
            <span>All Products</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const images = Array.isArray(product.product_images)
              ? product.product_images
              : [];

            const primaryImage =
              images.find((image) => image.is_primary) ??
              [...images].sort((a, b) => a.sort_order - b.sort_order)[0];

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
      </div>
    </main>
  );
}
