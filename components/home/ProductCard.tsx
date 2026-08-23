import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  imageUrl?: string | null;
}

export default function ProductCard({
  name,
  slug,
  price,
  compareAtPrice,
  imageUrl,
}: ProductCardProps) {
  const hasDiscount =
    compareAtPrice !== null &&
    compareAtPrice !== undefined &&
    compareAtPrice > price;

  return (
    <Link
      href={`/product/${slug}`}
      className="group overflow-hidden rounded-2xl border border-[#D9E8E2] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#FFC801] hover:shadow-xl"
    >
      <div className="relative aspect-square overflow-hidden bg-[#D9E8E2]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-3xl font-black tracking-tight text-[#114C5A]">
              NEXGEAR
            </span>
          </div>
        )}

        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-[#FF9932] px-3 py-1 text-xs font-black text-[#172B36]">
            SALE
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="line-clamp-2 min-h-[48px] font-bold leading-6 text-[#172B36] transition group-hover:text-[#114C5A]">
          {name}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xl font-black text-[#114C5A]">
            Rs. {price.toLocaleString("en-PK")}
          </span>

          {hasDiscount && (
            <span className="text-sm text-[#114C5A]/50 line-through">
              Rs. {compareAtPrice.toLocaleString("en-PK")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}