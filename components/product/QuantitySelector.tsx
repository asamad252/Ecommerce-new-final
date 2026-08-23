"use client";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  max: number;
}

export default function QuantitySelector({
  quantity,
  onChange,
  max,
}: QuantitySelectorProps) {
  const decrease = () => {
    if (quantity > 1) {
      onChange(quantity - 1);
    }
  };

  const increase = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="inline-flex items-center overflow-hidden rounded-xl border border-[#D9E8E2]">
      <button
        type="button"
        onClick={decrease}
        disabled={quantity <= 1}
        className="h-11 w-11 text-lg font-bold text-[#114C5A] transition hover:bg-[#D9E8E2] disabled:cursor-not-allowed disabled:opacity-40"
      >
        −
      </button>

      <span className="flex h-11 w-12 items-center justify-center border-x border-[#D9E8E2] font-bold text-[#172B36]">
        {quantity}
      </span>

      <button
        type="button"
        onClick={increase}
        disabled={quantity >= max}
        className="h-11 w-11 text-lg font-bold text-[#114C5A] transition hover:bg-[#D9E8E2] disabled:cursor-not-allowed disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}