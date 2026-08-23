import DriftWall from "@/components/effects/DriftWall";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import DealsSelection from "@/components/home/DealsSelection";
import Newsletter from "@/components/home/NewsLetter";

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

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#172B36] text-[#F1F6F4] overflow-x-hidden">
      {/* Full-Page Fixed Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#172B36]">
        <DriftWall
          items={driftItems as never[]}
          columns={6}
          tileWidth={240}
          tileHeight={160}
          gap={24}
          radius={18}
          tilt={10}
          turn={-7}
          perspective={1600}
          depth={85}
          speed={18}
          direction="up"
          variance={0.22}
          parallax={0.15}
          lift={38}
          fade={0.35}
          dim={0.48}
          grayscale={false}
          overlayColor="#172B36"
        />

        {/* Ambient depth gradients for contrast across the full page */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#172B36]/35 via-[#172B36]/65 to-[#172B36]/90" />
      </div>

      {/* Page Content Layers (Transparent backdrops allow animated background to flow throughout) */}
      <div className="relative z-10 flex flex-col">
        <Hero />
        <FeaturedProducts />
        <DealsSelection />
        <Newsletter />
      </div>
    </div>
  );
}
