import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      description,
      price,
      compare_at_price,
      stock,
      created_at,
      category_id,
      brand_id,
      categories (
        slug
      ),
      product_images (
        image_url,
        is_primary,
        sort_order
      )
    `)
    .eq("is_active", true);

  // Search
  if (search) {
    const searchTerm = search.trim();

    if (searchTerm) {
      query = query.or(
        `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`
      );
    }
  }

  // Category
  if (category) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .maybeSingle();

    if (categoryData) {
      query = query.eq("category_id", categoryData.id);
    }
  }

  // Minimum price
  if (minPrice) {
    const value = Number(minPrice);

    if (!Number.isNaN(value)) {
      query = query.gte("price", value);
    }
  }

  // Maximum price
  if (maxPrice) {
    const value = Number(maxPrice);

    if (!Number.isNaN(value)) {
      query = query.lte("price", value);
    }
  }

  // Brand
  if (brand) {
    const { data: brandData } = await supabase
      .from("brands")
      .select("id")
      .eq("slug", brand)
      .maybeSingle();

    if (brandData) {
      query = query.eq("brand_id", brandData.id);
    }
  }

  // In stock
  if (inStock === "true") {
    query = query.gt("stock", 0);
  }

  // Sorting
  switch (sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;

    case "price-desc":
      query = query.order("price", { ascending: false });
      break;

    case "name-asc":
      query = query.order("name", { ascending: true });
      break;

    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  const { data: products, error } = await query.limit(24);

  if (error) {
    console.error("Failed to fetch products:", error);
  }

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