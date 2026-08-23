import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AccountNav from "@/components/account/AccountNav";
import AddressList from "@/components/account/AddressList";
import AddressForm from "@/components/account/AddressForm";

export default async function AddressesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: addresses, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch addresses:", error);
  }

  return (
    <main className="bg-[#F1F6F4] py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <AccountNav />

        <div className="mt-6 space-y-6">
          <section className="rounded-2xl border border-[#D9E8E2] bg-white p-6 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FF9932]">
              Delivery
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#172B36]">
              My Addresses
            </h1>

            <div className="mt-8">
              <AddressList addresses={addresses ?? []} />
            </div>
          </section>

          <AddressForm />
        </div>
      </div>
    </main>
  );
}