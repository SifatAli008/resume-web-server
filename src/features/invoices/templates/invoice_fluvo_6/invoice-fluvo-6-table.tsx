import { Plus, Trash2 } from "lucide-react";
import { formatBdt } from "@/features/invoices/lib/format-bdt";
import {
  lineAmount,
  type InvoiceLineInput,
} from "@/features/invoices/templates/invoice_fluvo_6/invoice-fluvo-6-calculations";
import type { InvoiceFluvo6LineRow } from "@/features/invoices/templates/invoice_fluvo_6/invoice-fluvo-6-types";
import styles from "@/features/invoices/templates/invoice_fluvo_6/invoice-fluvo-6.module.css";
import { cn } from "@/lib/utils/cn";

const FIELD =
  "w-full min-w-0 border-0 border-b border-transparent bg-transparent py-0.5 text-sm text-[#232323] placeholder:text-zinc-400 focus:border-[#f39200] focus:outline-none";
const FIELD_RIGHT = `${FIELD} text-right tabular-nums`;

export type InvoiceFluvo6TableProps = {
  lines: InvoiceFluvo6LineRow[];
  numericLines: InvoiceLineInput[];
  onUpdateLine: (
    id: string,
    patch: Partial<
      Pick<InvoiceFluvo6LineRow, "description" | "qty" | "price" | "taxPercent">
    >
  ) => void;
  onAddLine: () => void;
  onRemoveLastLine: () => void;
};

export function InvoiceFluvo6Table({
  lines,
  numericLines,
  onUpdateLine,
  onAddLine,
  onRemoveLastLine,
}: InvoiceFluvo6TableProps) {
  return (
    <section className="mt-10 space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[540px] border-collapse border border-zinc-200 text-sm">
          <thead>
            <tr
              className="text-white"
              style={{ backgroundColor: "#f39200" }}
            >
              <th className="border border-zinc-200 px-3 py-3 text-left text-xs font-bold uppercase tracking-wide">
                Description
              </th>
              <th className="w-20 border border-zinc-200 px-2 py-3 text-center text-xs font-bold uppercase tracking-wide">
                QTY
              </th>
              <th className="w-32 border border-zinc-200 px-2 py-3 text-right text-xs font-bold uppercase tracking-wide">
                Price
              </th>
              <th className="w-24 border border-zinc-200 px-2 py-3 text-right text-xs font-bold uppercase tracking-wide">
                Tax
              </th>
              <th className="w-32 border border-zinc-200 px-2 py-3 text-right text-xs font-bold uppercase tracking-wide">
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
                <tr key={row.id} className={cn(stripe ? styles.rowTint : "bg-white")}>
                  <td className="border border-zinc-200 px-3 py-2 align-top">
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
                  <td className="border border-zinc-200 px-2 py-2 text-center align-top">
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
                  <td className="border border-zinc-200 px-2 py-2 align-top">
                    <div className="flex items-center justify-end gap-0.5">
                      <span className="text-xs text-zinc-500" aria-hidden>
                        $
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
                  <td className="border border-zinc-200 px-2 py-2 align-top">
                    <div className="flex items-center justify-end gap-0.5">
                      <input
                        className={cn(FIELD_RIGHT, "max-w-[3.25rem]")}
                        value={row.taxPercent}
                        onChange={(e) =>
                          onUpdateLine(row.id, { taxPercent: e.target.value })
                        }
                        inputMode="decimal"
                        aria-label={`Line ${i + 1} tax percent`}
                      />
                      <span className="text-xs text-zinc-500">%</span>
                    </div>
                  </td>
                  <td className="border border-zinc-200 px-2 py-2 text-right align-top tabular-nums font-medium text-[#232323]">
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
          className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-medium text-[#232323] hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f39200]"
          style={{ borderColor: "rgba(243, 146, 0, 0.45)" }}
        >
          <Plus className="size-3.5" style={{ color: "#f39200" }} aria-hidden />
          Add line
        </button>
        {lines.length > 1 ? (
          <button
            type="button"
            onClick={onRemoveLastLine}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-[#232323] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f39200]"
          >
            <Trash2 className="size-3.5" aria-hidden />
            Remove last line
          </button>
        ) : null}
      </div>
    </section>
  );
}
