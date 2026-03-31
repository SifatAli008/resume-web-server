import { cn } from "@/lib/utils/cn";

const FIELD =
  "w-full min-w-0 border-0 border-b border-transparent bg-transparent py-0.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-blue-600 focus:outline-none";

export type InvoiceFluvo5BillingInfoProps = {
  fromName: string;
  fromAddress: string;
  fromPhone: string;
  fromEmail: string;
  billName: string;
  billAddress: string;
  billPhone: string;
  billEmail: string;
  onFromNameChange: (v: string) => void;
  onFromAddressChange: (v: string) => void;
  onFromPhoneChange: (v: string) => void;
  onFromEmailChange: (v: string) => void;
  onBillNameChange: (v: string) => void;
  onBillAddressChange: (v: string) => void;
  onBillPhoneChange: (v: string) => void;
  onBillEmailChange: (v: string) => void;
};

export function InvoiceFluvo5BillingInfo({
  fromName,
  fromAddress,
  fromPhone,
  fromEmail,
  billName,
  billAddress,
  billPhone,
  billEmail,
  onFromNameChange,
  onFromAddressChange,
  onFromPhoneChange,
  onFromEmailChange,
  onBillNameChange,
  onBillAddressChange,
  onBillPhoneChange,
  onBillEmailChange,
}: InvoiceFluvo5BillingInfoProps) {
  return (
    <section className="grid gap-10 sm:grid-cols-2">
      <div className="space-y-1.5 text-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-zinc-900">
          From
        </p>
        <input
          className={cn(FIELD, "font-bold text-zinc-900")}
          value={fromName}
          onChange={(e) => onFromNameChange(e.target.value)}
          aria-label="Sender name"
        />
        <input
          className={FIELD}
          value={fromAddress}
          onChange={(e) => onFromAddressChange(e.target.value)}
          aria-label="Sender address"
        />
        <input
          className={FIELD}
          value={fromPhone}
          onChange={(e) => onFromPhoneChange(e.target.value)}
          aria-label="Sender phone"
        />
        <input
          className={FIELD}
          value={fromEmail}
          onChange={(e) => onFromEmailChange(e.target.value)}
          aria-label="Sender email"
        />
      </div>
      <div className="space-y-1.5 text-sm">
        <p className="text-xs font-bold text-zinc-900">Bill To</p>
        <input
          className={cn(FIELD, "font-bold text-zinc-900")}
          value={billName}
          onChange={(e) => onBillNameChange(e.target.value)}
          aria-label="Bill to name"
        />
        <input
          className={FIELD}
          value={billAddress}
          onChange={(e) => onBillAddressChange(e.target.value)}
          aria-label="Bill to address"
        />
        <input
          className={FIELD}
          value={billPhone}
          onChange={(e) => onBillPhoneChange(e.target.value)}
          aria-label="Bill to phone"
        />
        <input
          className={FIELD}
          value={billEmail}
          onChange={(e) => onBillEmailChange(e.target.value)}
          aria-label="Bill to email"
        />
      </div>
    </section>
  );
}
