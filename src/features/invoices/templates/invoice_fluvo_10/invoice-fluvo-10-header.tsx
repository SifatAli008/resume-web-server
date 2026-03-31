import { cn } from "@/lib/utils/cn";
import styles from "@/features/invoices/templates/invoice_fluvo_10/invoice-fluvo-10.module.css";

const FIELD_RIGHT =
  "w-full min-w-0 border-0 border-b border-white/35 bg-transparent py-0.5 text-sm text-white placeholder:text-white/45 focus:border-white focus:outline-none text-right tabular-nums";

export type InvoiceFluvo10HeaderProps = {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  poNumber: string;
  onInvoiceNumberChange: (v: string) => void;
  onInvoiceDateChange: (v: string) => void;
  onDueDateChange: (v: string) => void;
  onPoNumberChange: (v: string) => void;
};

export function InvoiceFluvo10Header({
  invoiceNumber,
  invoiceDate,
  dueDate,
  poNumber,
  onInvoiceNumberChange,
  onInvoiceDateChange,
  onDueDateChange,
  onPoNumberChange,
}: InvoiceFluvo10HeaderProps) {
  return (
    <header
      className={cn(
        styles.orange,
        "rounded-t-xl px-8 pb-8 pt-8 text-white sm:px-10 sm:pb-10 sm:pt-10"
      )}
    >
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
          INVOICE
        </h1>
        <dl className="grid w-full max-w-xs grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm sm:text-right">
          <dt className="font-bold text-white">INVOICE #</dt>
          <dd>
            <input
              className={cn(FIELD_RIGHT, "sm:text-right")}
              value={invoiceNumber}
              onChange={(e) => onInvoiceNumberChange(e.target.value)}
              aria-label="Invoice number"
            />
          </dd>
          <dt className="font-bold text-white">DATE</dt>
          <dd>
            <input
              className={cn(FIELD_RIGHT, "sm:text-right")}
              value={invoiceDate}
              onChange={(e) => onInvoiceDateChange(e.target.value)}
              aria-label="Invoice date"
            />
          </dd>
          <dt className="font-bold text-white">DUE DATE</dt>
          <dd>
            <input
              className={cn(FIELD_RIGHT, "sm:text-right")}
              value={dueDate}
              onChange={(e) => onDueDateChange(e.target.value)}
              aria-label="Due date"
            />
          </dd>
          <dt className="font-bold text-white">P.O. #</dt>
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
    </header>
  );
}
