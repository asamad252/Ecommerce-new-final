import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/home/ProductCard";

export default async function DealsPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      compare_at_price,
      stock,
      product_images (
        image_url,
        is_primary,
        sort_order
      )
    `)
    .eq("is_active", true)
    .not("compare_at_price", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch deals:", error);
  }

  const deals =
    products?.filter(
      (product) =>
        product.compare_at_price !== null &&
        Number(product.compare_at_price) > Number(product.price)
    ) ?? [];

  return (
    <main className="bg-[#F1F6F4] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FF9932]">
            NexGear Deals
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-[#172B36] md:text-5xl">
            Level up for less.
          </h1>

          <p className="mt-4 max-w-2xl text-[#114C5A]">
            Explore the latest NexGear discounts and gaming deals.
          </p>
        </div>

        {/* Deals */}
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