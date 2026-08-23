interface CheckoutItem {
  id: number;
  quantity: number;
  products: {
    id: number;
    name: string;
    price: number;
    stock: number;
  } | null;
}

interface CheckoutSummaryProps {
  items: CheckoutItem[];
  subtotal: number;
}

export default function CheckoutSummary({
  items,
  subtotal,
}: CheckoutSummaryProps) {
  return (
    <aside className="h-fit rounded-2xl border border-[#D9E8E2] bg-white p-6">
      <h2 className="text-xl font-black text-[#172B36]">
        Order summary
      </h2>

      <div className="mt-6 space-y-4">
        {items.map((item) => {
          if (!item.products) return null;

          return (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="font-semibold text-[#172B36]">
                  {item.products.name}
                </p>

                <p className="mt-1 text-sm text-[#114C5A]">
                  Qty: {item.quantity}
                </p>
              </div>

              <p className="shrink-0 font-bold text-[#114C5A]">
                Rs.{" "}
                {(
                  Number(item.products.price) *
                  item.quantity
                ).toLocaleString("en-PK")}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 border-t border-[#D9E8E2] pt-5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#172B36]">
            Subtotal
          </span>

          <span className="text-xl font-black text-[#114C5A]">
            Rs. {subtotal.toLocaleString("en-PK")}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-[#114C5A]">
            Shipping
          </span>

          <span className="font-semibold text-[#114C5A]">
            Calculated
          </span>
        </div>
      </div>
    </aside>
  );
}