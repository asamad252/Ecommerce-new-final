import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import DealsSelection from "@/components/home/DealsSelection";
import FreeGames from "@/components/home/FreeGames";
import DigitalGaming from "@/components/home/DigitalGaming";
import Newsletter from "@/components/home/NewsLetter";

export default function HomePage() {
  return (
    <main className="bg-[#F1F6F4] text-[#172B36]">
      <Hero />

      

      <FeaturedProducts />

      <DealsSelection />

      <FreeGames />

      <DigitalGaming />

      <Newsletter />
    </main>
  );
}