import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data/storeData";
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

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const categoryName = Array.isArray(product.categories)
    ? product.categories[0]?.name
    : product.categories?.name ?? null;

  const brandName = Array.isArray(product.brands)
    ? product.brands[0]?.name
    : product.brands?.name ?? null;

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
            categoryName={categoryName}
            brandName={brandName}
          />
        </div>
      </div>
    </main>
  );
}