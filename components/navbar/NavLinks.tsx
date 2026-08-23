"use client";

import { usePathname } from "next/navigation";
import PillNav from "./PillNav";

const items = [
  {
    label: "Shop",
    href: "/shop",
  },
  {
    label: "Deals",
    href: "/deals",
  },
  {
    label: "New Arrivals",
    href: "/new-arrivals",
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  let activeHref;

  if (pathname.startsWith("/shop")) {
    activeHref = "/shop";
  } else if (pathname.startsWith("/deals")) {
    activeHref = "/deals";
  } else if (
    pathname.startsWith("/new-arrivals")
  ) {
    activeHref = "/new-arrivals";
  }

  return (
    <PillNav
      items={items as never[]}
      activeHref={activeHref}
    />
  );
}