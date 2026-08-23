import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MaskedHeading from "@/components/ui/MaskedHeading";

export default function Hero() {
  return (
    <section className="relative min-h-[640px] overflow-hidden bg-transparent">
      <div className="relative z-10 mx-auto flex min-h-[640px] w-full max-w-[1550px] items-center px-4 sm:px-6 lg:px-10">
        {/* Large floating Hero area */}
        <div
          className="
            group
            relative
            mx-auto
            w-full
            max-w-[1500px]
            min-h-[440px]
            rounded-[36px]
            bg-transparent
            shadow-[0_35px_100px_rgba(0,0,0,0.28)]
            transition-all
            duration-500
            hover:-translate-y-1
            hover:shadow-[0_45px_120px_rgba(0,0,0,0.36)]
            px-8
            py-10
            sm:px-12
            sm:py-12
            md:px-16
            md:py-14
            lg:px-20
            lg:py-16
          "
        >
          {/* Subtle outline */}
          <div className="pointer-events-none absolute inset-0 rounded-[36px] border border-[#D9E8E2]/25 backdrop-blur-[2px] transition-colors duration-300 group-hover:border-[#D9E8E2]/40" />

          {/* Highlight */}
          <div className="pointer-events-none absolute left-16 right-16 top-0 h-px bg-gradient-to-r from-transparent via-[#D9E8E2]/35 to-transparent" />

          <div className="relative z-10 flex min-h-[440px] items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-[#FFC801]/40 bg-[#114C5A]/40 px-4 py-2 backdrop-blur-md">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-[#FFC801]">
                  Welcome to NexGear
                </span>
              </div>

              <div className="mt-4 max-w-2xl">
                <MaskedHeading
                  text="Gear up. Play better."
                  tag="h1"
                  align="left"
                  weight={900}
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80"
                  fillScale={1.35}
                  parallax={30}
                  drift={16}
                  reveal="rise"
                  trigger="mount"
                  textScale={0.11}
                  className="font-black drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
                />
              </div>

              <p className="mt-4 max-w-xl text-base text-[#D9E8E2]/85 sm:text-lg">
                Discover flagship next-gen consoles, esports hardware, high-octane PC rigs, and premium gaming gear.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="group/button inline-flex items-center gap-2 rounded-xl bg-[#FFC801] px-6 py-3.5 font-black text-[#172B36] shadow-[0_8px_24px_rgba(255,200,1,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FF9932]"
                >
                  Shop Now
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-200 group-hover/button:translate-x-1"
                  />
                </Link>

                <Link
                  href="/deals"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#D9E8E2]/30 bg-[#172B36]/60 px-6 py-3.5 font-bold text-[#F1F6F4] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FFC801]/70 hover:text-[#FFC801]"
                >
                  View Deals
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
