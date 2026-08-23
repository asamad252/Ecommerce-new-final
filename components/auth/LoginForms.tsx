"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForms() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-bold text-[#172B36]"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="h-12 w-full rounded-xl border border-[#D9E8E2] bg-[#F1F6F4] px-4 text-[#172B36] outline-none transition placeholder:text-[#114C5A]/50 focus:border-[#FFC801] focus:ring-2 focus:ring-[#FFC801]/20"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-bold text-[#172B36]"
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="h-12 w-full rounded-xl border border-[#D9E8E2] bg-[#F1F6F4] px-4 text-[#172B36] outline-none transition placeholder:text-[#114C5A]/50 focus:border-[#FFC801] focus:ring-2 focus:ring-[#FFC801]/20"
        />
      </div>

      {error && (
        <div className="rounded-xl bg-[#FF9932]/15 px-4 py-3 text-sm font-semibold text-[#172B36]">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-xl bg-[#FFC801] font-black text-[#172B36] transition hover:bg-[#FF9932] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Login"}
      </button>

      <p className="text-center text-sm text-[#114C5A]">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="font-bold text-[#114C5A] hover:text-[#FF9932]"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}