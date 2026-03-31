import { Plus, Trash2 } from "lucide-react";
import { formatBdt } from "@/features/invoices/lib/format-bdt";
import {
  lineAmount,
  type InvoiceLineInput,
} from "@/features/invoices/templates/invoice_fluvo_9/invoice-fluvo-9-calculations";
import type { InvoiceFluvo9LineRow } from "@/features/invoices/templates/invoice_fluvo_9/invoice-fluvo-9-types";
import styles from "@/features/invoices/templates/invoice_fluvo_9/invoice-fluvo-9.module.css";
import { cn } from "@/lib/utils/cn";

const FIELD =
  "w-full min-w-0 border-0 border-b border-transparent bg-transparent py-0.5 text-sm text-black placeholder:text-neutral-400 focus:border-black focus:outline-none";
const FIELD_RIGHT = `${FIELD} text-right tabular-nums`;

export type InvoiceFluvo9TableProps = {
  lines: InvoiceFluvo9LineRow[];
  numericLines: InvoiceLineInput[];
  onUpdateLine: (
    id: string,
    patch: Partial<
      Pick<InvoiceFluvo9LineRow, "description" | "qty" | "price" | "taxPercent">
    >
  ) => void;
  onAddLine: () => void;
  onRemoveLastLine: () => void;
};

export function InvoiceFluvo9Table({
  lines,
  numericLines,
  onUpdateLine,
  onAddLine,
  onRemoveLastLine,
}: InvoiceFluvo9TableProps) {
  return (
    <section className="mt-10 space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[540px] border-collapse border border-neutral-300 text-sm">
          <thead>
            <tr className="bg-black text-white">
              <th className="border border-black px-3 py-3 text-left text-xs font-bold uppercase tracking-wide">
                Description
              </th>
              <th className="w-20 border border-black px-2 py-3 text-center text-xs font-bold uppercase tracking-wide">
                QTY
              </th>
              <th className="w-32 border border-black px-2 py-3 text-right text-xs font-bold uppercase tracking-wide">
                Price
              </th>
              <th className="w-24 border border-black px-2 py-3 text-right text-xs font-bold uppercase tracking-wide">
                Tax
              </th>
              <th className="w-32 border border-black px-2 py-3 text-right text-xs font-bold uppercase tracking-wide">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {lines.map((row, i) => {
              const numeric = numericLines[i]!;
              const amt = lineAmount(numeric);
              const stripe = i % 2 === 1;
              return (
                <tr
                  key={row.id}
                  className={cn(stripe ? styles.rowStripe : "bg-white")}
                >
                  <td className="border border-neutral-300 px-3 py-3 align-top">
                    <input
                      className={FIELD}
                      value={row.description}
                      onChange={(e) =>
                        onUpdateLine(row.id, {
                          description: e.target.value,
                        })
                      }
                      aria-label={`Line ${i + 1} description`}
                    />
                  </td>
                  <td className="border border-neutral-300 px-2 py-3 text-center align-top">
                    <input
                      className={cn(FIELD, "text-center tabular-nums")}
                      value={row.qty}
                      onChange={(e) =>
                        onUpdateLine(row.id, { qty: e.target.value })
                      }
                      inputMode="decimal"
                      aria-label={`Line ${i + 1} quantity`}
                    />
                  </td>
                  <td className="border border-neutral-300 px-2 py-3 align-top">
                    <div className="flex items-center justify-end gap-0.5">
                      <span className="text-xs text-neutral-500" aria-hidden>
                        ৳
                      </span>
                      <input
                        className={FIELD_RIGHT}
                        value={row.price}
                        onChange={(e) =>
                          onUpdateLine(row.id, { price: e.target.value })
                        }
                        inputMode="decimal"
                        aria-label={`Line ${i + 1} price`}
                      />
                    </div>
                  </td>
                  <td className="border border-neutral-300 px-2 py-3 align-top">
                    <div className="flex items-center justify-end gap-0.5">
                      <input
                        className={cn(FIELD_RIGHT, "max-w-13")}
                        value={row.taxPercent}
                        onChange={(e) =>
                          onUpdateLine(row.id, { taxPercent: e.target.value })
                        }
                        inputMode="decimal"
                        aria-label={`Line ${i + 1} tax percent`}
                      />
                      <span className="text-xs text-neutral-500">%</span>
                    </div>
                  </td>
                  <td className="border border-neutral-300 px-2 py-3 text-right align-top tabular-nums font-medium text-black">
                    {formatBdt(amt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onAddLine}
          className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-black hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          <Plus className="size-3.5" aria-hidden />
          Add line
        </button>
        {lines.length > 1 ? (
          <button
            type="button"
            onClick={onRemoveLastLine}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <Trash2 className="size-3.5" aria-hidden />
            Remove last line
          </button>
        ) : null}
      </div>
    </section>
  );
}
