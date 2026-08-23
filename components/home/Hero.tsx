import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DriftWall from "@/components/effects/DriftWall";

const driftItems = [
  {
    image:
      "https://toxfrykbetnsebozzazt.supabase.co/storage/v1/object/public/Logos/PS.jfif",
    title: "PlayStation",
  },
  {
    image:
      "https://toxfrykbetnsebozzazt.supabase.co/storage/v1/object/public/Logos/NN.webp",
    title: "Nintendo",
  },
  {
    image:
      "https://toxfrykbetnsebozzazt.supabase.co/storage/v1/object/public/Logos/XB.png",
    title: "Xbox",
  },
  {
    image:
      "https://toxfrykbetnsebozzazt.supabase.co/storage/v1/object/public/Logos/RZ.png",
    title: "Razer",
  },
];

export default function Hero() {
  return (
    <section className="relative min-h-[700px] overflow-hidden bg-[#172B36]">
      {/* Hero-only DriftWall */}
      <div className="absolute inset-0">
        <DriftWall
          items={driftItems as never[]}
          columns={5}
          tileWidth={240}
          tileHeight={160}
          gap={20}
          radius={18}
          tilt={10}
          turn={-7}
          perspective={1550}
          depth={85}
          speed={20}
          direction="up"
          variance={0.22}
          parallax={0.15}
          lift={38}
          fade={0.55}
          dim={0.42}
          grayscale={false}
          overlayColor="#172B36"
        />
      </div>

      {/* Very light readability layer */}
      <div className="absolute inset-0 bg-[#172B36]/20" />

      <div className="relative z-10 mx-auto flex min-h-[700px] w-full max-w-[1550px] items-center px-4 sm:px-6 lg:px-10">
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
          <div className="pointer-events-none absolute inset-0 rounded-[36px] border border-[#D9E8E2]/25 transition-colors duration-300 group-hover:border-[#D9E8E2]/40" />

          {/* Highlight */}
          <div className="pointer-events-none absolute left-16 right-16 top-0 h-px bg-gradient-to-r from-transparent via-[#D9E8E2]/35 to-transparent" />

          <div className="relative z-10 flex min-h-[440px] items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-[#FFC801]/40 bg-[#114C5A]/30 px-4 py-2 backdrop-blur-[2px]">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-[#FFC801]">
                  Welcome to NexGear
                </span>
              </div>

              <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-tight text-[#F1F6F4] sm:text-6xl md:text-7xl">
                Gear up.
                <br />
                <span className="text-[#FFC801]">
                  Play better.
                </span>
              </h1>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="group/button inline-flex items-center gap-2 rounded-xl bg-[#FFC801] px-6 py-3.5 font-black text-[#172B36] shadow-[0_8px_24px_rgba(255,200,1,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FF9932]"
                >
                  Shop Now
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-200 group-hover/button:translate-x-1"
                  />
                </Link>

                <Link
                  href="/deals"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#D9E8E2]/30 bg-transparent px-6 py-3.5 font-bold text-[#F1F6F4] backdrop-blur-[2px] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FFC801]/70 hover:text-[#FFC801]"
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