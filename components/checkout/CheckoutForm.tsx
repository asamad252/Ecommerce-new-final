"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Address {
  id: number;
  label: string | null;
  recipient_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  province: string | null;
  postal_code: string | null;
  country: string;
  is_default: boolean;
}

interface CheckoutFormProps {
  addresses: Address[];
}

export default function CheckoutForm({
  addresses,
}: CheckoutFormProps) {
  const router = useRouter();

  const defaultAddress =
    addresses.find((address) => address.is_default) ??
    addresses[0];

  const [selectedAddressId, setSelectedAddressId] = useState<
    number | null
  >(defaultAddress?.id ?? null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePlaceOrder = async () => {
    setError("");

    if (!selectedAddressId) {
      setError("Please select a shipping address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressId: selectedAddressId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to place order."
        );
      }

      router.push(`/order/success/${data.order.id}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to place order."
      );

      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#D9E8E2] bg-white p-6 sm:p-8">
      <h2 className="text-2xl font-black text-[#172B36]">
        Shipping address
      </h2>

      {addresses.length === 0 ? (
        <div className="mt-6 rounded-xl bg-[#D9E8E2] p-5">
          <p className="font-bold text-[#172B36]">
            No saved addresses
          </p>

          <p className="mt-1 text-sm text-[#114C5A]">
            Add an address from your account before placing an order.
          </p>

          <button
            type="button"
            onClick={() => router.push("/account/addresses")}
            className="mt-4 rounded-lg bg-[#114C5A] px-4 py-2.5 text-sm font-bold text-[#F1F6F4] hover:bg-[#172B36]"
          >
            Manage Addresses
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {addresses.map((address) => {
            const selected =
              selectedAddressId === address.id;

            return (
              <button
                key={address.id}
                type="button"
                onClick={() =>
                  setSelectedAddressId(address.id)
                }
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selected
                    ? "border-[#FFC801] bg-[#FFC801]/10"
                    : "border-[#D9E8E2] hover:border-[#114C5A]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border ${
                      selected
                        ? "border-[#FFC801] bg-[#FFC801]"
                        : "border-[#114C5A]/30"
                    }`}
                  >
                    {selected && (
                      <span className="h-2 w-2 rounded-full bg-[#172B36]" />
                    )}
                  </div>

                  <div>
                    <p className="font-black text-[#172B36]">
                      {address.label || "Shipping Address"}
                    </p>

                    <p className="mt-1 font-semibold text-[#114C5A]">
                      {address.recipient_name}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-[#114C5A]">
                      {address.address_line1}
                      {address.address_line2
                        ? `, ${address.address_line2}`
                        : ""}
                      <br />
                      {address.city}
                      {address.province
                        ? `, ${address.province}`
                        : ""}
                      {address.postal_code
                        ? ` ${address.postal_code}`
                        : ""}
                      <br />
                      {address.country}
                    </p>

                    <p className="mt-2 text-sm text-[#114C5A]">
                      {address.phone}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl bg-[#FF9932]/15 px-4 py-3 text-sm font-semibold text-[#172B36]">
          {error}
        </div>
      )}

      {addresses.length > 0 && (
        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={loading}
          className="mt-8 h-12 w-full rounded-xl bg-[#FFC801] font-black text-[#172B36] transition hover:bg-[#FF9932] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      )}
    </div>
  );
}