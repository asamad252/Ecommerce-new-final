import Link from "next/link";
import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function AuthButtons() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="nx-action-group">
        <Link
          href="/login"
          className="nx-action-pill nx-action-secondary"
        >
          Login
        </Link>

        <Link
          href="/signup"
          className="nx-action-pill nx-action-primary"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="group relative">
      <Link
        href="/account"
        className="nx-action-pill nx-action-secondary"
      >
        <User
          size={15}
          className="mr-1.5"
        />
        Account
      </Link>

      <div className="invisible absolute right-0 top-full z-50 mt-2 w-48 rounded-2xl border border-[#D9E8E2] bg-white p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
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
  );
}