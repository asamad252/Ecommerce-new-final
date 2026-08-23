import Image from "next/image";

interface ProductImage {
  id: number;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
}

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const sortedImages = [...images].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  const primaryImage =
    sortedImages.find((image) => image.is_primary) ??
    sortedImages[0];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-[#D9E8E2] bg-[#D9E8E2]">
        {primaryImage ? (
          <Image
            src={primaryImage.image_url}
            alt={primaryImage.alt_text ?? productName}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-4xl font-black text-[#114C5A]">
              NEXGEAR
            </span>
          </div>
        )}
      </div>

      {sortedImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {sortedImages.slice(0, 4).map((image) => (
            <div
              key={image.id}
              className="relative aspect-square overflow-hidden rounded-xl border border-[#D9E8E2] bg-[#D9E8E2]"
            >
              <Image
                src={image.image_url}
                alt={image.alt_text ?? productName}
                fill
                className="object-cover"
                sizes="120px"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}