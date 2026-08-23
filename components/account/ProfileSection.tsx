"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ProfileSectionProps {
  userId: string;
  email: string;
  initialFullName: string;
  initialPhone: string;
}

export default function ProfileSection({
  userId,
  email,
  initialFullName,
  initialPhone,
}: ProfileSectionProps) {
  const supabase = createClient();

  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(initialPhone);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        phone: phone.trim(),
      })
      .eq("id", userId);

    if (error) {
      setError("Unable to update your profile.");
    } else {
      setMessage("Profile updated successfully.");
    }

    setLoading(false);
  };

  return (
    <section className="rounded-2xl border border-[#D9E8E2] bg-white p-6 sm:p-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FF9932]">
          My account
        </p>

        <h1 className="mt-2 text-3xl font-black text-[#172B36]">
          Profile
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-5">
        <div>
          <label
            htmlFor="account-email"
            className="mb-2 block text-sm font-bold text-[#172B36]"
          >
            Email
          </label>

          <input
            id="account-email"
            type="email"
            value={email}
            disabled
            className="h-12 w-full rounded-xl border border-[#D9E8E2] bg-[#D9E8E2]/50 px-4 text-[#114C5A]/70"
          />
        </div>

        <div>
          <label
            htmlFor="account-name"
            className="mb-2 block text-sm font-bold text-[#172B36]"
          >
            Full name
          </label>

          <input
            id="account-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-12 w-full rounded-xl border border-[#D9E8E2] bg-[#F1F6F4] px-4 text-[#172B36] outline-none focus:border-[#FFC801]"
          />
        </div>

        <div>
          <label
            htmlFor="account-phone"
            className="mb-2 block text-sm font-bold text-[#172B36]"
          >
            Phone
          </label>

          <input
            id="account-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-12 w-full rounded-xl border border-[#D9E8E2] bg-[#F1F6F4] px-4 text-[#172B36] outline-none focus:border-[#FFC801]"
          />
        </div>

        {error && (
          <div className="rounded-xl bg-[#FF9932]/15 px-4 py-3 text-sm font-semibold text-[#172B36]">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-xl bg-[#D9E8E2] px-4 py-3 text-sm font-semibold text-[#114C5A]">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-12 rounded-xl bg-[#FFC801] px-6 font-black text-[#172B36] transition hover:bg-[#FF9932] disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}