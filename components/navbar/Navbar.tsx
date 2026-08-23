import Link from "next/link";
import { Search, ShoppingCart, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import NavPill from "./NavPill";
import SearchBar from "./SearchBar";
import LogoutButton from "@/components/auth/LogoutButton";
import "./PillNav.css";
import "./CategoryDropdown.css";

const navItems = [
  {
    label: "Shop",
    href: "/shop",
  },
  {
    label: "Deals",
    href: "/deals",
  },
  {
    label: "New Arrivals",
    href: "/new-arrivals",
  },
];

const categoryItems = [
  {
    label: "Consoles",
    href: "/shop?category=consoles",
    blurb: "PlayStation, Xbox & more",
    colorFrom: "#6366F1",
    colorTo: "#A855F7",
  },
  {
    label: "Gaming PCs",
    href: "/shop?category=gaming-pcs",
    blurb: "Prebuilt & custom rigs",
    colorFrom: "#10B981",
    colorTo: "#0D9488",
  },
  {
    label: "Graphics Cards",
    href: "/shop?category=graphics-cards",
    blurb: "GPUs for every budget",
    colorFrom: "#F97316",
    colorTo: "#EC4899",
    badge: "Hot",
  },
  {
    label: "Keyboards",
    href: "/shop?category=keyboards",
    blurb: "Mechanical & wireless",
    colorFrom: "#0EA5E9",
    colorTo: "#2563EB",
  },
  {
    label: "Mouse",
    href: "/shop?category=mice",
    blurb: "Precision & comfort",
    colorFrom: "#F43F5E",
    colorTo: "#DC2626",
  },
  {
    label: "Headsets",
    href: "/shop?category=headsets",
    blurb: "Immersive sound",
    colorFrom: "#8B5CF6",
    colorTo: "#D946EF",
  },
];

export default async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="nex-navbar">
      <div className="nex-navbar-shell">
        
        {/* =================================================
            LOGO
            ================================================= */}
        <Link
          href="/"
          className="nex-navbar-logo"
          aria-label="NexGear home"
        >
          <span>N</span>
        </Link>

        {/* =================================================
            MAIN NAV
            ================================================= */}
        <nav
          className="nex-nav-group"
          aria-label="Main navigation"
        >
          {/* Categories mega-menu */}
          <div className="group relative">
            <NavPill
              href="/categories"
              icon={<span className="cat-caret" aria-hidden="true" />}
            >
              Categories
            </NavPill>

            {/* invisible bridge — keeps hover active while moving the cursor
                from the pill down to the menu, so it doesn't close mid-click */}
            <div className="absolute left-0 top-full h-3 w-[440px]" />

            <div className="cat-menu absolute left-0 top-full z-[200] mt-3 w-[440px] origin-top-left overflow-hidden rounded-3xl border border-[#D9E8E2] bg-white/90 shadow-[0_20px_60px_-15px_rgba(17,76,90,0.35)] backdrop-blur-2xl">
              {/* decorative floating blobs */}
              <div
                className="cat-blob pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full opacity-30 blur-3xl"
                style={{ background: "radial-gradient(circle, #A855F7, transparent 70%)" }}
              />
              <div
                className="cat-blob-2 pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full opacity-25 blur-3xl"
                style={{ background: "radial-gradient(circle, #10B981, transparent 70%)" }}
              />

              {/* pointer arrow */}
              <div className="absolute -top-1.5 left-8 h-3 w-3 rotate-45 border-l border-t border-[#D9E8E2] bg-white" />

              <div className="relative p-3">
                <div className="mb-1 flex items-center justify-between px-2 pb-2 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#7C9B94]">
                    Shop by Category
                  </span>
                  <span className="ml-3 h-px flex-1 bg-gradient-to-r from-[#D9E8E2] to-transparent" />
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {categoryItems.map((item, idx) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="cat-menu-item group/item relative flex items-center gap-3 overflow-hidden rounded-2xl py-2.5 pl-4 pr-2 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#F3F9F7]"
                      style={{ animationDelay: `${70 + idx * 45}ms` }}
                    >
                      {/* accent bar */}
                      <span
                        className="cat-accent-bar absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full"
                        style={{
                          backgroundImage: `linear-gradient(180deg, ${item.colorFrom}, ${item.colorTo})`,
                        }}
                      />

                      <span className="flex min-w-0 flex-col">
                        <span className="flex items-center gap-1.5">
                          <span
                            className="truncate text-sm font-bold transition-colors duration-200"
                            style={{ color: "#114C5A" }}
                          >
                            {item.label}
                          </span>
                          {item.badge && (
                            <span
                              className="cat-badge inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white"
                              style={{
                                backgroundImage:
                                  "linear-gradient(90deg, #F97316, #EC4899, #F97316)",
                              }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </span>
                        <span className="truncate text-xs font-medium text-[#8AA6A0]">
                          {item.blurb}
                        </span>
                      </span>

                      <span
                        className="cat-arrow ml-auto shrink-0 text-[#114C5A] opacity-0 transition-all duration-200 group-hover/item:opacity-60"
                        aria-hidden="true"
                      />
                    </Link>
                  ))}
                </div>

                <div className="mt-2 border-t border-[#D9E8E2] pt-2">
                  <Link
                    href="/categories"
                    className="group/all flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-[#114C5A] transition-colors duration-150 hover:bg-[#D9E8E2]"
                  >
                    View all categories
                    <span
                      className="cat-arrow-all transition-transform duration-200 group-hover/all:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {navItems.map((item) => (
            <NavPill
              key={item.href}
              href={item.href}
            >
              {item.label}
            </NavPill>
          ))}
        </nav>

        {/* =================================================
            SEARCH
            ================================================= */}
        <div className="nex-navbar-search">
          <Search
            size={17}
            strokeWidth={2}
          />

          <div className="ml-2 min-w-0 flex-1">
            <SearchBar />
          </div>
        </div>

        {/* =================================================
            ACTIONS
            ================================================= */}
        <div className="nex-navbar-actions">
          {!user ? (
            <>
              <NavPill href="/login">
                Login
              </NavPill>

              <NavPill
                href="/signup"
                primary
              >
                Sign Up
              </NavPill>
            </>
          ) : (
            <div className="group relative">
              <NavPill
                href="/account"
                icon={
                  <User size={15} />
                }
              >
                Account
              </NavPill>

              <div className="invisible absolute right-0 top-full z-[200] mt-2 w-48 rounded-2xl border border-[#D9E8E2] bg-white p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                <Link
                  href="/account"
                  className="block rounded-xl px-3 py-2.5 text-sm font-bold text-[#114C5A] hover:bg-[#D9E8E2]"
                >
                  Profile
                </Link>

                <Link
                  href="/account/orders"
                  className="block rounded-xl px-3 py-2.5 text-sm font-bold text-[#114C5A] hover:bg-[#D9E8E2]"
                >
                  Orders
                </Link>

                <Link
                  href="/account/addresses"
                  className="block rounded-xl px-3 py-2.5 text-sm font-bold text-[#114C5A] hover:bg-[#D9E8E2]"
                >
                  Addresses
                </Link>

                <div className="my-2 border-t border-[#D9E8E2]" />

                <LogoutButton />
              </div>
            </div>
          )}

          {/* Cart */}
          <Link
            href="/cart"
            className="nav-pill nex-cart-pill"
            aria-label="Shopping cart"
          >
            <span className="nav-pill-content">
              <ShoppingCart size={16} />

              <span className="hidden xl:inline">
                Cart
              </span>

              <span className="nex-cart-count">
                0
              </span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}