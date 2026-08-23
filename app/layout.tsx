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
      <body className="bg-transparent text-[#172B36]">
        <Navbar />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}