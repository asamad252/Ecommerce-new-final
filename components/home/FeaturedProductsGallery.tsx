"use client";

import Link from "next/link";
import CircularGallery from "./CircularGallery";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
};

type FeaturedProductsGalleryProps = {
  products: Product[];
};

export default function FeaturedProductsGallery({
  products,
}: FeaturedProductsGalleryProps) {
  const validProducts = products.filter((product) => product.image);

  const items = validProducts.map((product) => ({
    image: product.image as string,
    text: product.name,
  }));

  return (
    <div className="relative">
      <div className="h-[500px] w-full overflow-hidden rounded-3xl border border-[#D9E8E2] bg-[#F1F6F4]">
        <CircularGallery
                  items={items}
                  bend={2.2}
                  textColor="#114C5A"
                  borderRadius={0.06}
                  scrollSpeed={2}
                  scrollEase={0.035}
                  font="bold 24px Figtree" fontUrl={undefined}        />
      </div>

      {/* Product links overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center">
        <div className="rounded-full border border-[#D9E8E2] bg-white/90 px-4 py-2 text-xs font-semibold text-[#114C5A] shadow-sm backdrop-blur">
          Drag or scroll to explore
        </div>
      </div>

      {/* Invisible navigation links for accessibility / SEO */}
      <div className="sr-only">
        {validProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
          >
            {product.name}
          </Link>
        ))}
      </div>
    </div>
  );
}