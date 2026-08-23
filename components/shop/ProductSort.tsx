import Link from "next/link";

interface ProductSortProps {
  currentSort?: string;
  search?: string;
  category?: string;
}

const sortOptions = [
  {
    label: "Newest",
    value: "newest",
  },
  {
    label: "Price: Low to High",
    value: "price-asc",
  },
  {
    label: "Price: High to Low",
    value: "price-desc",
  },
  {
    label: "Name: A to Z",
    value: "name-asc",
  },
];

export default function ProductSort({
  currentSort = "newest",
  search,
  category,
}: ProductSortProps) {
  const buildUrl = (sort: string) => {
    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    if (category) {
      params.set("category", category);
    }

    params.set("sort", sort);

    return `/shop?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm font-semibold text-[#114C5A]">
        Sort products
      </p>

      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option) => {
          const active = currentSort === option.value;

          return (
            <Link
              key={option.value}
              href={buildUrl(option.value)}
              className={`
                rounded-lg
                px-3
                py-2
                text-sm
                font-semibold
                transition
                ${
                  active
                    ? "bg-[#114C5A] text-[#F1F6F4]"
                    : "bg-white text-[#114C5A] hover:bg-[#D9E8E2]"
                }
              `}
            >
              {option.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}