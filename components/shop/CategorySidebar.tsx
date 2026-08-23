import Link from "next/link";
import { getCategories } from "@/lib/data/storeData";

interface CategorySidebarProps {
  currentCategory?: string;
}

export default async function CategorySidebar({
  currentCategory,
}: CategorySidebarProps) {
  const categories = await getCategories();
  const parentCategories = categories.filter((c) => c.parent_id === null);

  return (
    <div className="rounded-2xl border border-[#D9E8E2] bg-white p-5">
      <h2 className="text-lg font-black text-[#172B36]">Categories</h2>

      <div className="mt-4 space-y-1">
        <Link
          href="/shop"
          className={`block rounded-xl px-3 py-2 text-sm font-semibold transition ${
            !currentCategory
              ? "bg-[#114C5A] text-white font-bold shadow-sm"
              : "text-[#172B36] hover:bg-[#F1F6F4]"
          }`}
        >
          All Products
        </Link>

        {parentCategories.map((cat) => {
          const isActive = currentCategory === cat.slug;
          const subcategories = categories.filter((c) => c.parent_id === cat.id);
          const isChildActive = subcategories.some((sub) => sub.slug === currentCategory);

          return (
            <div key={cat.id} className="space-y-1">
              <Link
                href={`/shop?category=${cat.slug}`}
                className={`block rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#114C5A] text-white font-bold shadow-sm"
                    : isChildActive
                    ? "bg-[#D9E8E2] text-[#114C5A] font-bold"
                    : "text-[#172B36] hover:bg-[#F1F6F4]"
                }`}
              >
                {cat.name}
              </Link>

              {(isActive || isChildActive) && subcategories.length > 0 && (
                <div className="ml-4 space-y-1 border-l-2 border-[#D9E8E2] pl-2">
                  {subcategories.map((sub) => {
                    const isSubActive = currentCategory === sub.slug;
                    return (
                      <Link
                        key={sub.id}
                        href={`/shop?category=${sub.slug}`}
                        className={`block rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                          isSubActive
                            ? "bg-[#FFC801] text-[#172B36] font-bold"
                            : "text-[#114C5A] hover:bg-[#F1F6F4]"
                        }`}
                      >
                        {sub.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
