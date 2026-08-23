"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddressForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    label: "",
    recipientName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Pakistan",
    isDefault: false,
  });

  const updateField = (
    field: keyof typeof form,
    value: string | boolean
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to save address."
        );
      }

      setForm({
        label: "",
        recipientName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        province: "",
        postalCode: "",
        country: "Pakistan",
        isDefault: false,
      });

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save address."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#D9E8E2] bg-white p-6 sm:p-8"
    >
      <h2 className="text-xl font-black text-[#172B36]">
        Add address
      </h2>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <input
          required
          placeholder="Label (e.g. Home)"
          value={form.label}
          onChange={(e) =>
            updateField("label", e.target.value)
          }
          className="h-12 rounded-xl border border-[#D9E8E2] bg-[#F1F6F4] px-4 outline-none focus:border-[#FFC801]"
        />

        <input
          required
          placeholder="Recipient name"
          value={form.recipientName}
          onChange={(e) =>
            updateField("recipientName", e.target.value)
          }
          className="h-12 rounded-xl border border-[#D9E8E2] bg-[#F1F6F4] px-4 outline-none focus:border-[#FFC801]"
        />

        <input
          required
          type="tel"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) =>
            updateField("phone", e.target.value)
          }
          className="h-12 rounded-xl border border-[#D9E8E2] bg-[#F1F6F4] px-4 outline-none focus:border-[#FFC801]"
        />

        <input
          required
          placeholder="Address line 1"
          value={form.addressLine1}
          onChange={(e) =>
            updateField("addressLine1", e.target.value)
          }
          className="h-12 rounded-xl border border-[#D9E8E2] bg-[#F1F6F4] px-4 outline-none focus:border-[#FFC801]"
        />

        <input
          placeholder="Address line 2"
          value={form.addressLine2}
          onChange={(e) =>
            updateField("addressLine2", e.target.value)
          }
          className="h-12 rounded-xl border border-[#D9E8E2] bg-[#F1F6F4] px-4 outline-none focus:border-[#FFC801] sm:col-span-2"
        />

        <input
          required
          placeholder="City"
          value={form.city}
          onChange={(e) =>
            updateField("city", e.target.value)
          }
          className="h-12 rounded-xl border border-[#D9E8E2] bg-[#F1F6F4] px-4 outline-none focus:border-[#FFC801]"
        />

        <input
          placeholder="Province"
          value={form.province}
          onChange={(e) =>
            updateField("province", e.target.value)
          }
          className="h-12 rounded-xl border border-[#D9E8E2] bg-[#F1F6F4] px-4 outline-none focus:border-[#FFC801]"
        />

        <input
          placeholder="Postal code"
          value={form.postalCode}
          onChange={(e) =>
            updateField("postalCode", e.target.value)
          }
          className="h-12 rounded-xl border border-[#D9E8E2] bg-[#F1F6F4] px-4 outline-none focus:border-[#FFC801]"
        />

        <input
          required
          value={form.country}
          onChange={(e) =>
            updateField("country", e.target.value)
          }
          className="h-12 rounded-xl border border-[#D9E8E2] bg-[#F1F6F4] px-4 outline-none focus:border-[#FFC801]"
        />
      </div>

      <label className="mt-5 flex items-center gap-3 text-sm font-semibold text-[#114C5A]">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) =>
            updateField("isDefault", e.target.checked)
          }
          className="h-4 w-4 accent-[#FFC801]"
        />
        Make this my default address
      </label>

      {error && (
        <div className="mt-5 rounded-xl bg-[#FF9932]/15 px-4 py-3 text-sm font-semibold text-[#172B36]">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 h-12 rounded-xl bg-[#FFC801] px-6 font-black text-[#172B36] transition hover:bg-[#FF9932] disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save Address"}
      </button>
    </form>
  );
}