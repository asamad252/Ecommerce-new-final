import ShopHeader from "@/components/shop/ShopHeader";
import CategorySidebar from "@/components/shop/CategorySidebar";
import ShopFilters from "@/components/shop/ShopFilters";
import ProductSort from "@/components/shop/ProductSort";
import ProductGrid from "@/components/shop/ProductGrid";

interface ShopPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    brand?: string;
    inStock?: string;
  }>;
}

export default async function ShopPage({
  searchParams,
}: ShopPageProps) {
  const params = await searchParams;

  return (
    <>
      <ShopHeader
        search={params.search}
        category={params.category}
      />

      <main className="bg-[#F1F6F4] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="space-y-6">
              <CategorySidebar currentCategory={params.category} />

              <ShopFilters
                search={params.search}
                category={params.category}
                sort={params.sort}
                minPrice={params.minPrice}
                maxPrice={params.maxPrice}
                brand={params.brand}
                inStock={params.inStock}
              />
            </div>

            <div className="min-w-0 flex-1">
              <ProductSort
                currentSort={params.sort}
                search={params.search}
                category={params.category}
              />

              <div className="mt-6">
                <ProductGrid
                  search={params.search}
                  category={params.category}
                  sort={params.sort}
                  minPrice={params.minPrice}
                  maxPrice={params.maxPrice}
                  brand={params.brand}
                  inStock={params.inStock}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}