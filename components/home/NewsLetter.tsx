"use client";

import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";

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
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-[#D9E8E2]/20 bg-[#172B36]/80 p-8 sm:p-12 text-center shadow-2xl backdrop-blur-xl">
          {/* Subtle ambient lighting */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FFC801]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#114C5A]/40 blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFC801]/30 bg-[#FFC801]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#FFC801]">
              <Mail size={14} />
              <span>Stay Updated</span>
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-[#F1F6F4] sm:text-4xl">
              Stay in the game.
            </h2>

            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-[#D9E8E2]/85 text-sm sm:text-base">
              Get new product drops, exclusive flash deals, and tournament gear markdowns straight to your inbox.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-12 flex-1 rounded-xl border border-[#D9E8E2]/20 bg-[#12242F] px-5 text-[#F1F6F4] outline-none transition placeholder:text-[#D9E8E2]/50 focus:border-[#FFC801] focus:ring-2 focus:ring-[#FFC801]/25"
              />

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#FFC801] px-6 font-bold text-[#172B36] shadow-lg shadow-[#FFC801]/15 transition hover:bg-[#FF9932] active:scale-95"
              >
                <span>Subscribe</span>
                <ArrowRight size={17} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
