"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useInvoiceDraft } from "@/features/invoices/hooks/useInvoiceDraft";
import { InvoiceFluvo7BillingInfo } from "@/features/invoices/templates/invoice_fluvo_7/invoice-fluvo-7-billing-info";
import { InvoiceFluvo7Header } from "@/features/invoices/templates/invoice_fluvo_7/invoice-fluvo-7-header";
import styles from "@/features/invoices/templates/invoice_fluvo_7/invoice-fluvo-7.module.css";
import { InvoiceFluvo7Signature } from "@/features/invoices/templates/invoice_fluvo_7/invoice-fluvo-7-signature";
import { InvoiceFluvo7Table } from "@/features/invoices/templates/invoice_fluvo_7/invoice-fluvo-7-table";
import { InvoiceFluvo7Totals } from "@/features/invoices/templates/invoice_fluvo_7/invoice-fluvo-7-totals";
import type { InvoiceFluvo7LineRow } from "@/features/invoices/templates/invoice_fluvo_7/invoice-fluvo-7-types";
import { cn } from "@/lib/utils/cn";

function parseNum(s: string): number {
  const n = parseFloat(String(s).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function newLine(
  partial?: Partial<Omit<InvoiceFluvo7LineRow, "id">>
): InvoiceFluvo7LineRow {
  return {
    id: crypto.randomUUID(),
    description: partial?.description ?? "",
    qty: partial?.qty ?? "1",
    price: partial?.price ?? "0",
    taxPercent: partial?.taxPercent ?? "10",
  };
}

const PAY_FIELD =
  "min-w-0 border-0 border-b border-transparent bg-transparent py-0.5 text-sm text-zinc-900 focus:border-cyan-500 focus:outline-none";

export function InvoiceFluvo7Template() {
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

  const [lines, setLines] = useState<InvoiceFluvo7LineRow[]>(() =>
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
      Pick<InvoiceFluvo7LineRow, "description" | "qty" | "price" | "taxPercent">
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
        <div className="px-6 pt-8 sm:px-8">
          <InvoiceFluvo7Header
            invoiceNumber={invoiceNumber}
            invoiceDate={invoiceDate}
            dueDate={dueDate}
            poNumber={poNumber}
            onInvoiceNumberChange={setInvoiceNumber}
            onInvoiceDateChange={setInvoiceDate}
            onDueDateChange={setDueDate}
            onPoNumberChange={setPoNumber}
          />
        </div>

        <div className={styles.headerRule} />

        <div className="px-6 py-8 sm:px-8">
          <InvoiceFluvo7BillingInfo
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

          <InvoiceFluvo7Table
            lines={lines}
            numericLines={numericLines}
            onUpdateLine={updateLine}
            onAddLine={addLine}
            onRemoveLastLine={removeLastLine}
          />

          <InvoiceFluvo7Totals
            subtotal={subtotal}
            discount={discount}
            invoiceTaxPercent={invoiceTaxPercent}
            taxAmount={taxAmount}
            total={total}
            onDiscountChange={onDiscountInput}
            onInvoiceTaxPercentChange={setInvoiceTaxPercent}
          />

          <section className="mt-14 grid gap-12 lg:grid-cols-2 lg:items-start">
            <div className={cn(styles.footerLeftWrap, "flex flex-col gap-10 pb-6")}>
              <div className={styles.footerCornerCyan} aria-hidden />
              <div className={styles.footerLeftContent}>
                <div className="space-y-2.5 text-sm">
                  {draft.payment_method?.trim() ? (
                    <>
                      <p className="font-bold text-[#00333d]">Payment Method</p>
                      <p className="text-zinc-700">{draft.payment_method}</p>
                    </>
                  ) : null}
                  {draft.payment_instructions?.trim() ? (
                    <p className="text-zinc-700 whitespace-pre-wrap">
                      {draft.payment_instructions}
                    </p>
                  ) : null}
                  {!showPaymentDraft ? (
                    <>
                      <p className="font-bold text-[#00333d]">Payment Method</p>
                      <p className="text-zinc-700">
                        <span className="font-semibold text-zinc-900">
                          Holder Name
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
                      <p className="text-zinc-700">
                        <span className="font-semibold text-zinc-900">
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
                  <footer className="mt-10 border-t border-zinc-200 pt-6 text-sm">
                    <p className="font-bold text-[#00333d]">
                      Terms &amp; Conditions
                    </p>
                    <textarea
                      className="mt-2 min-h-[4.5rem] w-full resize-y border-0 bg-transparent text-xs leading-relaxed text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 rounded-sm"
                      value={terms}
                      onChange={(e) => setTerms(e.target.value)}
                      aria-label="Terms and conditions"
                    />
                  </footer>
                ) : null}
              </div>
            </div>

            {showSignature ? (
              <InvoiceFluvo7Signature
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
