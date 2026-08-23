import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getFeaturedProducts } from "@/lib/data/storeData";
import { ChromaGrid } from "@/components/effects/ChromaGrid";
import MaskedHeading from "@/components/ui/MaskedHeading";

const getBrandStyling = (brandName?: string | null, categoryName?: string | null) => {
  const brand = (brandName || "").toLowerCase();
  const category = (categoryName || "").toLowerCase();

  if (brand.includes("sony") || brand.includes("playstation")) {
    return {
      borderColor: "#0EA5E9",
      gradient: "linear-gradient(155deg, rgba(14, 165, 233, 0.25) 0%, #172B36 100%)",
    };
  }
  if (brand.includes("microsoft") || brand.includes("xbox")) {
    return {
      borderColor: "#10B981",
      gradient: "linear-gradient(155deg, rgba(16, 185, 129, 0.25) 0%, #172B36 100%)",
    };
  }
  if (brand.includes("nintendo")) {
    return {
      borderColor: "#EF4444",
      gradient: "linear-gradient(155deg, rgba(239, 68, 68, 0.25) 0%, #172B36 100%)",
    };
  }
  if (brand.includes("nvidia")) {
    return {
      borderColor: "#22C55E",
      gradient: "linear-gradient(155deg, rgba(34, 197, 94, 0.25) 0%, #172B36 100%)",
    };
  }
  if (brand.includes("asus") || brand.includes("rog")) {
    return {
      borderColor: "#FF9932",
      gradient: "linear-gradient(155deg, rgba(255, 153, 50, 0.25) 0%, #172B36 100%)",
    };
  }
  if (brand.includes("razer")) {
    return {
      borderColor: "#22C55E",
      gradient: "linear-gradient(155deg, rgba(34, 197, 94, 0.25) 0%, #172B36 100%)",
    };
  }
  if (brand.includes("logitech")) {
    return {
      borderColor: "#38BDF8",
      gradient: "linear-gradient(155deg, rgba(56, 189, 248, 0.25) 0%, #172B36 100%)",
    };
  }
  if (brand.includes("steelseries")) {
    return {
      borderColor: "#F97316",
      gradient: "linear-gradient(155deg, rgba(249, 115, 22, 0.25) 0%, #172B36 100%)",
    };
  }
  if (category.includes("gaming pcs") || category.includes("prebuilt")) {
    return {
      borderColor: "#8B5CF6",
      gradient: "linear-gradient(155deg, rgba(139, 92, 246, 0.25) 0%, #172B36 100%)",
    };
  }
  return {
    borderColor: "#FFC801",
    gradient: "linear-gradient(155deg, rgba(255, 200, 1, 0.22) 0%, #172B36 100%)",
  };
};

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  const chromaItems =
    products?.slice(0, 6).map((product) => {
      const images = Array.isArray(product.product_images)
        ? product.product_images
        : [];

      const primaryImage =
        images.find((image) => image.is_primary) ??
        [...images].sort((a, b) => a.sort_order - b.sort_order)[0];

      const brandName = Array.isArray(product.brands)
        ? product.brands[0]?.name
        : product.brands?.name ?? null;

      const categoryName = Array.isArray(product.categories)
        ? product.categories[0]?.name
        : product.categories?.name ?? null;

      const styling = getBrandStyling(brandName, categoryName);

      return {
        image:
          primaryImage?.image_url ||
          "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80",
        title: product.name,
        subtitle: `Rs. ${Number(product.price).toLocaleString("en-PK")}`,
        handle: brandName ? `@${brandName}` : `@NexGear`,
        location: product.stock > 0 ? "In Stock" : "Pre-order",
        borderColor: styling.borderColor,
        gradient: styling.gradient,
        url: `/product/${product.slug}`,
      };
    }) ?? [];

  return (
    <section className="relative overflow-hidden bg-transparent py-20 text-[#F1F6F4]">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-[#114C5A]/30 blur-[100px]" />
        <div className="absolute -right-20 bottom-1/4 h-96 w-96 rounded-full bg-[#FFC801]/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFC801]/30 bg-[#FFC801]/10 px-3.5 py-1.5 backdrop-blur-sm">
              <Sparkles size={15} className="text-[#FFC801]" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFC801]">
                Featured Hardware
              </span>
            </div>

            <div className="mt-3 max-w-2xl">
              <MaskedHeading
                text="Trending Gaming Gear"
                tag="h2"
                align="left"
                weight={900}
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80"
                fillScale={1.3}
                parallax={26}
                drift={14}
                reveal="rise"
                trigger="view"
                textScale={0.08}
                className="font-black drop-shadow-md text-[#F1F6F4]"
              />
            </div>

            <p className="mt-3 max-w-2xl text-base text-[#D9E8E2]/80">
              Move your cursor across the grid to inspect flagship consoles, next-gen GPUs, and pro tournament peripherals.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 self-start rounded-xl border border-[#D9E8E2]/25 bg-[#172B36] px-6 py-3.5 text-sm font-bold text-[#F1F6F4] transition-all duration-300 hover:border-[#FFC801] hover:bg-[#FFC801] hover:text-[#172B36] hover:shadow-[0_8px_24px_rgba(255,200,1,0.2)] sm:self-end"
          >
            View Full Catalog
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* ChromaGrid Component */}
        {!chromaItems.length ? (
          <div className="rounded-3xl border border-[#D9E8E2]/20 bg-[#172B36] p-12 text-center">
            <p className="font-semibold text-[#D9E8E2]">
              Featured products will appear here once loaded.
            </p>
          </div>
        ) : (
          <div className="relative w-full">
            <ChromaGrid
              items={chromaItems}
              radius={320}
              damping={0.45}
              fadeOut={0.6}
              columns={3}
              rows={2}
              ease="power3.out"
            />
          </div>
        )}
      </div>
    </section>
  );
}
