"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useInvoiceDraft } from "@/features/invoices/hooks/useInvoiceDraft";
import { InvoiceFluvo4BillingInfo } from "@/features/invoices/templates/invoice_fluvo_4/invoice-fluvo-4-billing-info";
import { InvoiceFluvo4Header } from "@/features/invoices/templates/invoice_fluvo_4/invoice-fluvo-4-header";
import styles from "@/features/invoices/templates/invoice_fluvo_4/invoice-fluvo-4.module.css";
import { InvoiceFluvo4Signature } from "@/features/invoices/templates/invoice_fluvo_4/invoice-fluvo-4-signature";
import { InvoiceFluvo4Table } from "@/features/invoices/templates/invoice_fluvo_4/invoice-fluvo-4-table";
import { InvoiceFluvo4Totals } from "@/features/invoices/templates/invoice_fluvo_4/invoice-fluvo-4-totals";
import type { InvoiceFluvo4LineRow } from "@/features/invoices/templates/invoice_fluvo_4/invoice-fluvo-4-types";
import { cn } from "@/lib/utils/cn";

function parseNum(s: string): number {
  const n = parseFloat(String(s).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function newLine(
  partial?: Partial<Omit<InvoiceFluvo4LineRow, "id">>
): InvoiceFluvo4LineRow {
  return {
    id: crypto.randomUUID(),
    description: partial?.description ?? "",
    qty: partial?.qty ?? "1",
    price: partial?.price ?? "0",
    taxPercent: partial?.taxPercent ?? "10",
  };
}

const PAY_FIELD =
  "min-w-0 border-0 border-b border-transparent bg-transparent py-0.5 text-sm text-zinc-800 focus:border-green-600 focus:outline-none";

export function InvoiceFluvo4Template() {
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

  const [lines, setLines] = useState<InvoiceFluvo4LineRow[]>(() =>
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
    setPayCard("3461546793621567");
    setPayZip("90026");

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
      Pick<InvoiceFluvo4LineRow, "description" | "qty" | "price" | "taxPercent">
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
        <div className={styles.curveDecor} aria-hidden>
          <div className={styles.blobGreen} />
          <div className={styles.blobBlue} />
          <div className={styles.blobGreenSoft} />
        </div>
        <div className={styles.content}>
          <InvoiceFluvo4Header
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

          <InvoiceFluvo4BillingInfo
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

          <InvoiceFluvo4Table
            lines={lines}
            numericLines={numericLines}
            onUpdateLine={updateLine}
            onAddLine={addLine}
            onRemoveLastLine={removeLastLine}
          />

          <InvoiceFluvo4Totals
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
                {draft.payment_method?.trim() ? (
                  <>
                    <p className="font-bold text-zinc-900">Payment Method</p>
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
                  </>
                ) : null}
              </div>

              {showTerms ? (
                <footer className="border-t border-zinc-200 pt-6 text-sm">
                  <p className="font-bold text-zinc-900">
                    Terms &amp; Conditions
                  </p>
                  <textarea
                    className="mt-2 min-h-[4.5rem] w-full resize-y border-0 bg-transparent text-xs leading-relaxed text-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-600/25 rounded-sm"
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    aria-label="Terms and conditions"
                  />
                </footer>
              ) : null}
            </div>

            {showSignature ? (
              <InvoiceFluvo4Signature
                imageUrl={signatureUrl}
                onImageUrlChange={setSignatureUrl}
              />
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
