"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  AlignLeft,
  X,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Flame,
  ChevronRight
} from "lucide-react";
import { LineSidebar } from "@/components/ui/LineSidebar";
import Link from "next/link";

export interface CategoryItem {
  id: number | string;
  name: string;
  slug: string;
  parent_id: number | string | null;
}

interface CategorySidebarDrawerProps {
  categories: CategoryItem[];
}

export default function CategorySidebarDrawer({
  categories = [],
}: CategorySidebarDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedParentIndex, setSelectedParentIndex] = useState(0);
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);

  const parentCategories = useMemo(() => {
    return categories.filter((c) => c.parent_id === null);
  }, [categories]);

  const sidebarItems = useMemo(() => {
    return [
      { label: "All Hardware & Gear", slug: "", id: null as number | string | null },
      ...parentCategories.map((c) => ({
        label: c.name,
        slug: c.slug,
        id: c.id as number | string | null,
      })),
    ];
  }, [parentCategories]);

  // Current selected parent category
  const activeParent = useMemo(() => {
    if (selectedParentIndex === 0) return null;
    const catItem = sidebarItems[selectedParentIndex];
    if (!catItem || !catItem.id) return null;
    return categories.find((c) => c.id === catItem.id) || null;
  }, [selectedParentIndex, sidebarItems, categories]);

  // Subcategories for active parent
  const activeSubcategories = useMemo(() => {
    if (!activeParent) return [];
    return categories.filter((c) => c.parent_id === activeParent.id);
  }, [activeParent, categories]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Prevent background body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSelectCategory = (index: number) => {
    setSelectedParentIndex(index);
    const item = sidebarItems[index];
    if (item) {
      const targetUrl = item.slug ? `/shop?category=${item.slug}` : "/shop";
      setIsOpen(false);
      router.push(targetUrl);
    }
  };

  const handleSubcategoryClick = (slug: string) => {
    setIsOpen(false);
    router.push(`/shop?category=${slug}`);
  };

  return (
    <>
      {/* =========================================================
          DEDICATED SIDEBAR BUTTON (With line icon for LineSidebar)
          ========================================================= */}
      <button
        type="button"
        id="navbar-categories-sidebar-toggle"
        onClick={() => setIsOpen(true)}
        className="group relative flex h-[46px] items-center gap-2 rounded-full border border-[#114C5A] bg-[#172B36] px-3.5 text-[#D9E8E2] shadow-sm transition-all duration-200 hover:border-[#FFC801] hover:bg-[#12222B] hover:text-[#FFC801] hover:shadow-[0_0_15px_rgba(255,200,1,0.2)] focus:outline-none focus:ring-2 focus:ring-[#FFC801]/50 active:scale-95 cursor-pointer"
        aria-label="Open Categories Line Sidebar"
        title="Open Categories (Line Sidebar)"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#114C5A]/70 text-[#FFC801] transition-transform duration-200 group-hover:scale-110 group-hover:bg-[#FFC801] group-hover:text-[#172B36]">
          <AlignLeft size={14} className="stroke-[2.5]" />
        </div>
        <span className="text-xs font-black uppercase tracking-wider text-[#F1F6F4] group-hover:text-[#FFC801]">
          Sidebar
        </span>
        <span className="flex h-1.5 w-1.5 rounded-full bg-[#FFC801] animate-pulse" />
      </button>

      {/* =========================================================
          SIDEBAR DRAWER OVERLAY & PANEL
          ========================================================= */}
      {isOpen && (
        <div
          id="category-sidebar-modal"
          className="fixed inset-0 z-[999] flex items-stretch"
          role="dialog"
          aria-modal="true"
          aria-label="Departments and Categories Line Sidebar"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Sliding Panel */}
          <div
            ref={drawerRef}
            className="relative z-10 flex h-full w-full max-w-[420px] sm:max-w-[480px] flex-col border-r border-[#D9E8E2]/15 bg-[#12222B] text-[#F1F6F4] shadow-[0_25px_60px_rgba(0,0,0,0.8)] transition-transform duration-300 animate-in slide-in-from-left"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[#D9E8E2]/10 px-6 py-5 bg-[#172B36]/80">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFC801] to-[#FF9932] text-[#172B36] shadow-md shadow-[#FFC801]/20">
                  <AlignLeft size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-base font-black tracking-tight text-[#F1F6F4]">
                      Shop Categories
                    </h2>
                    <span className="rounded bg-[#FFC801]/15 px-1.5 py-0.5 text-[10px] font-black uppercase text-[#FFC801]">
                      Line Sidebar
                    </span>
                  </div>
                  <p className="text-xs text-[#D9E8E2]/70">
                    Hover across departments for proximity lines
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                id="close-sidebar-drawer"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D9E8E2]/20 bg-[#12222B] text-[#D9E8E2] transition-colors hover:border-[#EF4444] hover:bg-[#EF4444] hover:text-white"
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-2 gap-2 px-6 py-3 bg-[#11222B] border-b border-[#D9E8E2]/10">
              <Link
                href="/shop"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#D9E8E2]/15 bg-[#172B36] py-2 px-3 text-xs font-bold text-[#F1F6F4] transition hover:border-[#FFC801] hover:bg-[#FFC801]/10 hover:text-[#FFC801]"
              >
                <ShoppingBag size={14} />
                All Products
              </Link>
              <Link
                href="/deals"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#FF9932]/30 bg-[#FF9932]/10 py-2 px-3 text-xs font-bold text-[#FF9932] transition hover:bg-[#FF9932] hover:text-[#172B36]"
              >
                <Flame size={14} />
                Hot Deals
              </Link>
            </div>

            {/* Line Sidebar Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-[#114C5A]">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#FFC801]">
                  Explore Departments
                </span>
                <span className="text-[11px] font-medium text-[#D9E8E2]/60">
                  {sidebarItems.length} Categories
                </span>
              </div>

              {/* The LineSidebar Component with Custom Dark Proximity Theme */}
              <div className="rounded-2xl border border-[#D9E8E2]/10 bg-[#172B36]/60 p-4 shadow-inner">
                <LineSidebar
                  items={sidebarItems.map((item) => item.label)}
                  accentColor="#FFC801"
                  textColor="#D9E8E2"
                  markerColor="rgba(217, 232, 226, 0.28)"
                  showIndex={true}
                  showMarker={true}
                  proximityRadius={100}
                  maxShift={26}
                  falloff="smooth"
                  markerLength={48}
                  markerGap={8}
                  tickScale={0.5}
                  scaleTick={true}
                  itemGap={18}
                  fontSize={1.02}
                  smoothing={90}
                  defaultActive={selectedParentIndex}
                  onItemClick={(index: number) => handleSelectCategory(index)}
                  className="w-full"
                />
              </div>

              {/* Active Subcategories Detail Panel */}
              {activeSubcategories.length > 0 && activeParent && (
                <div className="mt-6 rounded-2xl border border-[#FFC801]/20 bg-gradient-to-b from-[#172B36] to-[#12222B] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-[#FFC801]" />
                      <span className="text-xs font-bold text-[#F1F6F4]">
                        {activeParent.name} Subcategories
                      </span>
                    </div>
                    <button
                      onClick={() => handleSelectCategory(selectedParentIndex)}
                      className="text-[11px] font-bold text-[#FFC801] hover:underline"
                    >
                      View all &rarr;
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {activeSubcategories.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => handleSubcategoryClick(sub.slug)}
                        className="flex items-center justify-between rounded-xl border border-[#D9E8E2]/10 bg-[#11222B] p-2.5 text-left text-xs font-semibold text-[#D9E8E2] transition hover:border-[#FFC801] hover:bg-[#FFC801]/10 hover:text-[#FFC801]"
                      >
                        <span className="truncate">{sub.name}</span>
                        <ChevronRight size={13} className="shrink-0 opacity-60" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-[#D9E8E2]/10 bg-[#172B36] p-5">
              <Link
                href="/categories"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFC801] to-[#FF9932] py-3 text-sm font-black text-[#172B36] shadow-lg shadow-[#FFC801]/20 transition hover:brightness-110 active:scale-[0.99]"
              >
                Browse Full Visual Categories
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
