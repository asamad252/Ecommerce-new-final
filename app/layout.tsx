import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

export const metadata: Metadata = {
  title: "NexGear",
  description: "Gaming gear, consoles, accessories and digital games.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-[#172B36] text-[#F1F6F4] antialiased selection:bg-[#FFC801] selection:text-[#172B36]">
        <div className="relative z-30">
          <Navbar />
        </div>

        <main className="relative z-10 flex-1">{children}</main>

        <div className="relative z-20 mt-auto">
          <Footer />
        </div>
      </body>
    </html>
  );
}