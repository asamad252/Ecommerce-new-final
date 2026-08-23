import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

interface ShopFiltersProps {
  search?: string;
  category?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  brand?: string;
  inStock?: string;
}

export default async function ShopFilters({
  search,
  category,
  sort,
  minPrice,
  maxPrice,
  brand,
  inStock,
}: ShopFiltersProps) {
  const supabase = await createClient();

  const { data: brands, error } = await supabase
    .from("brands")
    .select("id, name, slug")
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch brands:", error);
  }

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();

    const values = {
      search,
      category,
      sort,
      minPrice,
      maxPrice,
      brand,
      inStock,
      ...overrides,
    };

    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    return params.toString()
      ? `/shop?${params.toString()}`
      : "/shop";
  };

  return (
    <aside className="w-full lg:w-64 lg:shrink-0">
      <div className="rounded-2xl border border-[#D9E8E2] bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#172B36]">
            Filters
          </h2>

          <Link
            href={buildUrl({
              minPrice: undefined,
              maxPrice: undefined,
              brand: undefined,
              inStock: undefined,
            })}
            className="text-xs font-bold text-[#FF9932] hover:text-[#114C5A]"
          >
            Clear
          </Link>
        </div>

        {/* Price */}
        <div className="mt-6 border-t border-[#D9E8E2] pt-5">
          <h3 className="text-sm font-black text-[#172B36]">
            Price
          </h3>

          <form className="mt-3 space-y-3" action="/shop">
            {search && (
              <input type="hidden" name="search" value={search} />
            )}

            {category && (
              <input type="hidden" name="category" value={category} />
            )}

            {sort && (
              <input type="hidden" name="sort" value={sort} />
            )}

            {brand && (
              <input type="hidden" name="brand" value={brand} />
            )}

            {inStock && (
              <input type="hidden" name="inStock" value={inStock} />
            )}

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                name="minPrice"
                min="0"
                defaultValue={minPrice}
                placeholder="Min"
                className="w-full rounded-lg border border-[#D9E8E2] bg-[#F1F6F4] px-3 py-2 text-sm text-[#172B36] outline-none focus:border-[#FFC801]"
              />

              <input
                type="number"
                name="maxPrice"
                min="0"
                defaultValue={maxPrice}
                placeholder="Max"
                className="w-full rounded-lg border border-[#D9E8E2] bg-[#F1F6F4] px-3 py-2 text-sm text-[#172B36] outline-none focus:border-[#FFC801]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#114C5A] px-4 py-2.5 text-sm font-bold text-[#F1F6F4] transition hover:bg-[#172B36]"
            >
              Apply Price
            </button>
          </form>
        </div>

        {/* Brands */}
        <div className="mt-6 border-t border-[#D9E8E2] pt-5">
          <h3 className="text-sm font-black text-[#172B36]">
            Brand
          </h3>

          <div className="mt-3 space-y-1">
            {brands?.map((item) => {
              const active = brand === item.slug;

              return (
                <Link
                  key={item.id}
                  href={buildUrl({
                    brand: active ? undefined : item.slug,
                  })}
                  className={`block rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-[#114C5A] text-[#F1F6F4]"
                      : "text-[#114C5A] hover:bg-[#D9E8E2]"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Stock */}
        <div className="mt-6 border-t border-[#D9E8E2] pt-5">
          <h3 className="text-sm font-black text-[#172B36]">
            Availability
          </h3>

          <Link
            href={buildUrl({
              inStock: inStock === "true" ? undefined : "true",
            })}
            className="mt-3 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-[#114C5A] transition hover:bg-[#D9E8E2]"
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded border ${
                inStock === "true"
                  ? "border-[#FFC801] bg-[#FFC801]"
                  : "border-[#114C5A]/30"
              }`}
            >
              {inStock === "true" && (
                <span className="h-2 w-2 rounded-full bg-[#172B36]" />
              )}
            </span>

            In stock only
          </Link>
        </div>
      </div>
    </aside>
  );
}