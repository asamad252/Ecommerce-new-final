import { LumaSpin } from "@/components/ui/luma-spin";

export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center bg-[#172B36]" role="status" aria-label="Loading page">
      <LumaSpin size={64} className="[&>span]:shadow-[#FFC801]" />
    </div>
  );
}
