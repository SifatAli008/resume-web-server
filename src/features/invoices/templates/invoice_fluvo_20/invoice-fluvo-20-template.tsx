"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Press_Start_2P } from "next/font/google";
import { Plus, Trash2 } from "lucide-react";
import { formatBdt } from "@/features/invoices/lib/format-bdt";
import {
  invoiceTaxAmount,
  invoiceTotal,
  lineAmount,
  sumLineAmounts,
} from "@/features/invoices/templates/invoice_fluvo_2/invoice-fluvo-2-calculations";
import { InvoiceFluvo20Signature } from "@/features/invoices/templates/invoice_fluvo_20/invoice-fluvo-20-signature";
import styles from "@/features/invoices/templates/invoice_fluvo_20/invoice-fluvo-20.module.css";
import { cn } from "@/lib/utils/cn";

const legoTitle = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

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
  "w-full min-w-0 border-0 border-b border-neutral-200 bg-transparent py-1 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none";
const FIELD_RIGHT = `${FIELD} text-right tabular-nums`;

export function InvoiceFluvo20Template() {
  const [invoiceNumber, setInvoiceNumber] = useState("INV00001");
  const [invoiceDate, setInvoiceDate] = useState("2026/03/28");
  const [dueDate, setDueDate] = useState("2026/04/04");
  const [poNumber, setPoNumber] = useState("PO-2025-1031-AZ");

  const [fromName, setFromName] = useState("Amy Clark");
  const [fromAddress, setFromAddress] = useState(
    "12857 W Main St, Glendale, AZ"
  );
  const [fromPhone, setFromPhone] = useState("(623) 555-4789");
  const [fromEmail, setFromEmail] = useState("amy@jacksautorepair.com");

  const [billName, setBillName] = useState("Sunrise Landscaping LLC");
  const [billAddress, setBillAddress] = useState(
    "742 Evergreen Industrial Rd."
  );
  const [billPhone, setBillPhone] = useState("(602) 555-2934");
  const [billEmail, setBillEmail] = useState("az@sunriselandscaping.com");

  const [lines, setLines] = useState<LineRow[]>([
    newLine({
      description: "Plumbing Service",
      qty: "1",
      price: "380.00",
      taxPercent: "10",
    }),
    newLine({
      description: "Carpentry Work",
      qty: "3",
      price: "100.00",
      taxPercent: "10",
    }),
    newLine({
      description: "Roof Repair",
      qty: "2",
      price: "362.00",
      taxPercent: "10",
    }),
  ]);

  const [discount, setDiscount] = useState("154.44");
  const [invoiceTaxPercent, setInvoiceTaxPercent] = useState("5");

  const [payHolder, setPayHolder] = useState("Amy Clark");
  const [payCard, setPayCard] = useState("3461546793621567");
  const [payZip, setPayZip] = useState("90026");

  const [terms, setTerms] = useState(
    "The payment must be received within 7 days. Late payments may incur a 1.5% monthly late fee."
  );

  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);

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

  const subtotal = useMemo(() => sumLineAmounts(numericLines), [numericLines]);
  const discountNum = parseNum(discount);
  const taxPctNum = parseNum(invoiceTaxPercent);
  const taxAmount = invoiceTaxAmount(subtotal, discountNum, taxPctNum);
  const total = invoiceTotal(subtotal, discountNum, taxPctNum);

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
    setLines((prev) =>
      prev.length <= 1 ? prev : prev.filter((r) => r.id !== id)
    );
  }

  function onDiscountInput(e: ChangeEvent<HTMLInputElement>) {
    let v = e.target.value;
    if (v.startsWith("-")) v = v.slice(1);
    setDiscount(v);
  }

  return (
    <div className="mx-auto max-w-4xl bg-neutral-100 px-4 py-8 text-neutral-900 print:bg-white print:py-0">
      <div className="border-2 border-neutral-900 bg-white px-6 py-8 shadow-sm print:border-neutral-900 print:shadow-none sm:px-10 sm:py-10">
        <header className="flex flex-col gap-8 border-b border-neutral-200 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1
              className={cn(
                legoTitle.className,
                styles.pixelCrisp,
                "text-lg tracking-wide text-neutral-900 sm:text-xl"
              )}
            >
              INVOICE
            </h1>
            <div className="mt-2 h-1 w-16 bg-[#ffd500]" aria-hidden />
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm sm:text-right">
            <dt className="text-neutral-500">Invoice #</dt>
            <dd>
              <input
                className={cn(FIELD_RIGHT, "sm:text-right")}
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                aria-label="Invoice number"
              />
            </dd>
            <dt className="text-neutral-500">Date</dt>
            <dd>
              <input
                className={cn(FIELD_RIGHT, "sm:text-right")}
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                aria-label="Invoice date"
              />
            </dd>
            <dt className="text-neutral-500">Due</dt>
            <dd>
              <input
                className={cn(FIELD_RIGHT, "sm:text-right")}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                aria-label="Due date"
              />
            </dd>
            <dt className="text-neutral-500">P.O.</dt>
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

        <section className="mt-10 grid gap-10 sm:grid-cols-2">
          <div className="space-y-2 text-sm">
            <p className="text-xs font-medium text-neutral-500">From</p>
            <input
              className={cn(FIELD, "font-medium text-neutral-900")}
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
          <div className="space-y-2 text-sm">
            <p className="text-xs font-medium text-neutral-500">Bill to</p>
            <input
              className={cn(FIELD, "font-medium text-neutral-900")}
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

        <section className="mt-10 space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse border border-neutral-900 text-sm">
              <thead>
                <tr className="bg-neutral-900 text-left text-xs font-medium uppercase tracking-wide text-[#ffd500]">
                  <th className="border-b border-neutral-900 px-3 py-3">
                    Description
                  </th>
                  <th className="w-16 border-b border-neutral-900 px-2 py-3 text-center">
                    Qty
                  </th>
                  <th className="w-28 border-b border-neutral-900 px-2 py-3 text-right">
                    Price
                  </th>
                  <th className="w-24 border-b border-neutral-900 px-2 py-3 text-right">
                    Tax
                  </th>
                  <th className="w-32 border-b border-neutral-900 px-2 py-3 text-right">
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
                      className={cn(
                        stripe ? "bg-neutral-50" : "bg-white",
                        "text-neutral-800"
                      )}
                    >
                      <td className="border-t border-neutral-200 px-3 py-2 align-top">
                        <input
                          className={FIELD}
                          value={row.description}
                          onChange={(e) =>
                            updateLine(row.id, { description: e.target.value })
                          }
                          aria-label={`Line ${i + 1} description`}
                        />
                      </td>
                      <td className="border-t border-neutral-200 px-2 py-2 text-center align-top">
                        <input
                          className={cn(FIELD, "text-center tabular-nums")}
                          value={row.qty}
                          onChange={(e) =>
                            updateLine(row.id, { qty: e.target.value })
                          }
                          inputMode="decimal"
                          aria-label={`Line ${i + 1} quantity`}
                        />
                      </td>
                      <td className="border-t border-neutral-200 px-2 py-2 align-top">
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
                      <td className="border-t border-neutral-200 px-2 py-2 align-top">
                        <div className="flex items-center justify-end gap-0.5">
                          <input
                            className={cn(FIELD_RIGHT, "max-w-13")}
                            value={row.taxPercent}
                            onChange={(e) =>
                              updateLine(row.id, { taxPercent: e.target.value })
                            }
                            inputMode="decimal"
                            aria-label={`Line ${i + 1} tax percent`}
                          />
                          <span className="text-xs text-neutral-400">%</span>
                        </div>
                      </td>
                      <td className="border-t border-neutral-200 px-3 py-2 text-right align-top tabular-nums font-medium text-neutral-900">
                        {formatBdt(amt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={addLine}
              className="inline-flex items-center gap-1.5 border border-neutral-900 bg-[#ffd500] px-3 py-1.5 text-xs font-medium text-neutral-900 hover:bg-[#ffe566]"
            >
              <Plus className="size-3.5" aria-hidden />
              Add line
            </button>
            {lines.length > 1 ? (
              <button
                type="button"
                onClick={() => removeLine(lines[lines.length - 1]!.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900"
              >
                <Trash2 className="size-3.5" aria-hidden />
                Remove last
              </button>
            ) : null}
          </div>
        </section>

        <div className="mt-10 flex justify-end">
          <div className="w-full max-w-xs space-y-0 text-sm">
            <div className="flex justify-between gap-4 border-b border-neutral-200 py-2.5">
              <span className="text-neutral-600">Subtotal</span>
              <span className="tabular-nums text-neutral-900">
                {formatBdt(subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-neutral-200 py-2.5">
              <span className="text-neutral-600">Discount</span>
              <span className="inline-flex items-center gap-0.5 tabular-nums text-neutral-900">
                <span aria-hidden>−৳</span>
                <input
                  className={cn(FIELD_RIGHT, "max-w-26")}
                  value={discount}
                  onChange={onDiscountInput}
                  inputMode="decimal"
                  aria-label="Discount amount"
                />
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-neutral-200 py-2.5">
              <span className="text-neutral-600">
                Tax (
                <input
                  className="inline-block w-9 border-0 border-b border-transparent bg-transparent text-right font-medium focus:border-neutral-900 focus:outline-none"
                  value={invoiceTaxPercent}
                  onChange={(e) => setInvoiceTaxPercent(e.target.value)}
                  inputMode="decimal"
                  aria-label="Invoice tax percent"
                />
                %)
              </span>
              <span className="tabular-nums text-neutral-900">
                {formatBdt(taxAmount)}
              </span>
            </div>
            <div className="mt-3 flex justify-between gap-4 border-2 border-neutral-900 bg-[#ffd500] px-4 py-3 text-base font-semibold text-neutral-900 tabular-nums">
              <span>Total</span>
              <span>{formatBdt(total)}</span>
            </div>
          </div>
        </div>

        <section className="mt-14 grid gap-12 border-t border-neutral-200 pt-12 lg:grid-cols-2 lg:items-start">
          <div className="flex min-w-0 flex-col gap-10">
            <div className="space-y-2 text-sm">
              <p className="text-xs font-medium text-neutral-500">Payment</p>
              <p className="text-neutral-600">
                <span className="text-neutral-800">Holder</span>{" "}
                <input
                  className={cn(FIELD, "inline-block min-w-32")}
                  value={payHolder}
                  onChange={(e) => setPayHolder(e.target.value)}
                  aria-label="Card holder name"
                />
              </p>
              <p className="text-neutral-600">
                <span className="text-neutral-800">Card</span>{" "}
                <input
                  className={cn(FIELD, "inline-block min-w-40 font-mono text-xs")}
                  value={payCard}
                  onChange={(e) => setPayCard(e.target.value)}
                  aria-label="Card number"
                />
              </p>
              <p className="text-neutral-600">
                <span className="text-neutral-800">ZIP</span>{" "}
                <input
                  className={cn(FIELD, "inline-block w-24")}
                  value={payZip}
                  onChange={(e) => setPayZip(e.target.value)}
                  aria-label="ZIP code"
                />
              </p>
            </div>

            <footer className="text-sm">
              <p className="text-xs font-medium text-neutral-500">Terms</p>
              <textarea
                className="mt-2 min-h-20 w-full resize-y border-0 bg-transparent text-xs leading-relaxed text-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                aria-label="Terms and conditions"
              />
            </footer>
          </div>

          <InvoiceFluvo20Signature
            imageUrl={signatureUrl}
            onImageUrlChange={setSignatureUrl}
            className="lg:min-h-[260px]"
          />
        </section>
      </div>
    </div>
  );
}
