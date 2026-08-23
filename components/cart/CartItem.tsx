"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface CartItemProps {
  cartItemId: number;
  productId: number;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  stock: number;
  imageUrl?: string | null;
}

export default function CartItem({
  cartItemId,
  name,
  slug,
  price,
  quantity,
  stock,
  imageUrl,
}: CartItemProps) {
  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > stock) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItemId,
          quantity: newQuantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update cart.");
      }

      setCurrentQuantity(newQuantity);
      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update cart."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async () => {
    setRemoving(true);
    setError("");

    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItemId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to remove item.");
      }

      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to remove item."
      );

      setRemoving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#D9E8E2] bg-white p-4 sm:p-5">
      <div className="flex gap-4">
        <Link
          href={`/product/${slug}`}
          className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#D9E8E2] sm:h-32 sm:w-32"
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="128px"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-xs font-black text-[#114C5A]">
                NEXGEAR
              </span>
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <Link
              href={`/product/${slug}`}
              className="font-bold text-[#172B36] transition hover:text-[#114C5A]"
            >
              {name}
            </Link>

            <button
              type="button"
              onClick={removeItem}
              disabled={removing}
              className="shrink-0 rounded-lg p-2 text-[#114C5A] transition hover:bg-[#FF9932]/15 hover:text-[#FF9932] disabled:opacity-50"
              aria-label={`Remove ${name}`}
            >
              <Trash2 size={18} />
            </button>
          </div>

          <p className="mt-2 text-lg font-black text-[#114C5A]">
            Rs. {price.toLocaleString("en-PK")}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center overflow-hidden rounded-lg border border-[#D9E8E2]">
              <button
                type="button"
                disabled={loading || currentQuantity <= 1}
                onClick={() => updateQuantity(currentQuantity - 1)}
                className="h-9 w-9 font-bold text-[#114C5A] transition hover:bg-[#D9E8E2] disabled:opacity-40"
              >
                −
              </button>

              <span className="flex h-9 w-10 items-center justify-center border-x border-[#D9E8E2] text-sm font-bold text-[#172B36]">
                {currentQuantity}
              </span>

              <button
                type="button"
                disabled={loading || currentQuantity >= stock}
                onClick={() => updateQuantity(currentQuantity + 1)}
                className="h-9 w-9 font-bold text-[#114C5A] transition hover:bg-[#D9E8E2] disabled:opacity-40"
              >
                +
              </button>
            </div>

            <p className="font-black text-[#172B36]">
              Rs.{" "}
              {(price * currentQuantity).toLocaleString("en-PK")}
            </p>
          </div>

          {error && (
            <p className="mt-3 text-sm font-semibold text-[#FF9932]">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}