import { getShopProducts } from "@/lib/data/storeData";
import ProductCard from "@/components/home/ProductCard";

interface ProductGridProps {
  search?: string;
  category?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  brand?: string;
  inStock?: string;
}

export default async function ProductGrid({
  search,
  category,
  sort = "newest",
  minPrice,
  maxPrice,
  brand,
  inStock,
}: ProductGridProps) {
  const products = await getShopProducts({
    search,
    category,
    sort,
    minPrice,
    maxPrice,
    brand,
    inStock,
  });

  if (!products || products.length === 0) {
    return (
      <div className="rounded-2xl border border-[#D9E8E2] bg-white p-12 text-center">
        <h2 className="text-xl font-black text-[#172B36]">
          No products found
        </h2>

        <p className="mt-2 text-[#114C5A]">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => {
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
  );
}