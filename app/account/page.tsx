import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/data/storeData";
import AccountNav from "@/components/account/AccountNav";
import ProfileSection from "@/components/account/ProfileSection";

export default async function AccountPage() {
  if (!isSupabaseConfigured()) {
    redirect("/login");
  }

  let user = null;
  let supabase = null;
  try {
    supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch {
    user = null;
  }

  if (!user || !supabase) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="bg-[#F1F6F4] py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <AccountNav />

        <div className="mt-6">
          <ProfileSection
            userId={user.id}
            email={user.email ?? ""}
            initialFullName={profile?.full_name ?? ""}
            initialPhone={profile?.phone ?? ""}
          />
        </div>
      </div>
    </main>
  );
}