import Link from "next/link";

export default function AccountNav() {
  return (
    <nav className="rounded-2xl border border-[#D9E8E2] bg-white p-2">
      <div className="grid gap-1 sm:flex">
        <Link
          href="/account"
          className="rounded-xl px-4 py-3 text-sm font-bold text-[#114C5A] transition hover:bg-[#D9E8E2]"
        >
          Profile
        </Link>

        <Link
          href="/account/orders"
          className="rounded-xl px-4 py-3 text-sm font-bold text-[#114C5A] transition hover:bg-[#D9E8E2]"
        >
          Orders
        </Link>

        <Link
          href="/account/addresses"
          className="rounded-xl px-4 py-3 text-sm font-bold text-[#114C5A] transition hover:bg-[#D9E8E2]"
        >
          Addresses
        </Link>
      </div>
    </nav>
  );
}