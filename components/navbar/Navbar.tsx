import Link from "next/link";
import { Search, ShoppingCart, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, getCategories } from "@/lib/data/storeData";
import NavPill from "./NavPill";
import SearchBar from "./SearchBar";
import LogoutButton from "@/components/auth/LogoutButton";
import CategorySidebarDrawer from "./CategorySidebarDrawer";
import "./PillNav.css";

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

export default async function Navbar() {
  const categories = await getCategories();
  let user = null;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      user = currentUser;
    } catch {
      user = null;
    }
  }

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
            SIDEBAR SYMBOL (Categories Line Sidebar Drawer)
            ================================================= */}
        <CategorySidebarDrawer categories={categories} />

        {/* =================================================
            MAIN NAV
            ================================================= */}
        <nav
          className="nex-nav-group"
          aria-label="Main navigation"
        >
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