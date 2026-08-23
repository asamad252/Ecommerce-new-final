import Link from "next/link";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#F1F6F4] px-4 py-16">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-3xl font-black tracking-tight"
          >
            <span className="text-[#FFC801]">Nex</span>
            <span className="text-[#172B36]">Gear</span>
          </Link>

          <h1 className="mt-6 text-3xl font-black text-[#172B36]">
            Create your account
          </h1>

          <p className="mt-2 text-[#114C5A]">
            Join NexGear and start shopping.
          </p>
        </div>

        <div className="rounded-3xl border border-[#D9E8E2] bg-white p-6 shadow-sm sm:p-8">
          <SignupForm />
        </div>
      </div>
    </main>
  );
}