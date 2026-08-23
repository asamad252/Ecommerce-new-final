"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";
import QuantitySelector from "./QuantitySelector";

interface AddToCartButtonProps {
  productId: number;
  stock: number;
}

export default function AddToCartButton({
  productId,
  stock,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleAddToCart = async () => {
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add product to cart.");
      }

      setSuccess(true);

      // Hide the success state after a moment
      setTimeout(() => {
        setSuccess(false);
      }, 2500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to add product to cart."
      );
    } finally {
      setLoading(false);
    }
  };

  if (stock <= 0) {
    return (
      <button
        disabled
        className="h-12 w-full cursor-not-allowed rounded-xl bg-[#D9E8E2] font-bold text-[#114C5A]/60"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <QuantitySelector
        quantity={quantity}
        onChange={setQuantity}
        max={stock}
      />

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={loading}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FFC801] px-6 font-black text-[#172B36] transition hover:bg-[#FF9932] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {success ? (
          <>
            <Check size={19} />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart size={19} />
            {loading ? "Adding..." : "Add to Cart"}
          </>
        )}
      </button>

      {error && (
        <div className="rounded-xl bg-[#FF9932]/15 px-4 py-3 text-sm font-semibold text-[#172B36]">
          {error}
        </div>
      )}
    </div>
  );
}