"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { InvoiceFluvo5BillingInfo } from "@/features/invoices/templates/invoice_fluvo_5/invoice-fluvo-5-billing-info";
import {
  invoiceTaxAmount,
  invoiceTotal,
  sumLineAmounts,
} from "@/features/invoices/templates/invoice_fluvo_5/invoice-fluvo-5-calculations";
import { InvoiceFluvo5Header } from "@/features/invoices/templates/invoice_fluvo_5/invoice-fluvo-5-header";
import styles from "@/features/invoices/templates/invoice_fluvo_5/invoice-fluvo-5.module.css";
import { InvoiceFluvo5Signature } from "@/features/invoices/templates/invoice_fluvo_5/invoice-fluvo-5-signature";
import { InvoiceFluvo5Table } from "@/features/invoices/templates/invoice_fluvo_5/invoice-fluvo-5-table";
import { InvoiceFluvo5Totals } from "@/features/invoices/templates/invoice_fluvo_5/invoice-fluvo-5-totals";
import type { InvoiceFluvo5LineRow } from "@/features/invoices/templates/invoice_fluvo_5/invoice-fluvo-5-types";
import { cn } from "@/lib/utils/cn";

function parseNum(s: string): number {
  const n = parseFloat(String(s).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function newLine(
  partial?: Partial<Omit<InvoiceFluvo5LineRow, "id">>
): InvoiceFluvo5LineRow {
  return {
    id: crypto.randomUUID(),
    description: partial?.description ?? "",
    qty: partial?.qty ?? "1",
    price: partial?.price ?? "0",
    taxPercent: partial?.taxPercent ?? "10",
  };
}

const PAY_FIELD =
  "min-w-0 border-0 border-b border-transparent bg-transparent py-0.5 text-sm text-zinc-800 focus:border-blue-600 focus:outline-none";

function SegmentedLeftBar() {
  return (
    <div
      className="flex w-3.5 shrink-0 flex-col self-stretch border-r border-blue-900/25"
      aria-hidden
    >
      <div className="min-h-9 flex-[1.15] bg-blue-800" />
      <div className="min-h-7 flex-[0.68] bg-blue-600" />
      <div className="min-h-11 flex-[1.4] bg-blue-700" />
      <div className="min-h-8 flex-[0.72] bg-blue-600" />
      <div className="min-h-12 flex-[2] bg-blue-800" />
    </div>
  );
}

export function InvoiceFluvo5Template() {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("27/03/2026");
  const [dueDate, setDueDate] = useState("03/04/2026");
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

  const [lines, setLines] = useState<InvoiceFluvo5LineRow[]>([
    newLine({
      description: "Plumbing Service",
      qty: "1",
      price: "380.00",
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
      Pick<InvoiceFluvo5LineRow, "description" | "qty" | "price" | "taxPercent">
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
    setLines((prev) =>
      prev.length <= 1 ? prev : prev.slice(0, -1)
    );
  }

  function onDiscountInput(e: ChangeEvent<HTMLInputElement>) {
    let v = e.target.value;
    if (v.startsWith("-")) v = v.slice(1);
    setDiscount(v);
  }

  return (
    <div className={cn(styles.paper, "print:bg-white")}>
      <div className={cn(styles.shell, "print:shadow-none")}>
        <SegmentedLeftBar />
        <div className={styles.inner}>
          <div className={styles.cornerTop} />
          <div className={styles.cornerBottom} />
          <div className={styles.content}>
            <InvoiceFluvo5Header
              invoiceNumber={invoiceNumber}
              invoiceDate={invoiceDate}
              dueDate={dueDate}
              poNumber={poNumber}
              onInvoiceNumberChange={setInvoiceNumber}
              onInvoiceDateChange={setInvoiceDate}
              onDueDateChange={setDueDate}
              onPoNumberChange={setPoNumber}
            />

            <div className={cn("my-8", styles.headerRule)} />

            <InvoiceFluvo5BillingInfo
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

            <InvoiceFluvo5Table
              lines={lines}
              numericLines={numericLines}
              onUpdateLine={updateLine}
              onAddLine={addLine}
              onRemoveLastLine={removeLastLine}
            />

            <InvoiceFluvo5Totals
              subtotal={subtotal}
              discount={discount}
              invoiceTaxPercent={invoiceTaxPercent}
              taxAmount={taxAmount}
              total={total}
              onDiscountChange={onDiscountInput}
              onInvoiceTaxPercentChange={setInvoiceTaxPercent}
            />

            <section className="mt-14 grid gap-12 lg:grid-cols-2 lg:items-start">
              <div className="flex flex-col gap-10">
                <div className="space-y-2.5 text-sm">
                  <p className="font-bold text-zinc-900">Payment Method</p>
                  <p className="text-zinc-600">
                    <span className="font-semibold text-zinc-800">
                      Holder Name
                    </span>{" "}
                    <input
                      className={cn(PAY_FIELD, "inline-block min-w-[8rem]")}
                      value={payHolder}
                      onChange={(e) => setPayHolder(e.target.value)}
                      aria-label="Card holder name"
                    />
                  </p>
                  <p className="text-zinc-600">
                    <span className="font-semibold text-zinc-800">
                      Card Number
                    </span>{" "}
                    <input
                      className={cn(
                        PAY_FIELD,
                        "inline-block min-w-[10rem] font-mono tracking-wide"
                      )}
                      value={payCard}
                      onChange={(e) => setPayCard(e.target.value)}
                      aria-label="Card number"
                    />
                  </p>
                  <p className="text-zinc-600">
                    <span className="font-semibold text-zinc-800">
                      ZIP Code
                    </span>{" "}
                    <input
                      className={cn(PAY_FIELD, "inline-block w-24")}
                      value={payZip}
                      onChange={(e) => setPayZip(e.target.value)}
                      aria-label="ZIP code"
                    />
                  </p>
                </div>

                <footer className="border-t border-zinc-200 pt-6 text-sm">
                  <p className="font-bold text-zinc-900">
                    Terms &amp; Conditions
                  </p>
                  <textarea
                    className="mt-2 min-h-[4.5rem] w-full resize-y border-0 bg-transparent text-xs leading-relaxed text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-600/25 rounded-sm"
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    aria-label="Terms and conditions"
                  />
                </footer>
              </div>

              <InvoiceFluvo5Signature
                imageUrl={signatureUrl}
                onImageUrlChange={setSignatureUrl}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
