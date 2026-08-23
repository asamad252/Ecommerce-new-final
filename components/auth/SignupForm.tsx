"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupForm() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/");
      router.refresh();
      return;
    }

    setSuccess(
      "Account created. Check your email to confirm your account."
    );

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="fullName"
          className="mb-2 block text-sm font-bold text-[#172B36]"
        >
          Full name
        </label>

        <input
          id="fullName"
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your name"
          className="h-12 w-full rounded-xl border border-[#D9E8E2] bg-[#F1F6F4] px-4 text-[#172B36] outline-none transition placeholder:text-[#114C5A]/50 focus:border-[#FFC801] focus:ring-2 focus:ring-[#FFC801]/20"
        />
      </div>

      <div>
        <label
          htmlFor="signup-email"
          className="mb-2 block text-sm font-bold text-[#172B36]"
        >
          Email
        </label>

        <input
          id="signup-email"
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
          htmlFor="signup-password"
          className="mb-2 block text-sm font-bold text-[#172B36]"
        >
          Password
        </label>

        <input
          id="signup-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          className="h-12 w-full rounded-xl border border-[#D9E8E2] bg-[#F1F6F4] px-4 text-[#172B36] outline-none transition placeholder:text-[#114C5A]/50 focus:border-[#FFC801] focus:ring-2 focus:ring-[#FFC801]/20"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-bold text-[#172B36]"
        >
          Confirm password
        </label>

        <input
          id="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          className="h-12 w-full rounded-xl border border-[#D9E8E2] bg-[#F1F6F4] px-4 text-[#172B36] outline-none transition placeholder:text-[#114C5A]/50 focus:border-[#FFC801] focus:ring-2 focus:ring-[#FFC801]/20"
        />
      </div>

      {error && (
        <div className="rounded-xl bg-[#FF9932]/15 px-4 py-3 text-sm font-semibold text-[#172B36]">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl bg-[#D9E8E2] px-4 py-3 text-sm font-semibold text-[#114C5A]">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-xl bg-[#FFC801] font-black text-[#172B36] transition hover:bg-[#FF9932] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-[#114C5A]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold hover:text-[#FF9932]"
        >
          Login
        </Link>
      </p>
    </form>
  );
}