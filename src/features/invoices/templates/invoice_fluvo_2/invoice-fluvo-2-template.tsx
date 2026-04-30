"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { formatBdt } from "@/features/invoices/lib/format-bdt";
import {
  invoiceTaxAmount,
  invoiceTotal,
  lineAmount,
  sumLineAmounts,
} from "@/features/invoices/templates/invoice_fluvo_2/invoice-fluvo-2-calculations";
import { InvoiceFluvo2Signature } from "@/features/invoices/templates/invoice_fluvo_2/invoice-fluvo-2-signature";
import styles from "@/features/invoices/templates/invoice_fluvo_2/invoice-fluvo-2.module.css";
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
  "w-full min-w-0 border-0 border-b border-transparent bg-transparent py-0.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none";
const FIELD_RIGHT = `${FIELD} text-right tabular-nums`;

export function InvoiceFluvo2Template() {
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
    <div
      className={cn(
        styles.paper,
        "mx-auto max-w-4xl bg-white px-10 py-12 text-zinc-800 shadow-sm print:shadow-none"
      )}
    >
      <header className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-4xl font-bold uppercase tracking-tight text-teal-500 sm:text-5xl">
          INVOICE
        </h1>
        <dl className="grid w-full max-w-xs grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm sm:text-right">
          <dt className="font-bold text-zinc-900">INVOICE #:</dt>
          <dd>
            <input
              className={cn(FIELD_RIGHT, "sm:text-right")}
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              aria-label="Invoice number"
            />
          </dd>
          <dt className="font-bold text-zinc-900">DATE:</dt>
          <dd>
            <input
              className={cn(FIELD_RIGHT, "sm:text-right")}
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              aria-label="Invoice date"
            />
          </dd>
          <dt className="font-bold text-zinc-900">DUE DATE:</dt>
          <dd>
            <input
              className={cn(FIELD_RIGHT, "sm:text-right")}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              aria-label="Due date"
            />
          </dd>
          <dt className="font-bold text-zinc-900">P.O. #:</dt>
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

      <div className={cn("my-8", styles.headerRule)} />

      <section className="grid gap-10 sm:grid-cols-2">
        <div className="space-y-1.5 text-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-900">
            From
          </p>
          <input
            className={cn(FIELD, "font-bold text-zinc-900")}
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
        <div className="space-y-1.5 text-sm">
          <p className="text-sm font-bold text-zinc-900">Bill To</p>
          <input
            className={cn(FIELD, "font-bold text-zinc-900")}
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

      <section className="mt-10 space-y-4">
        <div className="overflow-x-auto rounded-sm">
          <table className="w-full min-w-[560px] border-collapse border border-teal-500 text-sm">
            <thead>
              <tr className="bg-teal-500 text-white">
                <th className="border border-teal-600 px-3 py-3 text-left text-xs font-bold uppercase tracking-wide">
                  Description
                </th>
                <th className="w-20 border border-teal-600 px-2 py-3 text-center text-xs font-bold uppercase tracking-wide">
                  QTY
                </th>
                <th className="w-28 border border-teal-600 px-2 py-3 text-right text-xs font-bold uppercase tracking-wide">
                  Price
                </th>
                <th className="w-24 border border-teal-600 px-2 py-3 text-right text-xs font-bold uppercase tracking-wide">
                  Tax
                </th>
                <th className="w-32 border border-teal-600 px-2 py-3 text-right text-xs font-bold uppercase tracking-wide">
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
                      stripe ? "bg-teal-50/40" : "bg-white",
                      "text-zinc-800"
                    )}
                  >
                    <td className="border border-teal-500 p-2 align-top">
                      <input
                        className={FIELD}
                        value={row.description}
                        onChange={(e) =>
                          updateLine(row.id, { description: e.target.value })
                        }
                        aria-label={`Line ${i + 1} description`}
                      />
                    </td>
                    <td className="border border-teal-500 p-2 align-top text-center">
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
                    <td className="border border-teal-500 p-2 align-top">
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
                    <td className="border border-teal-500 p-2 align-top">
                      <div className="flex items-center justify-end gap-0.5">
                        <input
                          className={cn(FIELD_RIGHT, "max-w-[3.25rem]")}
                          value={row.taxPercent}
                          onChange={(e) =>
                            updateLine(row.id, { taxPercent: e.target.value })
                          }
                          inputMode="decimal"
                          aria-label={`Line ${i + 1} tax percent`}
                        />
                        <span className="text-xs text-zinc-500">%</span>
                      </div>
                    </td>
                    <td className="border border-teal-500 px-2 py-2 text-right align-top tabular-nums font-medium text-zinc-900">
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
            className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50/50 px-3 py-1.5 text-xs font-medium text-teal-800 hover:bg-teal-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            <Plus className="size-3.5 text-teal-600" aria-hidden />
            Add line
          </button>
          {lines.length > 1 ? (
            <button
              type="button"
              onClick={() => removeLine(lines[lines.length - 1]!.id)}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              <Trash2 className="size-3.5" aria-hidden />
              Remove last line
            </button>
          ) : null}
        </div>
      </section>

      <div className="mt-10 flex justify-end">
        <div className="w-full max-w-sm space-y-0 text-sm">
          <div className="flex justify-between gap-6 border-b border-zinc-200 py-2.5">
            <span className="font-bold text-zinc-900">Subtotal</span>
            <span className="tabular-nums text-zinc-800">
              {formatBdt(subtotal)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 border-b border-zinc-200 py-2.5">
            <span className="font-bold text-zinc-900">Discount</span>
            <span className="inline-flex items-center gap-0.5 tabular-nums text-zinc-800">
              <span aria-hidden>−$</span>
              <input
                className={cn(FIELD_RIGHT, "max-w-[6.5rem]")}
                value={discount}
                onChange={onDiscountInput}
                inputMode="decimal"
                aria-label="Discount amount"
              />
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 border-b border-zinc-200 py-2.5">
            <span className="font-bold text-zinc-900">
              Tax (
              <input
                className="inline-block w-9 border-0 border-b border-transparent bg-transparent text-right font-bold focus:border-teal-500 focus:outline-none"
                value={invoiceTaxPercent}
                onChange={(e) => setInvoiceTaxPercent(e.target.value)}
                inputMode="decimal"
                aria-label="Invoice tax percent"
              />
              %)
            </span>
            <span className="tabular-nums text-zinc-800">
              {formatBdt(taxAmount)}
            </span>
          </div>

          <div className="mt-1 flex justify-between gap-6 bg-teal-500 px-4 py-4 text-base font-bold text-white">
            <span>TOTAL</span>
            <span className="tabular-nums">{formatBdt(total)}</span>
          </div>
        </div>
      </div>

      <section className="mt-14 grid gap-12 lg:grid-cols-2 lg:items-start">
        <div className="flex min-w-0 flex-col gap-10">
          <div className="space-y-2.5 text-sm">
            <p className="font-bold text-zinc-900">Payment Method</p>
            <p className="text-zinc-600">
              <span className="font-semibold text-zinc-800">Holder Name</span>{" "}
              <input
                className={cn(FIELD, "inline-block min-w-[8rem]")}
                value={payHolder}
                onChange={(e) => setPayHolder(e.target.value)}
                aria-label="Card holder name"
              />
            </p>
            <p className="text-zinc-600">
              <span className="font-semibold text-zinc-800">Card Number</span>{" "}
              <input
                className={cn(
                  FIELD,
                  "inline-block min-w-[10rem] font-mono tracking-wide"
                )}
                value={payCard}
                onChange={(e) => setPayCard(e.target.value)}
                aria-label="Card number"
              />
            </p>
            <p className="text-zinc-600">
              <span className="font-semibold text-zinc-800">ZIP Code</span>{" "}
              <input
                className={cn(FIELD, "inline-block w-24")}
                value={payZip}
                onChange={(e) => setPayZip(e.target.value)}
                aria-label="ZIP code"
              />
            </p>
          </div>

          <footer className="border-t border-zinc-200 pt-6 text-sm">
            <p className="font-bold text-zinc-900">Terms &amp; Conditions</p>
            <textarea
              className="mt-2 min-h-[5rem] w-full resize-y border-0 bg-transparent text-xs leading-relaxed text-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-500/25 rounded-sm"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              aria-label="Terms and conditions"
            />
          </footer>
        </div>

        <InvoiceFluvo2Signature
          imageUrl={signatureUrl}
          onImageUrlChange={setSignatureUrl}
          className="lg:min-h-[280px]"
        />
      </section>
    </div>
  );
}
