import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import styles from "@/features/invoices/templates/invoice_fluvo_6/invoice-fluvo-6.module.css";

const FIELD_RIGHT =
  "w-full min-w-0 border-0 border-b border-transparent bg-transparent py-0.5 text-sm text-[#232323] focus:border-[#f39200] focus:outline-none text-right tabular-nums";

export type InvoiceFluvo6HeaderProps = {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  poNumber: string;
  onInvoiceNumberChange: (v: string) => void;
  onInvoiceDateChange: (v: string) => void;
  onDueDateChange: (v: string) => void;
  onPoNumberChange: (v: string) => void;
};

export function InvoiceFluvo6Header({
  invoiceNumber,
  invoiceDate,
  dueDate,
  poNumber,
  onInvoiceNumberChange,
  onInvoiceDateChange,
  onDueDateChange,
  onPoNumberChange,
}: InvoiceFluvo6HeaderProps) {
  return (
    <div className={styles.headerOuter}>
      <div className={styles.cornerBadge} aria-hidden>
        <div className="flex size-9 items-center justify-center rounded-full bg-white shadow-md">
          <Check
            className="size-5 stroke-[2.5]"
            style={{ color: "#f39200" }}
            aria-hidden
          />
        </div>
      </div>

      <div className={styles.headerRow}>
        <div className={styles.trapBlack}>
          <h1
            className="text-3xl font-bold uppercase tracking-tight sm:text-4xl"
            style={{ color: "#f39200" }}
          >
            INVOICE
          </h1>
        </div>
        <div className={styles.metaArea}>
          <dl className="grid w-full max-w-xs grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm sm:text-right">
            <dt className="font-bold text-[#232323]">INVOICE #</dt>
            <dd>
              <input
                className={cn(FIELD_RIGHT, "sm:text-right")}
                value={invoiceNumber}
                onChange={(e) => onInvoiceNumberChange(e.target.value)}
                aria-label="Invoice number"
                placeholder="—"
              />
            </dd>
            <dt className="font-bold text-[#232323]">DATE</dt>
            <dd>
              <input
                className={cn(FIELD_RIGHT, "sm:text-right")}
                value={invoiceDate}
                onChange={(e) => onInvoiceDateChange(e.target.value)}
                aria-label="Invoice date"
              />
            </dd>
            <dt className="font-bold text-[#232323]">DUE DATE</dt>
            <dd>
              <input
                className={cn(FIELD_RIGHT, "sm:text-right")}
                value={dueDate}
                onChange={(e) => onDueDateChange(e.target.value)}
                aria-label="Due date"
              />
            </dd>
            <dt className="font-bold text-[#232323]">P.O. #</dt>
            <dd>
              <input
                className={cn(FIELD_RIGHT, "sm:text-right")}
                value={poNumber}
                onChange={(e) => onPoNumberChange(e.target.value)}
                aria-label="Purchase order number"
              />
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
