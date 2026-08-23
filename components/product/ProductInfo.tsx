import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

interface ProductInfoProps {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  categoryName?: string | null;
  brandName?: string | null;
}

export default function ProductInfo({
  id,
  name,
  description,
  price,
  compareAtPrice,
  stock,
  categoryName,
  brandName,
}: ProductInfoProps) {
  const hasDiscount =
    compareAtPrice !== null && compareAtPrice > price;

  const discount = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  return (
    <div className="flex flex-col">
      {categoryName && (
        <Link
          href={`/shop?category=${encodeURIComponent(categoryName)}`}
          className="text-sm font-bold uppercase tracking-[0.15em] text-[#FF9932]"
        >
          {categoryName}
        </Link>
      )}

      <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight text-[#172B36]">
        {name}
      </h1>

      {brandName && (
        <p className="mt-3 text-sm font-semibold text-[#114C5A]">
          Brand: {brandName}
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <span className="text-3xl font-black text-[#114C5A]">
          Rs. {price.toLocaleString("en-PK")}
        </span>

        {hasDiscount && (
          <>
            <span className="text-lg text-[#114C5A]/45 line-through">
              Rs. {compareAtPrice.toLocaleString("en-PK")}
            </span>

            <span className="rounded-full bg-[#FF9932] px-3 py-1 text-sm font-black text-[#172B36]">
              -{discount}%
            </span>
          </>
        )}
      </div>

      <div className="mt-5">
        {stock > 0 ? (
          <span className="text-sm font-bold text-[#114C5A]">
            {stock} in stock
          </span>
        ) : (
          <span className="text-sm font-bold text-[#FF9932]">
            Out of stock
          </span>
        )}
      </div>

      {description && (
        <div className="mt-7 border-t border-[#D9E8E2] pt-7">
          <p className="whitespace-pre-line leading-7 text-[#114C5A]">
            {description}
          </p>
        </div>
      )}

      <div className="mt-8 max-w-md">
        <AddToCartButton
          productId={id}
          stock={stock}
        />
      </div>
    </div>
  );
}