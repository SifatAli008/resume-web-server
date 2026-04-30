"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { InvoiceFluvo8BillingInfo } from "@/features/invoices/templates/invoice_fluvo_8/invoice-fluvo-8-billing-info";
import {
  invoiceTaxAmount,
  invoiceTotal,
  sumLineAmounts,
} from "@/features/invoices/templates/invoice_fluvo_8/invoice-fluvo-8-calculations";
import { InvoiceFluvo8CornerDecor } from "@/features/invoices/templates/invoice_fluvo_8/invoice-fluvo-8-corner-decor";
import { InvoiceFluvo8Header } from "@/features/invoices/templates/invoice_fluvo_8/invoice-fluvo-8-header";
import styles from "@/features/invoices/templates/invoice_fluvo_8/invoice-fluvo-8.module.css";
import { InvoiceFluvo8Signature } from "@/features/invoices/templates/invoice_fluvo_8/invoice-fluvo-8-signature";
import { InvoiceFluvo8Table } from "@/features/invoices/templates/invoice_fluvo_8/invoice-fluvo-8-table";
import { InvoiceFluvo8Totals } from "@/features/invoices/templates/invoice_fluvo_8/invoice-fluvo-8-totals";
import type { InvoiceFluvo8LineRow } from "@/features/invoices/templates/invoice_fluvo_8/invoice-fluvo-8-types";
import { cn } from "@/lib/utils/cn";

function parseNum(s: string): number {
  const n = parseFloat(String(s).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function newLine(
  partial?: Partial<Omit<InvoiceFluvo8LineRow, "id">>
): InvoiceFluvo8LineRow {
  return {
    id: crypto.randomUUID(),
    description: partial?.description ?? "",
    qty: partial?.qty ?? "1",
    price: partial?.price ?? "0",
    taxPercent: partial?.taxPercent ?? "10",
  };
}

const PAY_FIELD =
  "min-w-0 border-0 border-b border-transparent bg-transparent py-0.5 text-sm text-zinc-900 focus:border-[#6b6ba3] focus:outline-none";

const PURPLE = "#6b6ba3";

export function InvoiceFluvo8Template() {
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

  const [lines, setLines] = useState<InvoiceFluvo8LineRow[]>([
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
      Pick<InvoiceFluvo8LineRow, "description" | "qty" | "price" | "taxPercent">
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
        <InvoiceFluvo8CornerDecor />
        <div
          className={cn(
            styles.content,
            "px-8 py-10 sm:px-10 sm:py-12"
          )}
        >
          <InvoiceFluvo8Header
            invoiceNumber={invoiceNumber}
            invoiceDate={invoiceDate}
            dueDate={dueDate}
            poNumber={poNumber}
            onInvoiceNumberChange={setInvoiceNumber}
            onInvoiceDateChange={setInvoiceDate}
            onDueDateChange={setDueDate}
            onPoNumberChange={setPoNumber}
          />

          <div className={cn("my-10", styles.headerRule)} />

          <InvoiceFluvo8BillingInfo
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

          <InvoiceFluvo8Table
            lines={lines}
            numericLines={numericLines}
            onUpdateLine={updateLine}
            onAddLine={addLine}
            onRemoveLastLine={removeLastLine}
          />

          <InvoiceFluvo8Totals
            subtotal={subtotal}
            discount={discount}
            invoiceTaxPercent={invoiceTaxPercent}
            taxAmount={taxAmount}
            total={total}
            onDiscountChange={onDiscountInput}
            onInvoiceTaxPercentChange={setInvoiceTaxPercent}
          />

          <section className="mt-16 grid gap-14 lg:grid-cols-2 lg:items-start">
            <div className="flex flex-col gap-12">
              <div className="space-y-3 text-sm">
                <p className="font-bold" style={{ color: PURPLE }}>
                  Payment Method
                </p>
                <p className="text-zinc-700">
                  <span className="font-semibold text-zinc-900">
                    Holder Name:
                  </span>{" "}
                  <input
                    className={cn(PAY_FIELD, "inline-block min-w-[8rem]")}
                    value={payHolder}
                    onChange={(e) => setPayHolder(e.target.value)}
                    aria-label="Card holder name"
                  />
                </p>
                <p className="text-zinc-700">
                  <span className="font-semibold text-zinc-900">
                    Card Number:
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
                <p className="text-zinc-700">
                  <span className="font-semibold text-zinc-900">
                    ZIP Code:
                  </span>{" "}
                  <input
                    className={cn(PAY_FIELD, "inline-block w-24")}
                    value={payZip}
                    onChange={(e) => setPayZip(e.target.value)}
                    aria-label="ZIP code"
                  />
                </p>
              </div>

              <footer className="border-t border-zinc-200 pt-8 text-sm">
                <p className="font-bold" style={{ color: PURPLE }}>
                  Terms &amp; Conditions
                </p>
                <textarea
                  className="mt-2 min-h-[4.5rem] w-full resize-y border-0 bg-transparent text-xs leading-relaxed text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#6b6ba3]/30 rounded-sm"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  aria-label="Terms and conditions"
                />
              </footer>
            </div>

            <div className="relative z-2">
              <InvoiceFluvo8Signature
                imageUrl={signatureUrl}
                onImageUrlChange={setSignatureUrl}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
