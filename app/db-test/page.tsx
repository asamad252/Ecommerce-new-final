import { createClient } from "@/lib/supabase/server";

export default async function DbTestPage() {
  const supabase = await createClient();

  const [categoriesResult, brandsResult, productsResult] =
    await Promise.all([
      supabase
        .from("categories")
        .select("id, name, slug")
        .order("id"),

      supabase
        .from("brands")
        .select("id, name, slug")
        .order("id"),

      supabase
        .from("products")
        .select(
          "id, name, price, stock, is_active, is_featured"
        )
        .order("id"),
    ]);

  return (
    <main className="min-h-screen bg-[#F1F6F4] p-10">
      <h1 className="text-4xl font-black text-[#172B36]">
        NexGear Database Test
      </h1>

      <div className="mt-8 space-y-8">
        <section className="rounded-2xl bg-white p-6">
          <h2 className="text-2xl font-black text-[#114C5A]">
            Categories
          </h2>

          <pre className="mt-4 overflow-auto text-sm">
            {JSON.stringify(
              {
                error: categoriesResult.error,
                data: categoriesResult.data,
              },
              null,
              2
            )}
          </pre>
        </section>

        <section className="rounded-2xl bg-white p-6">
          <h2 className="text-2xl font-black text-[#114C5A]">
            Brands
          </h2>

          <pre className="mt-4 overflow-auto text-sm">
            {JSON.stringify(
              {
                error: brandsResult.error,
                data: brandsResult.data,
              },
              null,
              2
            )}
          </pre>
        </section>

        <section className="rounded-2xl bg-white p-6">
          <h2 className="text-2xl font-black text-[#114C5A]">
            Products
          </h2>

          <pre className="mt-4 overflow-auto text-sm">
            {JSON.stringify(
              {
                error: productsResult.error,
                data: productsResult.data,
              },
              null,
              2
            )}
          </pre>
        </section>
      </div>
    </main>
  );
}