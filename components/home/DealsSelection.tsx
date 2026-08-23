import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Tag, Zap, Flame } from "lucide-react";
import { getDealsProducts } from "@/lib/data/storeData";
import ElectricBorder from "@/components/ui/ElectricBorder";
import WarpText from "@/components/ui/WarpText";

export default async function DealsSection() {
  const validDeals = await getDealsProducts(4);

  return (
    <section className="relative bg-transparent py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ElectricBorder
          color="#FFC801"
          speed={1}
          chaos={0.12}
          borderRadius={32}
          className="w-full shadow-2xl"
        >
          <div className="relative overflow-hidden rounded-[2rem] bg-[#172B36] p-8 md:p-12 lg:p-14">
            {/* Background glowing ambient light */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#FFC801]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#FF9932]/10 blur-3xl" />

            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-12">
              {/* Left Column: Heading & CTAs */}
              <div className="lg:col-span-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#FFC801]/30 bg-[#FFC801]/15 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-[#FFC801]">
                  <Zap size={14} className="fill-[#FFC801] stroke-[#FFC801]" />
                  <span>High-Voltage Deals</span>
                </div>

                <div className="mt-4 -ml-2">
                  <WarpText
                    text="Level up without breaking the bank."
                    color="#F1F6F4"
                    warpStrength={0.06}
                    warpScale={1.5}
                    speed={0.5}
                    pointerInfluence={0.38}
                    pointerStrength={0.35}
                    refraction={0.016}
                    fontSize="clamp(1.75rem, 3.2vw, 2.75rem)"
                    fontWeight={900}
                    letterSpacing="-0.03em"
                    lineHeight={1.05}
                    style={{ height: '110px', minHeight: '90px' }}
                  />
                </div>

                <p className="mt-2 max-w-md text-base leading-relaxed text-[#D9E8E2]/90">
                  Get more gaming gear for less with exclusive limited-time NexGear flash discounts and bundle offers.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href="/deals"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#FFC801] px-6 py-3.5 text-sm font-black text-[#172B36] shadow-lg shadow-[#FFC801]/20 transition-all duration-200 hover:bg-[#FF9932] hover:shadow-xl hover:shadow-[#FF9932]/30 active:scale-95"
                  >
                    <span>Shop All Deals</span>
                    <ArrowRight size={18} />
                  </Link>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#D9E8E2]/70">
                    <Flame size={16} className="text-[#FF9932]" />
                    <span>Up to 40% Off Selected Rigs & Gear</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Deal Items */}
              <div className="grid gap-3.5 sm:grid-cols-2 lg:col-span-7">
                {validDeals.length === 0 ? (
                  <div className="col-span-full rounded-2xl border border-[#FFC801]/20 bg-[#12222B] p-8 text-center">
                    <p className="text-xl font-black text-[#F1F6F4]">
                      Fresh deals dropping shortly
                    </p>
                    <p className="mt-2 text-sm text-[#D9E8E2]/70">
                      Check back soon for new discounts on gaming gear and accessories.
                    </p>
                  </div>
                ) : (
                  validDeals.map((deal) => {
                    const oldPrice = Number(deal.compare_at_price);
                    const newPrice = Number(deal.price);
                    const discount =
                      oldPrice > newPrice
                        ? Math.round(((oldPrice - newPrice) / oldPrice) * 100)
                        : 0;

                    const images = Array.isArray(deal.product_images)
                      ? deal.product_images
                      : [];
                    const primaryImage =
                      images.find((img) => img.is_primary) ?? images[0];

                    return (
                      <Link
                        key={deal.id}
                        href={`/product/${deal.slug}`}
                        className="group flex flex-col justify-between rounded-2xl border border-[#D9E8E2]/15 bg-[#12242F]/90 p-4 backdrop-blur-sm transition-all duration-200 hover:border-[#FFC801]/60 hover:bg-[#152e3b] hover:shadow-md active:scale-[0.98]"
                      >
                        <div className="flex items-start gap-3">
                          {primaryImage?.image_url ? (
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white p-1 shadow-sm">
                              <Image
                                src={primaryImage.image_url}
                                alt={deal.name}
                                fill
                                sizes="64px"
                                className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#172B36] text-[#FFC801]">
                              <Tag size={24} />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm font-bold text-[#F1F6F4] transition-colors group-hover:text-[#FFC801]">
                              {deal.name}
                            </p>
                            {discount > 0 && (
                              <span className="mt-1 inline-block rounded bg-[#FF9932]/25 px-1.5 py-0.5 text-[10px] font-black uppercase text-[#FF9932]">
                                Save {discount}%
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-3 flex items-baseline justify-between border-t border-[#D9E8E2]/10 pt-2.5">
                          <div>
                            <span className="text-sm font-black text-[#FFC801]">
                              Rs. {newPrice.toLocaleString("en-PK")}
                            </span>
                            {oldPrice > newPrice && (
                              <span className="ml-1.5 text-xs text-[#D9E8E2]/50 line-through">
                                Rs. {oldPrice.toLocaleString("en-PK")}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-bold text-[#D9E8E2] transition-transform duration-200 group-hover:translate-x-1">
                            &rarr;
                          </span>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </ElectricBorder>
      </div>
    </section>
  );
}
