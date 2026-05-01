"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { formatBdt } from "@/features/invoices/lib/format-bdt";
import { useInvoiceDraft } from "@/features/invoices/hooks/useInvoiceDraft";
import { InvoiceFluvo9BillingInfo } from "@/features/invoices/templates/invoice_fluvo_9/invoice-fluvo-9-billing-info";
import { InvoiceFluvo9Header } from "@/features/invoices/templates/invoice_fluvo_9/invoice-fluvo-9-header";
import styles from "@/features/invoices/templates/invoice_fluvo_9/invoice-fluvo-9.module.css";
import { InvoiceFluvo9Signature } from "@/features/invoices/templates/invoice_fluvo_9/invoice-fluvo-9-signature";
import { InvoiceFluvo9Subtotals } from "@/features/invoices/templates/invoice_fluvo_9/invoice-fluvo-9-subtotals";
import { InvoiceFluvo9Table } from "@/features/invoices/templates/invoice_fluvo_9/invoice-fluvo-9-table";
import type { InvoiceFluvo9LineRow } from "@/features/invoices/templates/invoice_fluvo_9/invoice-fluvo-9-types";
import { cn } from "@/lib/utils/cn";

function parseNum(s: string): number {
  const n = parseFloat(String(s).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function newLine(
  partial?: Partial<Omit<InvoiceFluvo9LineRow, "id">>
): InvoiceFluvo9LineRow {
  return {
    id: crypto.randomUUID(),
    description: partial?.description ?? "",
    qty: partial?.qty ?? "1",
    price: partial?.price ?? "0",
    taxPercent: partial?.taxPercent ?? "10",
  };
}

const PAY_FIELD =
  "min-w-0 border-0 border-b border-transparent bg-transparent py-0.5 text-sm text-black focus:border-black focus:outline-none";

export function InvoiceFluvo9Template() {
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

  const [lines, setLines] = useState<InvoiceFluvo9LineRow[]>(() =>
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
    patch: Partial<
      Pick<InvoiceFluvo9LineRow, "description" | "qty" | "price" | "taxPercent">
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
        <div className="p-8 sm:p-12">
          <InvoiceFluvo9Header
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

          <InvoiceFluvo9BillingInfo
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

          <InvoiceFluvo9Table
            lines={lines}
            numericLines={numericLines}
            onUpdateLine={updateLine}
            onAddLine={addLine}
            onRemoveLastLine={removeLastLine}
          />

          <InvoiceFluvo9Subtotals
            subtotal={subtotal}
            discount={discount}
            invoiceTaxPercent={invoiceTaxPercent}
            taxAmount={taxAmount}
            onDiscountChange={onDiscountInput}
            onInvoiceTaxPercentChange={setInvoiceTaxPercent}
          />

          <div className="mt-8 flex flex-col gap-8 sm:mt-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="w-fit rounded-r-full bg-black px-6 py-4 pr-10 text-white sm:pr-12">
              <p className="text-xs font-medium uppercase tracking-wide text-white/80">
                Total
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums sm:text-3xl">
                {formatBdt(total)}
              </p>
            </div>

            {showSignature ? (
              <InvoiceFluvo9Signature
                imageUrl={signatureUrl}
                onImageUrlChange={setSignatureUrl}
              />
            ) : null}
          </div>

          <section className="mt-14 grid gap-10 border-t border-neutral-300 pt-10 sm:grid-cols-2">
            <div className="space-y-3 text-sm">
              {draft.payment_method?.trim() ? (
                <>
                  <p className="font-bold text-black">Payment Method</p>
                  <p className="text-neutral-800">{draft.payment_method}</p>
                </>
              ) : null}
              {draft.payment_instructions?.trim() ? (
                <p className="text-neutral-800 whitespace-pre-wrap">
                  {draft.payment_instructions}
                </p>
              ) : null}
              {!showPaymentDraft ? (
                <>
                  <p className="font-bold text-black">Payment Method</p>
                  <p className="text-neutral-800">
                    <span className="font-semibold text-black">
                      Holder Name
                    </span>{" "}
                    <input
                      className={cn(PAY_FIELD, "inline-block min-w-32")}
                      value={payHolder}
                      onChange={(e) => setPayHolder(e.target.value)}
                      aria-label="Card holder name"
                    />
                  </p>
                  <p className="text-neutral-800">
                    <span className="font-semibold text-black">Card Number</span>{" "}
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
                  <p className="text-neutral-800">
                    <span className="font-semibold text-black">ZIP Code</span>{" "}
                    <input
                      className={cn(PAY_FIELD, "inline-block w-24")}
                      value={payZip}
                      onChange={(e) => setPayZip(e.target.value)}
                      aria-label="ZIP code"
                    />
                  </p>
                </>
              ) : null}
            </div>

            {showTerms ? (
              <div className="text-sm">
                <p className="font-bold text-black">Terms &amp; Conditions</p>
                <textarea
                  className="mt-2 min-h-24 w-full resize-y border-0 bg-transparent text-xs leading-relaxed text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black/20 rounded-sm"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  aria-label="Terms and conditions"
                />
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
