import { cn } from "@/lib/utils/cn";

const PURPLE = "#6b6ba3";

const FIELD_RIGHT =
  "w-full min-w-0 border-0 border-b border-transparent bg-transparent py-0.5 text-sm text-zinc-900 focus:border-[#6b6ba3] focus:outline-none text-right tabular-nums";

export type InvoiceFluvo8HeaderProps = {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  poNumber: string;
  onInvoiceNumberChange: (v: string) => void;
  onInvoiceDateChange: (v: string) => void;
  onDueDateChange: (v: string) => void;
  onPoNumberChange: (v: string) => void;
};

export function InvoiceFluvo8Header({
  invoiceNumber,
  invoiceDate,
  dueDate,
  poNumber,
  onInvoiceNumberChange,
  onInvoiceDateChange,
  onDueDateChange,
  onPoNumberChange,
}: InvoiceFluvo8HeaderProps) {
  return (
    <header className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
      <h1
        className="text-4xl font-bold uppercase tracking-tight sm:text-5xl"
        style={{ color: PURPLE }}
      >
        INVOICE
      </h1>
      <dl className="grid w-full max-w-xs grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm sm:text-right">
        <dt className="font-bold text-zinc-900">INVOICE #:</dt>
        <dd>
          <input
            className={cn(FIELD_RIGHT, "sm:text-right")}
            value={invoiceNumber}
            onChange={(e) => onInvoiceNumberChange(e.target.value)}
            aria-label="Invoice number"
            placeholder="—"
          />
        </dd>
        <dt className="font-bold text-zinc-900">DATE:</dt>
        <dd>
          <input
            className={cn(FIELD_RIGHT, "sm:text-right")}
            value={invoiceDate}
            onChange={(e) => onInvoiceDateChange(e.target.value)}
            aria-label="Invoice date"
          />
        </dd>
        <dt className="font-bold text-zinc-900">DUE DATE:</dt>
        <dd>
          <input
            className={cn(FIELD_RIGHT, "sm:text-right")}
            value={dueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
            aria-label="Due date"
          />
        </dd>
        <dt className="font-bold text-zinc-900">P.O. #:</dt>
        <dd>
          <input
            className={cn(FIELD_RIGHT, "sm:text-right")}
            value={poNumber}
            onChange={(e) => onPoNumberChange(e.target.value)}
            aria-label="Purchase order number"
          />
        </dd>
      </dl>
    </header>
  );
}
