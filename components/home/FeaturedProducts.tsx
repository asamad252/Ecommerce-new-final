import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import FeaturedProductsGallery from "./FeaturedProductsGallery";

export default async function FeaturedProducts() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      compare_at_price,
      product_images (
        image_url,
        is_primary,
        sort_order
      )
    `)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) {
    console.error("Failed to fetch featured products:", error);
  }

  const galleryProducts =
    products?.map((product) => {
      const images = Array.isArray(product.product_images)
        ? product.product_images
        : [];

      const primaryImage =
        images.find((image) => image.is_primary) ??
        [...images].sort(
          (a, b) => a.sort_order - b.sort_order
        )[0];

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        compareAtPrice: product.compare_at_price
          ? Number(product.compare_at_price)
          : null,
        image: primaryImage?.image_url ?? null,
      };
    }) ?? [];

  return (
    <section className="relative overflow-hidden bg-[#D9E8E2] py-20">
  <div className="pointer-events-none absolute inset-0">
    <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#FFC801]/10 blur-3xl" />
    <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#FF9932]/10 blur-3xl" />
  </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FFC801]">
              Featured
            </p>

            <h2 className="mt-2 text-4xl font-black tracking-tight text-[#114C5A] sm:text-5xl">
              Trending gear
            </h2>

            <p className="mt-3 max-w-xl text-[#114C5A]/75">
              Products gamers are checking out right now.
            </p>
          </div>

          <Link
            href="/shop"
            className="hidden items-center gap-2 rounded-full border border-[#D9E8E2] bg-white px-5 py-3 font-bold text-[#114C5A] transition-all duration-300 hover:border-[#FFC801] hover:bg-[#FFC801] hover:text-[#114C5A] sm:flex"
          >
            View all
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* Gallery */}
        {!galleryProducts.length ? (
          <div className="rounded-3xl border border-[#D9E8E2] bg-white p-10 text-center">
            <p className="font-semibold text-[#114C5A]">
              Featured products will appear here once products are added.
            </p>
          </div>
        ) : (
          <FeaturedProductsGallery products={galleryProducts} />
        )}

        {/* Mobile View All */}
        <div className="mt-8 sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-[#D9E8E2] bg-white px-5 py-3 font-bold text-[#114C5A] transition-all duration-300 hover:border-[#FFC801] hover:bg-[#FFC801]"
          >
            View all products
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}