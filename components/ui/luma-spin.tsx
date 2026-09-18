import { cn } from "@/lib/utils";

interface LumaSpinProps {
  className?: string;
  size?: number;
}

export const Component = ({ className, size = 24 }: LumaSpinProps) => {
  return (
    <div
      className={cn("relative aspect-square shrink-0", className)}
      style={{ width: size }}
      role="status"
      aria-label="Loading"
    >
      <span className="luma-spin-ring absolute rounded-[50px] shadow-[inset_0_0_0_3px] shadow-[#172B36]" />
      <span className="luma-spin-ring luma-spin-delay absolute rounded-[50px] shadow-[inset_0_0_0_3px] shadow-[#172B36]" />
    </div>
  );
};

export const LumaSpin = Component;
