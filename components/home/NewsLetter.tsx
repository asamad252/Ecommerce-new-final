"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function NewsLetter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) return;

    console.log("Newsletter signup:", email);

    setEmail("");
  };

  return (
    <section className="relative bg-transparent py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FF9932]">
          Stay updated
        </p>

        <h2 className="mt-3 text-4xl font-black tracking-tight text-[#172B36]">
          Stay in the game.
        </h2>

        <p className="mx-auto mt-4 max-w-xl leading-7 text-[#114C5A]">
          Get new product drops, exclusive deals and gaming updates straight
          to your inbox.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="h-12 flex-1 rounded-xl border border-[#D9E8E2] bg-white px-5 text-[#172B36] outline-none transition placeholder:text-[#114C5A]/50 focus:border-[#FFC801] focus:ring-2 focus:ring-[#FFC801]/20"
          />

          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#FFC801] px-6 font-bold text-[#172B36] transition hover:bg-[#FF9932]"
          >
            Subscribe
            <ArrowRight size={17} />
          </button>
        </form>
      </div>
    </section>
  );
}