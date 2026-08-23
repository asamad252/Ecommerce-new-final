import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function CategorySidebar() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id")
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch categories:", error);
  }

  const parentCategories =
    categories?.filter((category) => category.parent_id === null) ?? [];

  return (
    <aside className="w-full lg:w-64 lg:shrink-0">
      <div className="rounded-2xl border border-[#D9E8E2] bg-white p-5">
        <h2 className="text-lg font-black text-[#172B36]">
          Categories
        </h2>

        <nav className="mt-5 space-y-2">
          <Link
            href="/shop"
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-[#114C5A] transition hover:bg-[#D9E8E2] hover:text-[#172B36]"
          >
            All Products
          </Link>

          {parentCategories.map((parent) => {
            const children =
              categories?.filter(
                (category) => category.parent_id === parent.id
              ) ?? [];

            return (
              <div key={parent.id}>
                <Link
                  href={`/shop?category=${parent.slug}`}
                  className="block rounded-lg px-3 py-2 text-sm font-bold text-[#172B36] transition hover:bg-[#D9E8E2]"
                >
                  {parent.name}
                </Link>

                {children.length > 0 && (
                  <div className="ml-3 space-y-1 border-l-2 border-[#D9E8E2] pl-3">
                    {children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/shop?category=${child.slug}`}
                        className="block py-1.5 text-sm text-[#114C5A] transition hover:text-[#FF9932]"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}