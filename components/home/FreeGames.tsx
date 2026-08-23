import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export default function FreeGames() {
  return (
    <section className="bg-[#D9E8E2] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-[#F1F6F4] p-8 md:p-12">
          <div className="grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#FFC801] px-4 py-2 text-sm font-black text-[#172B36]">
                <Zap size={16} />
                DIGITAL GAMING
              </div>

              <h2 className="mt-5 text-4xl font-black tracking-tight text-[#172B36]">
                Your next game is closer than you think.
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-[#114C5A]">
                Discover digital games, gift cards and gaming codes with fast
                delivery.
              </p>

              <Link
                href="/shop?category=digital-codes"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#114C5A] px-6 py-3.5 font-bold text-[#F1F6F4] transition hover:bg-[#172B36]"
              >
                Browse Digital Store
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="flex min-h-[260px] items-center justify-center rounded-2xl bg-[#114C5A]">
              <div className="text-center">
                <p className="text-5xl font-black text-[#FFC801]">
                  PLAY
                </p>

                <p className="text-5xl font-black text-[#F1F6F4]">
                  NOW
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}