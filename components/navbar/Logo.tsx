import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="shrink-0 text-2xl font-black tracking-tight"
      aria-label="NexGear Home"
    >
      <span className="text-[#FFC801]">
        Nex
      </span>

      <span className="text-[#F1F6F4]">
        Gear
      </span>
    </Link>
  );
}