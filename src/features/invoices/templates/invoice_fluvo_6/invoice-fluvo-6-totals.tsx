import type { ChangeEvent } from "react";
import { formatBdt } from "@/features/invoices/lib/format-bdt";
import { cn } from "@/lib/utils/cn";

const FIELD_RIGHT =
  "w-full min-w-0 border-0 border-b border-transparent bg-transparent py-0.5 text-sm text-[#232323] focus:border-[#f39200] focus:outline-none text-right tabular-nums";

export type InvoiceFluvo6TotalsProps = {
  subtotal: number;
  discount: string;
  invoiceTaxPercent: string;
  taxAmount: number;
  total: number;
  onDiscountChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onInvoiceTaxPercentChange: (v: string) => void;
};

export function InvoiceFluvo6Totals({
  subtotal,
  discount,
  invoiceTaxPercent,
  taxAmount,
  total,
  onDiscountChange,
  onInvoiceTaxPercentChange,
}: InvoiceFluvo6TotalsProps) {
  return (
    <div className="mt-10 flex justify-end">
      <div className="w-full max-w-sm space-y-0 text-sm">
        <div className="flex justify-between gap-6 border-b border-zinc-200 py-2.5">
          <span className="font-bold text-[#232323]">Subtotal</span>
          <span className="tabular-nums text-[#232323]">
            {formatBdt(subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-6 border-b border-zinc-200 py-2.5">
          <span className="font-bold text-[#232323]">Discount</span>
          <span className="inline-flex items-center gap-0.5 tabular-nums text-[#232323]">
            <span aria-hidden>−$</span>
            <input
              className={cn(FIELD_RIGHT, "max-w-[6.5rem]")}
              value={discount}
              onChange={onDiscountChange}
              inputMode="decimal"
              aria-label="Discount amount"
            />
          </span>
        </div>
        <div className="flex items-center justify-between gap-6 border-b border-zinc-200 py-2.5">
          <span className="font-bold text-[#232323]">
            Tax (
            <input
              className="inline-block w-9 border-0 border-b border-transparent bg-transparent text-right font-bold focus:border-[#f39200] focus:outline-none"
              value={invoiceTaxPercent}
              onChange={(e) => onInvoiceTaxPercentChange(e.target.value)}
              inputMode="decimal"
              aria-label="Invoice tax percent"
            />
            %)
          </span>
          <span className="tabular-nums text-[#232323]">
            {formatBdt(taxAmount)}
          </span>
        </div>

        <div
          className="mt-2 flex justify-between gap-6 px-4 py-4 text-lg font-bold text-white"
          style={{ backgroundColor: "#f39200" }}
        >
          <span>TOTAL</span>
          <span className="tabular-nums">{formatBdt(total)}</span>
        </div>
      </div>
    </div>
  );
}
