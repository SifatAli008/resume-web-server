"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { formatBdt } from "@/features/invoices/lib/format-bdt";
import { useInvoiceDraft } from "@/features/invoices/hooks/useInvoiceDraft";
import { lineAmount } from "@/features/invoices/templates/invoice_fluvo_1/invoice-fluvo-1-calculations";
import { InvoiceFluvo1Signature } from "@/features/invoices/templates/invoice_fluvo_1/invoice-fluvo-1-signature";
import styles from "@/features/invoices/templates/invoice_fluvo_1/invoice-fluvo-1.module.css";
import { cn } from "@/lib/utils/cn";

type LineRow = {
  id: string;
  description: string;
  qty: string;
  price: string;
  taxPercent: string;
};

function parseNum(s: string): number {
  const n = parseFloat(String(s).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function newLine(partial?: Partial<Omit<LineRow, "id">>): LineRow {
  return {
    id: crypto.randomUUID(),
    description: partial?.description ?? "",
    qty: partial?.qty ?? "1",
    price: partial?.price ?? "0",
    taxPercent: partial?.taxPercent ?? "10",
  };
}

const FIELD =
  "w-full min-w-0 border-0 border-b border-transparent bg-transparent py-0.5 text-sm text-black placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none";
const FIELD_RIGHT = `${FIELD} text-right tabular-nums`;

export function InvoiceFluvo1Template() {
  const draft = useInvoiceDraft();
  const { items = [], company = {}, client = {} } = draft;

  const [invoiceNumber, setInvoiceNumber] = useState(
    () => draft.invoice_number ?? ""
  );
  const [invoiceDate, setInvoiceDate] = useState(
    () => draft.invoice_date ?? ""
  );
  const [dueDate, setDueDate] = useState(() => draft.due_date ?? "");
  const [poNumber, setPoNumber] = useState(() => draft.po_number ?? "");

  const [fromName, setFromName] = useState(() => company.name ?? "");
  const [fromAddress, setFromAddress] = useState(() =>
    [company.address, company.address_line2].filter(Boolean).join(", ")
  );
  const [fromPhone, setFromPhone] = useState(() => company.phone ?? "");
  const [fromEmail, setFromEmail] = useState(() => company.email ?? "");

  const [billName, setBillName] = useState(() => client.name ?? "");
  const [billAddress, setBillAddress] = useState(() =>
    [client.address, client.address_line2].filter(Boolean).join(", ")
  );
  const [billPhone, setBillPhone] = useState(() => client.phone ?? "");
  const [billEmail, setBillEmail] = useState(() => client.email ?? "");

  const [lines, setLines] = useState<LineRow[]>(() =>
    items.map((item) =>
      newLine({
        description: item.description ?? "",
        qty: String(item.quantity ?? 0),
        price: String(item.rate ?? 0),
        taxPercent: String(draft.tax_percent ?? 0),
      })
    )
  );

  const [discount, setDiscount] = useState(() =>
    String(draft.discount ?? 0)
  );
  const [invoiceTaxPercent, setInvoiceTaxPercent] = useState(() =>
    String(draft.tax_percent ?? 0)
  );

  const [payHolder, setPayHolder] = useState(() => company.name ?? "");
  const [payCard, setPayCard] = useState("3461546793621567");
  const [payZip, setPayZip] = useState("90026");

  const [terms, setTerms] = useState(() => draft.terms ?? "");

  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
    const it = draft.items ?? [];
    const co = draft.company ?? {};
    const cl = draft.client ?? {};

    setInvoiceNumber(draft.invoice_number ?? "");
    setInvoiceDate(draft.invoice_date ?? "");
    setDueDate(draft.due_date ?? "");
    setPoNumber(draft.po_number ?? "");

    setFromName(co.name ?? "");
    setFromAddress(
      [co.address, co.address_line2].filter(Boolean).join(", ")
    );
    setFromPhone(co.phone ?? "");
    setFromEmail(co.email ?? "");

    setBillName(cl.name ?? "");
    setBillAddress(
      [cl.address, cl.address_line2].filter(Boolean).join(", ")
    );
    setBillPhone(cl.phone ?? "");
    setBillEmail(cl.email ?? "");

    setLines(
      it.map((item) =>
        newLine({
          description: item.description ?? "",
          qty: String(item.quantity ?? 0),
          price: String(item.rate ?? 0),
          taxPercent: String(draft.tax_percent ?? 0),
        })
      )
    );

    setDiscount(String(draft.discount ?? 0));
    setInvoiceTaxPercent(String(draft.tax_percent ?? 0));
    setTerms(draft.terms ?? "");
    setPayHolder(co.name ?? "");

    const sig = draft.signature?.trim();
    setSignatureUrl(sig ? sig : null);
    });
  }, [draft]);

  useEffect(() => {
    return () => {
      if (signatureUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(signatureUrl);
      }
    };
  }, [signatureUrl]);

  const numericLines = useMemo(
    () =>
      lines.map((row) => ({
        qty: parseNum(row.qty),
        price: parseNum(row.price),
        taxPercent: parseNum(row.taxPercent),
      })),
    [lines]
  );

  const subtotal = useMemo(
    () =>
      lines.reduce(
        (s, row) => s + parseNum(row.qty) * parseNum(row.price),
        0
      ),
    [lines]
  );
  const discountAmount = parseNum(discount);
  const taxRate = parseNum(invoiceTaxPercent) / 100;
  const taxAmount = (subtotal - discountAmount) * taxRate;
  const total = subtotal - discountAmount + taxAmount;

  const showPaymentDraft =
    Boolean(draft.payment_method?.trim()) ||
    Boolean(draft.payment_instructions?.trim());
  const showTerms = Boolean(terms.trim());
  const showSignature = Boolean(draft.signature?.trim() || signatureUrl);

  function updateLine(
    id: string,
    patch: Partial<Pick<LineRow, "description" | "qty" | "price" | "taxPercent">>
  ) {
    setLines((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...patch } : row))
    );
  }

  function addLine() {
    setLines((prev) => [...prev, newLine()]);
  }

  function removeLine(id: string) {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((r) => r.id !== id)));
  }

  function onDiscountInput(e: ChangeEvent<HTMLInputElement>) {
    let v = e.target.value;
    if (v.startsWith("-")) v = v.slice(1);
    setDiscount(v);
  }

  return (
    <div
      className={cn(
        styles.paper,
        "mx-auto max-w-4xl border-2 border-blue-500 bg-white p-8 text-black shadow-sm print:shadow-none"
      )}
    >
      {/* Header */}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
          INVOICE
        </h1>
        <dl className="grid w-full max-w-xs grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm sm:text-right">
          <dt className="font-bold text-black">INVOICE #</dt>
          <dd>
            <input
              className={cn(FIELD_RIGHT, "sm:text-right")}
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              aria-label="Invoice number"
            />
          </dd>
          <dt className="font-bold text-black">DATE</dt>
          <dd>
            <input
              className={cn(FIELD_RIGHT, "sm:text-right")}
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              aria-label="Invoice date"
            />
          </dd>
          <dt className="font-bold text-black">DUE DATE</dt>
          <dd>
            <input
              className={cn(FIELD_RIGHT, "sm:text-right")}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              aria-label="Due date"
            />
          </dd>
          <dt className="font-bold text-black">P.O. #</dt>
          <dd>
            <input
              className={cn(FIELD_RIGHT, "sm:text-right")}
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              aria-label="Purchase order number"
            />
          </dd>
        </dl>
      </header>

      <div className={cn("my-6", styles.thinRule)} />

      {/* Addresses */}
      <section className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-1 text-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-black">
            From
          </p>
          <input
            className={cn(FIELD, "font-bold")}
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
            aria-label="Sender name"
          />
          <input
            className={FIELD}
            value={fromAddress}
            onChange={(e) => setFromAddress(e.target.value)}
            aria-label="Sender address"
          />
          <input
            className={FIELD}
            value={fromPhone}
            onChange={(e) => setFromPhone(e.target.value)}
            aria-label="Sender phone"
          />
          <input
            className={FIELD}
            value={fromEmail}
            onChange={(e) => setFromEmail(e.target.value)}
            aria-label="Sender email"
          />
        </div>
        <div className="space-y-1 text-sm">
          <p className="text-xs font-bold text-black">Bill To</p>
          <input
            className={cn(FIELD, "font-bold")}
            value={billName}
            onChange={(e) => setBillName(e.target.value)}
            aria-label="Bill to name"
          />
          <input
            className={FIELD}
            value={billAddress}
            onChange={(e) => setBillAddress(e.target.value)}
            aria-label="Bill to address"
          />
          <input
            className={FIELD}
            value={billPhone}
            onChange={(e) => setBillPhone(e.target.value)}
            aria-label="Bill to phone"
          />
          <input
            className={FIELD}
            value={billEmail}
            onChange={(e) => setBillEmail(e.target.value)}
            aria-label="Bill to email"
          />
        </div>
      </section>

      <div className={cn("my-6", styles.thinRule)} />

      {/* Line items */}
      <section className="space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className={cn("text-left text-black", styles.tableHeader)}>
                <th className="pb-2 pr-2 font-bold">Description</th>
                <th className="w-20 pb-2 pr-2 text-right font-bold">QTY</th>
                <th className="w-28 pb-2 pr-2 text-right font-bold">Price</th>
                <th className="w-24 pb-2 pr-2 text-right font-bold">Tax</th>
                <th className="w-32 pb-2 text-right font-bold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((row, i) => {
                const numeric = numericLines[i]!;
                const amt = lineAmount(numeric);
                return (
                  <tr key={row.id} className={styles.tableRow}>
                    <td className="py-2 pr-2 align-top">
                      <input
                        className={FIELD}
                        value={row.description}
                        onChange={(e) =>
                          updateLine(row.id, { description: e.target.value })
                        }
                        aria-label={`Line ${i + 1} description`}
                      />
                    </td>
                    <td className="py-2 pr-2 align-top">
                      <input
                        className={FIELD_RIGHT}
                        value={row.qty}
                        onChange={(e) =>
                          updateLine(row.id, { qty: e.target.value })
                        }
                        inputMode="decimal"
                        aria-label={`Line ${i + 1} quantity`}
                      />
                    </td>
                    <td className="py-2 pr-2 align-top">
                      <input
                        className={FIELD_RIGHT}
                        value={row.price}
                        onChange={(e) =>
                          updateLine(row.id, { price: e.target.value })
                        }
                        inputMode="decimal"
                        aria-label={`Line ${i + 1} price`}
                      />
                    </td>
                    <td className="py-2 pr-2 align-top">
                      <div className="flex items-center justify-end gap-0.5">
                        <input
                          className={cn(FIELD_RIGHT, "max-w-[3.5rem]")}
                          value={row.taxPercent}
                          onChange={(e) =>
                            updateLine(row.id, { taxPercent: e.target.value })
                          }
                          inputMode="decimal"
                          aria-label={`Line ${i + 1} tax percent`}
                        />
                        <span className="text-zinc-500">%</span>
                      </div>
                    </td>
                    <td className="py-2 text-right align-top tabular-nums text-black">
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
            onClick={addLine}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-black hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Plus className="size-3.5 text-blue-500" aria-hidden />
            Add line
          </button>
          {lines.length > 1 ? (
            <button
              type="button"
              onClick={() => removeLine(lines[lines.length - 1]!.id)}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Trash2 className="size-3.5" aria-hidden />
              Remove last line
            </button>
          ) : null}
        </div>
      </section>

      {/* Totals */}
      <div className="mt-8 flex justify-end">
        <div className="w-full max-w-xs space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <span className="font-bold text-black">Subtotal</span>
            <span className="tabular-nums text-black">{formatBdt(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-bold text-black">Discount</span>
            <span className="inline-flex items-center gap-0.5 tabular-nums text-black">
              <span aria-hidden>-</span>
              <input
                className={cn(FIELD_RIGHT, "max-w-[7rem]")}
                value={discount}
                onChange={onDiscountInput}
                inputMode="decimal"
                aria-label="Discount amount"
              />
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-bold text-black">
              Tax (
              <input
                className="inline-block w-10 border-0 border-b border-transparent bg-transparent text-right font-bold focus:border-blue-500 focus:outline-none"
                value={invoiceTaxPercent}
                onChange={(e) => setInvoiceTaxPercent(e.target.value)}
                inputMode="decimal"
                aria-label="Invoice tax percent"
              />
              %)
            </span>
            <span className="tabular-nums text-black">
              {formatBdt(taxAmount)}
            </span>
          </div>

          <div className={cn("my-2", styles.totalsRule)} />

          <div className="flex justify-between gap-4 text-base font-bold text-black">
            <span>TOTAL</span>
            <span className="tabular-nums">{formatBdt(total)}</span>
          </div>

          <div className={cn("mt-2", styles.thinRule)} />
        </div>
      </div>

      {/* Payment + signature */}
      <section className="mt-10 grid gap-10 sm:grid-cols-2">
        <div className="space-y-2 text-sm">
          {draft.payment_method?.trim() ? (
            <>
              <p className="font-bold text-black">Payment Method</p>
              <p className="text-zinc-600">{draft.payment_method}</p>
            </>
          ) : null}
          {draft.payment_instructions?.trim() ? (
            <p className="text-zinc-600 whitespace-pre-wrap">
              {draft.payment_instructions}
            </p>
          ) : null}
          {!showPaymentDraft ? (
            <>
              <p className="font-bold text-black">Payment Method</p>
              <p className="text-zinc-600">
                <span className="font-medium text-black">Holder Name</span>{" "}
                <input
                  className={cn(FIELD, "inline-block min-w-[8rem]")}
                  value={payHolder}
                  onChange={(e) => setPayHolder(e.target.value)}
                  aria-label="Card holder name"
                />
              </p>
              <p className="text-zinc-600">
                <span className="font-medium text-black">Card Number</span>{" "}
                <input
                  className={cn(FIELD, "inline-block min-w-[10rem] tracking-wide")}
                  value={payCard}
                  onChange={(e) => setPayCard(e.target.value)}
                  aria-label="Card number"
                />
              </p>
              <p className="text-zinc-600">
                <span className="font-medium text-black">ZIP Code</span>{" "}
                <input
                  className={cn(FIELD, "inline-block w-24")}
                  value={payZip}
                  onChange={(e) => setPayZip(e.target.value)}
                  aria-label="ZIP code"
                />
              </p>
            </>
          ) : null}
        </div>

        {showSignature ? (
          <InvoiceFluvo1Signature
            imageUrl={signatureUrl}
            onImageUrlChange={setSignatureUrl}
          />
        ) : null}
      </section>

      {/* Terms */}
      {showTerms ? (
        <footer className="mt-10 border-t border-zinc-200 pt-6 text-sm">
          <p className="font-bold text-black">Terms &amp; Conditions</p>
          <textarea
            className="mt-2 min-h-[4rem] w-full resize-y border-0 bg-transparent text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded-sm"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            aria-label="Terms and conditions"
          />
        </footer>
      ) : null}
    </div>
  );
}
