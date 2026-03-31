"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { formatBdt } from "@/features/invoices/lib/format-bdt";
import { InvoiceFluvo10BillingInfo } from "@/features/invoices/templates/invoice_fluvo_10/invoice-fluvo-10-billing-info";
import {
  invoiceTaxAmount,
  invoiceTotal,
  sumLineAmounts,
} from "@/features/invoices/templates/invoice_fluvo_10/invoice-fluvo-10-calculations";
import { InvoiceFluvo10Header } from "@/features/invoices/templates/invoice_fluvo_10/invoice-fluvo-10-header";
import styles from "@/features/invoices/templates/invoice_fluvo_10/invoice-fluvo-10.module.css";
import { InvoiceFluvo10Signature } from "@/features/invoices/templates/invoice_fluvo_10/invoice-fluvo-10-signature";
import { InvoiceFluvo10Subtotals } from "@/features/invoices/templates/invoice_fluvo_10/invoice-fluvo-10-subtotals";
import { InvoiceFluvo10Table } from "@/features/invoices/templates/invoice_fluvo_10/invoice-fluvo-10-table";
import type { InvoiceFluvo10LineRow } from "@/features/invoices/templates/invoice_fluvo_10/invoice-fluvo-10-types";
import { cn } from "@/lib/utils/cn";

const ORANGE = "#E8502D";

function parseNum(s: string): number {
  const n = parseFloat(String(s).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function newLine(
  partial?: Partial<Omit<InvoiceFluvo10LineRow, "id">>
): InvoiceFluvo10LineRow {
  return {
    id: crypto.randomUUID(),
    description: partial?.description ?? "",
    qty: partial?.qty ?? "1",
    price: partial?.price ?? "0",
    taxPercent: partial?.taxPercent ?? "10",
  };
}

const PAY_FIELD =
  "min-w-0 border-0 border-b border-transparent bg-transparent py-0.5 text-sm text-zinc-800 focus:border-[#E8502D] focus:outline-none";

export function InvoiceFluvo10Template() {
  const [invoiceNumber, setInvoiceNumber] = useState("INV00001");
  const [invoiceDate, setInvoiceDate] = useState("2026/03/29");
  const [dueDate, setDueDate] = useState("2026/04/05");
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

  const [lines, setLines] = useState<InvoiceFluvo10LineRow[]>([
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
    patch: Partial<
      Pick<
        InvoiceFluvo10LineRow,
        "description" | "qty" | "price" | "taxPercent"
      >
    >
  ) {
    setLines((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...patch } : row))
    );
  }

  function addLine() {
    setLines((prev) => [...prev, newLine()]);
  }

  function removeLastLine() {
    setLines((prev) => (prev.length <= 1 ? prev : prev.slice(0, -1)));
  }

  function onDiscountInput(e: ChangeEvent<HTMLInputElement>) {
    let v = e.target.value;
    if (v.startsWith("-")) v = v.slice(1);
    setDiscount(v);
  }

  return (
    <div className={cn(styles.paper, "print:bg-white")}>
      <div className={cn(styles.shell, "print:shadow-none")}>
        <InvoiceFluvo10Header
          invoiceNumber={invoiceNumber}
          invoiceDate={invoiceDate}
          dueDate={dueDate}
          poNumber={poNumber}
          onInvoiceNumberChange={setInvoiceNumber}
          onInvoiceDateChange={setInvoiceDate}
          onDueDateChange={setDueDate}
          onPoNumberChange={setPoNumber}
        />

        <div className="px-8 pb-10 pt-10 sm:px-10 sm:pb-12 sm:pt-12">
          <InvoiceFluvo10BillingInfo
            fromName={fromName}
            fromAddress={fromAddress}
            fromPhone={fromPhone}
            fromEmail={fromEmail}
            billName={billName}
            billAddress={billAddress}
            billPhone={billPhone}
            billEmail={billEmail}
            onFromNameChange={setFromName}
            onFromAddressChange={setFromAddress}
            onFromPhoneChange={setFromPhone}
            onFromEmailChange={setFromEmail}
            onBillNameChange={setBillName}
            onBillAddressChange={setBillAddress}
            onBillPhoneChange={setBillPhone}
            onBillEmailChange={setBillEmail}
          />

          <InvoiceFluvo10Table
            lines={lines}
            numericLines={numericLines}
            onUpdateLine={updateLine}
            onAddLine={addLine}
            onRemoveLastLine={removeLastLine}
          />

          <InvoiceFluvo10Subtotals
            subtotal={subtotal}
            discount={discount}
            invoiceTaxPercent={invoiceTaxPercent}
            taxAmount={taxAmount}
            onDiscountChange={onDiscountInput}
            onInvoiceTaxPercentChange={setInvoiceTaxPercent}
          />

          <div className="mt-8 flex flex-col gap-8 sm:mt-10 sm:flex-row sm:items-end sm:justify-between">
            <div
              className="w-fit rounded-r-full px-6 py-4 pr-10 text-white sm:pr-12"
              style={{ backgroundColor: ORANGE }}
            >
              <p className="text-xs font-medium uppercase tracking-wide text-white/90">
                Total
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums sm:text-3xl">
                {formatBdt(total)}
              </p>
            </div>

            <InvoiceFluvo10Signature
              imageUrl={signatureUrl}
              onImageUrlChange={setSignatureUrl}
            />
          </div>

          <section className="mt-14 grid gap-10 border-t border-zinc-200 pt-10 sm:grid-cols-2">
            <div className="space-y-3 text-sm">
              <p className="font-bold text-zinc-900">Payment Method</p>
              <p className="text-zinc-700">
                <span className="font-semibold text-zinc-900">
                  Holder Name
                </span>{" "}
                <input
                  className={cn(PAY_FIELD, "inline-block min-w-32")}
                  value={payHolder}
                  onChange={(e) => setPayHolder(e.target.value)}
                  aria-label="Card holder name"
                />
              </p>
              <p className="text-zinc-700">
                <span className="font-semibold text-zinc-900">
                  Card Number
                </span>{" "}
                <input
                  className={cn(
                    PAY_FIELD,
                    "inline-block min-w-40 font-mono tracking-wide"
                  )}
                  value={payCard}
                  onChange={(e) => setPayCard(e.target.value)}
                  aria-label="Card number"
                />
              </p>
              <p className="text-zinc-700">
                <span className="font-semibold text-zinc-900">ZIP Code</span>{" "}
                <input
                  className={cn(PAY_FIELD, "inline-block w-24")}
                  value={payZip}
                  onChange={(e) => setPayZip(e.target.value)}
                  aria-label="ZIP code"
                />
              </p>
            </div>

            <div className="text-sm">
              <p className="font-bold text-zinc-900">Terms &amp; Conditions</p>
              <textarea
                className="mt-2 min-h-24 w-full resize-y border-0 bg-transparent text-xs leading-relaxed text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#E8502D]/25 rounded-sm"
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                aria-label="Terms and conditions"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
