import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      description,
      price,
      compare_at_price,
      stock,
      brands (
        name
      ),
      categories (
        name
      ),
      product_images (
        id,
        image_url,
        alt_text,
        sort_order,
        is_primary
      )
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Product fetch error:", error);
  }

  if (!product) {
    notFound();
  }

  return (
    <main className="bg-[#F1F6F4] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery
            images={product.product_images ?? []}
            productName={product.name}
          />

          <ProductInfo
            id={product.id}
            name={product.name}
            slug={product.slug}
            description={product.description}
            price={Number(product.price)}
            compareAtPrice={
              product.compare_at_price !== null
                ? Number(product.compare_at_price)
                : null
            }
            stock={product.stock}
            categoryName={product.categories?.[0]?.name ?? null}
            brandName={product.brands?.[0]?.name ?? null}
          />
        </div>
      </div>
    </main>
  );
}