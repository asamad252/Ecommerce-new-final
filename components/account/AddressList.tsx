"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

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

interface AddressListProps {
  addresses: Address[];
}

export default function AddressList({
  addresses,
}: AddressListProps) {
  const router = useRouter();

  const deleteAddress = async (id: number) => {
    const confirmed = window.confirm(
      "Delete this address?"
    );

    if (!confirmed) return;

    const response = await fetch("/api/addresses", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ addressId: id }),
    });

    if (response.ok) {
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      {addresses.length === 0 ? (
        <div className="rounded-2xl bg-[#F1F6F4] p-8 text-center">
          <p className="font-bold text-[#172B36]">
            No saved addresses.
          </p>
        </div>
      ) : (
        addresses.map((address) => (
          <div
            key={address.id}
            className="rounded-2xl border border-[#D9E8E2] p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-black text-[#172B36]">
                    {address.label || "Address"}
                  </h3>

                  {address.is_default && (
                    <span className="rounded-full bg-[#FFC801] px-2.5 py-1 text-xs font-black text-[#172B36]">
                      Default
                    </span>
                  )}
                </div>

                <p className="mt-2 font-semibold text-[#114C5A]">
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

              <button
                type="button"
                onClick={() =>
                  deleteAddress(address.id)
                }
                className="rounded-lg p-2 text-[#114C5A] transition hover:bg-[#FF9932]/15 hover:text-[#FF9932]"
                aria-label="Delete address"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}