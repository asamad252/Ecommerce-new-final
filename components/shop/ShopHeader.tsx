import { createClient } from "@/lib/supabase/server";

interface ShopHeaderProps {
  search?: string;
  category?: string;
}

export default async function ShopHeader({
  search,
  category,
}: ShopHeaderProps) {
  const supabase = await createClient();

  let title = "Shop All Gear";

  if (category) {
    const { data } = await supabase
      .from("categories")
      .select("name")
      .eq("slug", category)
      .maybeSingle();

    if (data) {
      title = data.name;
    }
  }

  if (search) {
    title = `Search results for "${search}"`;
  }

  return (
    <section className="border-b border-[#D9E8E2] bg-[#F1F6F4]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FF9932]">
          NexGear Store
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-tight text-[#172B36]">
          {title}
        </h1>

        <p className="mt-3 max-w-2xl text-[#114C5A]">
          Browse gaming PCs, consoles, peripherals, monitors, accessories,
          and digital gaming products.
        </p>
      </div>
    </section>
  );
}