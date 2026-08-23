import Link from "next/link";
import {
  ArrowRight,
  Gamepad2,
  Gift,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Gamepad2,
    title: "Digital Games",
    description:
      "Discover your next game and start playing quickly.",
  },
  {
    icon: Gift,
    title: "Gift Cards",
    description:
      "Find gaming gift cards for your favorite platforms.",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description:
      "Digital products delivered straight to you.",
  },
];

export default function DigitalGaming() {
  return (
    <section className="relative bg-transparent py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main panel */}
        <div className="relative overflow-hidden rounded-[30px] border border-[#D9E8E2]/70 bg-[#F1F6F4]/85 shadow-[0_20px_60px_rgba(23,43,54,0.12)] backdrop-blur-[3px]">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            {/* =========================
                CONTENT
               ========================= */}
            <div className="relative z-10 p-7 sm:p-9 md:p-12 lg:p-14">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FFC801]/25 bg-white/65 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#172B36] backdrop-blur-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFC801]">
                  <Zap
                    size={13}
                    className="text-[#172B36]"
                    strokeWidth={2.5}
                  />
                </span>

                Digital Gaming
              </div>

              {/* Heading */}
              <h2 className="mt-6 max-w-2xl text-4xl font-black leading-[1.02] tracking-tight text-[#172B36] sm:text-5xl lg:text-[3.4rem]">
                Your next game is
                <span className="text-[#FF9932]">
                  {" "}
                  closer.
                </span>
              </h2>

              {/* Description */}
              <p className="mt-5 max-w-xl text-base leading-7 text-[#114C5A]">
                Discover digital games, gift cards,
                and gaming codes and get your next
                gaming experience started.
              </p>

              {/* CTA */}
              <Link
                href="/shop?category=digital-codes"
                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-[#FFC801] px-6 py-3.5 font-black text-[#172B36] transition-all duration-200 hover:bg-[#FF9932] hover:shadow-lg"
              >
                Browse Digital Store

                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>

              {/* Features */}
              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                {features.map(
                  (feature) => {
                    const Icon =
                      feature.icon;

                    return (
                      <div
                        key={
                          feature.title
                        }
                        className="group"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D9E8E2] text-[#114C5A] transition-colors duration-200 group-hover:bg-[#FFC801] group-hover:text-[#172B36]">
                          <Icon size={19} />
                        </div>

                        <h3 className="mt-3 text-sm font-black text-[#172B36]">
                          {feature.title}
                        </h3>

                        <p className="mt-1 text-sm leading-5 text-[#114C5A]/75">
                          {
                            feature.description
                          }
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* =========================
                VISUAL
               ========================= */}
            <div className="relative min-h-[340px] overflow-hidden bg-[#114C5A] lg:min-h-full">
              {/* Yellow glow */}
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#FFC801]/80 blur-sm" />

              {/* Orange glow */}
              <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#FF9932]/75 blur-sm" />

              {/* Deep teal overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#114C5A]/20 via-[#172B36]/20 to-[#172B36]/65" />

              {/* Decorative shapes */}
              <div className="absolute right-12 top-10 h-3 w-3 rounded-full bg-[#FFC801]" />

              <div className="absolute right-24 top-20 h-2 w-2 rounded-full bg-[#FF9932]" />

              <div className="absolute bottom-12 right-16 h-4 w-4 rounded-full border-2 border-[#FFC801]/70" />

              {/* Main digital card */}
              <div className="relative z-10 flex h-full min-h-[340px] items-center justify-center p-8 sm:p-10">
                <div className="relative w-full max-w-sm overflow-hidden rounded-[28px] border border-[#D9E8E2]/10 bg-[#172B36]/90 p-7 shadow-2xl backdrop-blur-sm">
                  {/* top row */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-[#D9E8E2]">
                      NexGear Digital
                    </span>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFC801]">
                      <Gamepad2
                        size={21}
                        className="text-[#172B36]"
                      />
                    </div>
                  </div>

                  {/* Main text */}
                  <div className="mt-10">
                    <p className="text-5xl font-black tracking-tight text-[#F1F6F4]">
                      PLAY
                    </p>

                    <p className="text-5xl font-black tracking-tight text-[#FFC801]">
                      NOW
                    </p>
                  </div>

                  <p className="mt-4 max-w-xs text-sm leading-6 text-[#D9E8E2]/80">
                    Games, gift cards and digital
                    codes ready when you are.
                  </p>

                  {/* Progress */}
                  <div className="mt-8">
                    <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                      <span className="text-[#D9E8E2]/70">
                        Ready to play
                      </span>

                      <span className="text-[#FFC801]">
                        75%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#114C5A]">
                      <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#FFC801] to-[#FF9932]" />
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div className="mt-8 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#FFC801]" />
                    <span className="text-xs font-bold text-[#D9E8E2]">
                      Instant digital access
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}