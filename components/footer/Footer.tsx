import Link from "next/link";
import {
  Share2,
  Camera,
  AtSign,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const shopLinks = [
  { label: "Gaming PCs", href: "/shop?category=gaming-pcs" },
  { label: "Gaming Laptops", href: "/shop?category=gaming-laptops" },
  { label: "Consoles", href: "/shop?category=consoles" },
  { label: "Peripherals", href: "/shop?category=peripherals" },
  { label: "Monitors", href: "/shop?category=monitors" },
  { label: "Digital Codes", href: "/shop?category=digital-codes" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Deals", href: "/deals" },
  { label: "New Arrivals", href: "/new-arrivals" },
];

const legalLinks = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Return Policy", href: "/returns" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-[#114C5A]/80 bg-[#12222B]/95 text-[#F1F6F4] backdrop-blur-xl shadow-2xl">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-3xl font-black tracking-tight"
            >
              <span className="text-[#FFC801]">Nex</span>
              <span className="text-[#F1F6F4]">Gear</span>
            </Link>

            <p className="mt-5 max-w-sm leading-7 text-[#D9E8E2]">
              Your destination for gaming PCs, consoles, peripherals,
              monitors, digital games, and everything gaming.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#D9E8E2]">
                <MapPin size={17} className="text-[#FFC801]" />
                Karachi, Pakistan
              </div>

              <div className="flex items-center gap-3 text-sm text-[#D9E8E2]">
                <Phone size={17} className="text-[#FFC801]" />
                +92 XXX XXXXXXX
              </div>

              <div className="flex items-center gap-3 text-sm text-[#D9E8E2]">
                <Mail size={17} className="text-[#FFC801]" />
                support@nexgear.com
              </div>
            </div>

            {/* Socials */}
            <div className="mt-7 flex items-center gap-3">
              <a
                href="#"
                aria-label="Social media"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#114C5A] text-[#F1F6F4] transition hover:bg-[#FFC801] hover:text-[#172B36]"
              >
                <Share2 size={18} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#114C5A] text-[#F1F6F4] transition hover:bg-[#FFC801] hover:text-[#172B36]"
              >
                <Camera size={18} />
              </a>

              <a
                href="#"
                aria-label="X"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#114C5A] text-[#F1F6F4] transition hover:bg-[#FFC801] hover:text-[#172B36]"
              >
                <AtSign size={18} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.15em] text-[#FFC801]">
              Shop
            </h3>

            <ul className="mt-5 space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#D9E8E2] transition hover:text-[#FFC801]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.15em] text-[#FFC801]">
              Company
            </h3>

            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#D9E8E2] transition hover:text-[#FFC801]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.15em] text-[#FFC801]">
              Legal
            </h3>

            <ul className="mt-5 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#D9E8E2] transition hover:text-[#FFC801]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-[#114C5A] pt-6">
          <div className="flex flex-col gap-3 text-sm text-[#D9E8E2] sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} NexGear. All rights reserved.
            </p>

            <p>
              Built for gamers.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}