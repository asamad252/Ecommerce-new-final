import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Gamepad2, Laptop, Cpu, Keyboard, Mouse, Headphones, Monitor, Sparkles } from "lucide-react";
import { getCategories } from "@/lib/data/storeData";
import CategoryLineSidebar from "@/components/shop/CategoryLineSidebar";

export default async function CategoriesPage() {
  const categories = await getCategories();
  const parentCategories = categories.filter((c) => c.parent_id === null);

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "consoles":
        return <Gamepad2 className="h-8 w-8 text-[#FF9932]" />;
      case "gaming-pcs":
        return <Laptop className="h-8 w-8 text-[#10B981]" />;
      case "graphics-cards":
        return <Cpu className="h-8 w-8 text-[#F97316]" />;
      case "keyboards":
        return <Keyboard className="h-8 w-8 text-[#0EA5E9]" />;
      case "mice":
        return <Mouse className="h-8 w-8 text-[#F43F5E]" />;
      case "headsets":
        return <Headphones className="h-8 w-8 text-[#8B5CF6]" />;
      case "monitors":
        return <Monitor className="h-8 w-8 text-[#FFC801]" />;
      default:
        return <Sparkles className="h-8 w-8 text-[#114C5A]" />;
    }
  };

  return (
    <main className="bg-[#F1F6F4] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FF9932]">
            Browse Catalog
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-[#172B36] md:text-5xl">
            Explore All Categories
          </h1>
          <p className="mt-4 max-w-2xl text-[#114C5A]">
            Navigate seamlessly through our interactive Line Sidebar or browse by department cards below.
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Interactive Line Sidebar for Category Navigation */}
          <aside className="w-full lg:w-72 lg:shrink-0">
            <div className="sticky top-24">
              <Suspense fallback={<div className="h-72 w-full rounded-2xl bg-white border border-[#D9E8E2] animate-pulse" />}>
                <CategoryLineSidebar categories={categories} />
              </Suspense>
            </div>
          </aside>

          {/* Category Cards Grid */}
          <div className="min-w-0 flex-1">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
              {parentCategories.map((cat) => {
                const subcategories = categories.filter((c) => c.parent_id === cat.id);

                return (
                  <div
                    key={cat.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#D9E8E2] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#FFC801] hover:shadow-xl"
                  >
                    <div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F6F4] transition group-hover:bg-[#D9E8E2]">
                        {getCategoryIcon(cat.slug)}
                      </div>

                      <h2 className="mt-5 text-2xl font-black text-[#172B36]">
                        {cat.name}
                      </h2>

                      {subcategories.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {subcategories.map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/shop?category=${sub.slug}`}
                              className="rounded-lg bg-[#F1F6F4] px-3 py-1.5 text-xs font-semibold text-[#114C5A] transition hover:bg-[#FFC801] hover:text-[#172B36]"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-3 text-sm text-[#114C5A]/70">
                          Explore top-tier {cat.name.toLowerCase()} for pro gaming setups.
                        </p>
                      )}
                    </div>

                    <div className="mt-8 pt-4 border-t border-[#D9E8E2]">
                      <Link
                        href={`/shop?category=${cat.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#114C5A] transition group-hover:text-[#FF9932]"
                      >
                        View All {cat.name}
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
