import { cn } from "@/lib/utils/cn";
import styles from "@/features/invoices/templates/invoice_fluvo_7/invoice-fluvo-7.module.css";

const FIELD_RIGHT =
  "w-full min-w-0 border-0 border-b border-transparent bg-transparent py-0.5 text-sm text-zinc-900 focus:border-cyan-500 focus:outline-none text-right tabular-nums";

export type InvoiceFluvo7HeaderProps = {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  poNumber: string;
  onInvoiceNumberChange: (v: string) => void;
  onInvoiceDateChange: (v: string) => void;
  onDueDateChange: (v: string) => void;
  onPoNumberChange: (v: string) => void;
};

export function InvoiceFluvo7Header({
  invoiceNumber,
  invoiceDate,
  dueDate,
  poNumber,
  onInvoiceNumberChange,
  onInvoiceDateChange,
  onDueDateChange,
  onPoNumberChange,
}: InvoiceFluvo7HeaderProps) {
  return (
    <div className={styles.headerRow}>
      <div className={styles.headerLeft}>
        <div className={styles.trapTeal}>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
            INVOICE
          </h1>
        </div>
        <div className={styles.trapCyan} aria-hidden />
      </div>

      <div className={styles.headerRight}>
        <dl className="grid w-full max-w-xs grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm sm:text-right">
          <dt className="font-bold text-[#00333d]">INVOICE #:</dt>
          <dd>
            <input
              className={cn(FIELD_RIGHT, "sm:text-right")}
              value={invoiceNumber}
              onChange={(e) => onInvoiceNumberChange(e.target.value)}
              aria-label="Invoice number"
            />
          </dd>
          <dt className="font-bold text-[#00333d]">DATE:</dt>
          <dd>
            <input
              className={cn(FIELD_RIGHT, "sm:text-right")}
              value={invoiceDate}
              onChange={(e) => onInvoiceDateChange(e.target.value)}
              aria-label="Invoice date"
            />
          </dd>
          <dt className="font-bold text-[#00333d]">DUE DATE:</dt>
          <dd>
            <input
              className={cn(FIELD_RIGHT, "sm:text-right")}
              value={dueDate}
              onChange={(e) => onDueDateChange(e.target.value)}
              aria-label="Due date"
            />
          </dd>
          <dt className="font-bold text-[#00333d]">P.O. #:</dt>
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
  );
}
