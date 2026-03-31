import { cn } from "@/lib/utils/cn";

const FIELD_RIGHT =
  "w-full min-w-0 border-0 border-b border-transparent bg-transparent py-0.5 text-sm text-zinc-800 focus:border-blue-600 focus:outline-none text-right tabular-nums";

export type InvoiceFluvo5HeaderProps = {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  poNumber: string;
  onInvoiceNumberChange: (v: string) => void;
  onInvoiceDateChange: (v: string) => void;
  onDueDateChange: (v: string) => void;
  onPoNumberChange: (v: string) => void;
};

export function InvoiceFluvo5Header({
  invoiceNumber,
  invoiceDate,
  dueDate,
  poNumber,
  onInvoiceNumberChange,
  onInvoiceDateChange,
  onDueDateChange,
  onPoNumberChange,
}: InvoiceFluvo5HeaderProps) {
  return (
    <header className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center pt-0.5" aria-hidden>
          <div className="relative h-4 w-7 shrink-0">
            <span className="absolute left-0 top-0.5 size-3 rounded-full bg-red-500 ring-2 ring-white" />
            <span className="absolute left-2 top-0 size-3 rounded-full bg-blue-600 ring-2 ring-white" />
          </div>
          <div className="mt-1 h-14 w-1 rounded-full bg-blue-600" />
        </div>
        <h1 className="text-4xl font-bold uppercase tracking-tight text-blue-600 lg:text-5xl">
          INVOICE
        </h1>
      </div>

      <div className="flex w-full flex-col items-stretch gap-3 sm:items-end lg:max-w-sm">
        <div
          className="relative z-[2] h-9 w-9 shrink-0 rotate-45 self-end bg-amber-400 shadow-sm ring-2 ring-amber-200/80"
          role="img"
          aria-label="Logo placeholder"
        />
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
      </div>
    </header>
  );
}
