"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LineSidebar } from "@/components/ui/LineSidebar";
import Link from "next/link";
import { Layers } from "lucide-react";

interface Category {
  id: number | string;
  name: string;
  slug: string;
  parent_id: number | string | null;
}

interface CategoryLineSidebarProps {
  categories: Category[];
  currentCategory?: string;
}

export default function CategoryLineSidebar({
  categories,
  currentCategory,
}: CategoryLineSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get active slug from searchParams if not passed
  const activeSlug = currentCategory ?? (searchParams ? searchParams.get("category") : null);

  const parentCategories = useMemo(() => {
    return categories.filter((c) => c.parent_id === null);
  }, [categories]);

  // Sidebar items list: All Products + parent categories
  const sidebarItems = useMemo(() => {
    const list = [
      {
        label: "All Products",
        slug: "",
      },
      ...parentCategories.map((c) => ({
        label: c.name,
        slug: c.slug,
      })),
    ];
    return list;
  }, [parentCategories]);

  // Determine current active index based on activeSlug
  const activeIndex = useMemo(() => {
    if (!activeSlug) return 0;
    const foundIndex = sidebarItems.findIndex((item) => item.slug === activeSlug);
    if (foundIndex !== -1) return foundIndex;

    // Check if activeSlug is a subcategory of one of the parents
    const childCat = categories.find((c) => c.slug === activeSlug);
    if (childCat && childCat.parent_id) {
      const parent = categories.find((c) => c.id === childCat.parent_id);
      if (parent) {
        const parentIndex = sidebarItems.findIndex((item) => item.slug === parent.slug);
        if (parentIndex !== -1) return parentIndex;
      }
    }
    return 0;
  }, [activeSlug, sidebarItems, categories]);

  // Find children for the currently selected parent category
  const selectedParent = parentCategories.find(
    (c) => c.slug === activeSlug || (activeIndex > 0 && c.slug === sidebarItems[activeIndex]?.slug)
  );

  const activeSubcategories = useMemo(() => {
    if (!selectedParent) return [];
    return categories.filter((c) => c.parent_id === selectedParent.id);
  }, [selectedParent, categories]);

  const handleCategoryClick = (index: number, item: { label?: string; slug?: string } | string) => {
    const targetSlug = typeof item === "object" && item !== null ? item.slug : sidebarItems[index]?.slug;

    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    if (targetSlug) {
      params.set("category", targetSlug);
    } else {
      params.delete("category");
    }

    const queryString = params.toString();
    const targetUrl = queryString ? `/shop?${queryString}` : "/shop";
    router.push(targetUrl);
  };

  return (
    <div className="w-full rounded-2xl border border-[#D9E8E2] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-[#D9E8E2]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D9E8E2] text-[#114C5A]">
            <Layers size={16} />
          </div>
          <h2 className="text-lg font-black tracking-tight text-[#172B36]">
            Categories
          </h2>
        </div>
        <span className="text-xs font-bold text-[#114C5A]/70 uppercase tracking-wider">
          {parentCategories.length} Departments
        </span>
      </div>

      {/* Line Sidebar from React Bits */}
      <div className="py-2 overflow-hidden">
        <LineSidebar
          items={sidebarItems.map((item) => item.label)}
          accentColor="#FF9932"
          textColor="#172B36"
          markerColor="#B8D3C8"
          showIndex={true}
          showMarker={true}
          proximityRadius={90}
          maxShift={20}
          falloff="smooth"
          markerLength={38}
          markerGap={6}
          tickScale={0.5}
          scaleTick={true}
          itemGap={15}
          fontSize={0.92}
          smoothing={100}
          defaultActive={activeIndex}
          onItemClick={(index: number) => handleCategoryClick(index, sidebarItems[index])}
          className="w-full"
        />
      </div>

      {/* Subcategory pills if active parent category has children */}
      {activeSubcategories.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#D9E8E2]/80">
          <p className="text-xs font-bold uppercase tracking-wider text-[#114C5A]/80 mb-2.5">
            Subcategories in {selectedParent?.name}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {activeSubcategories.map((sub) => {
              const isSubActive = activeSlug === sub.slug;
              return (
                <Link
                  key={sub.id}
                  href={`/shop?category=${sub.slug}`}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    isSubActive
                      ? "bg-[#FFC801] text-[#172B36] font-bold shadow-sm"
                      : "bg-[#F1F6F4] text-[#114C5A] hover:bg-[#D9E8E2] hover:text-[#172B36]"
                  }`}
                >
                  {sub.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
