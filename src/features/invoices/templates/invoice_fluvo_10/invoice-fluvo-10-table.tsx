import { Plus, Trash2 } from "lucide-react";
import { formatBdt } from "@/features/invoices/lib/format-bdt";
import {
  lineAmount,
  type InvoiceLineInput,
} from "@/features/invoices/templates/invoice_fluvo_10/invoice-fluvo-10-calculations";
import type { InvoiceFluvo10LineRow } from "@/features/invoices/templates/invoice_fluvo_10/invoice-fluvo-10-types";
import styles from "@/features/invoices/templates/invoice_fluvo_10/invoice-fluvo-10.module.css";
import { cn } from "@/lib/utils/cn";

const FIELD =
  "w-full min-w-0 border-0 border-b border-transparent bg-transparent py-0.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-[#E8502D] focus:outline-none";
const FIELD_RIGHT = `${FIELD} text-right tabular-nums`;

const ORANGE_BG = "#E8502D";

export type InvoiceFluvo10TableProps = {
  lines: InvoiceFluvo10LineRow[];
  numericLines: InvoiceLineInput[];
  onUpdateLine: (
    id: string,
    patch: Partial<
      Pick<
        InvoiceFluvo10LineRow,
        "description" | "qty" | "price" | "taxPercent"
      >
    >
  ) => void;
  onAddLine: () => void;
  onRemoveLastLine: () => void;
};

export function InvoiceFluvo10Table({
  lines,
  numericLines,
  onUpdateLine,
  onAddLine,
  onRemoveLastLine,
}: InvoiceFluvo10TableProps) {
  return (
    <section className="mt-10 space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[540px] border-collapse text-sm">
          <thead>
            <tr className="text-white" style={{ backgroundColor: ORANGE_BG }}>
              <th className="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide">
                Description
              </th>
              <th className="w-20 px-2 py-3.5 text-center text-xs font-bold uppercase tracking-wide">
                QTY
              </th>
              <th className="w-32 px-2 py-3.5 text-right text-xs font-bold uppercase tracking-wide">
                Price
              </th>
              <th className="w-24 px-2 py-3.5 text-right text-xs font-bold uppercase tracking-wide">
                Tax
              </th>
              <th className="w-32 px-2 py-3.5 text-right text-xs font-bold uppercase tracking-wide">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {lines.map((row, i) => {
              const numeric = numericLines[i]!;
              const amt = lineAmount(numeric);
              const highlight = i % 2 === 1;
              return (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-zinc-200",
                    highlight ? styles.rowHighlight : "bg-white"
                  )}
                >
                  <td className="px-3 py-3 align-top">
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
                  <td className="px-2 py-3 text-center align-top">
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
                  <td className="px-2 py-3 align-top">
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
                  <td className="px-2 py-3 align-top">
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
                      <span className="text-xs text-zinc-500">%</span>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-right align-top tabular-nums font-medium text-zinc-900">
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
          className="inline-flex items-center gap-1.5 rounded-md border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-medium text-zinc-900 hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8502D] focus-visible:ring-offset-2"
        >
          <Plus className="size-3.5 text-[#E8502D]" aria-hidden />
          Add line
        </button>
        {lines.length > 1 ? (
          <button
            type="button"
            onClick={onRemoveLastLine}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8502D]"
          >
            <Trash2 className="size-3.5" aria-hidden />
            Remove last line
          </button>
        ) : null}
      </div>
    </section>
  );
}
