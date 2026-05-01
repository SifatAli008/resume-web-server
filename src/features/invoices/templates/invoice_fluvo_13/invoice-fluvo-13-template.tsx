"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type CSSProperties } from "react";
import { Plus, Trash2 } from "lucide-react";
import { formatBdt } from "@/features/invoices/lib/format-bdt";
import { useInvoiceDraft } from "@/features/invoices/hooks/useInvoiceDraft";
import { lineAmount } from "@/features/invoices/templates/invoice_fluvo_2/invoice-fluvo-2-calculations";
import { InvoiceFluvo13Branding } from "@/features/invoices/templates/invoice_fluvo_13/invoice-fluvo-13-branding";
import { InvoiceFluvo13Signature } from "@/features/invoices/templates/invoice_fluvo_13/invoice-fluvo-13-signature";
import styles from "@/features/invoices/templates/invoice_fluvo_13/invoice-fluvo-13.module.css";
import { cn } from "@/lib/utils/cn";

/** Tailwind blue-800 */
const BLUE_800 = "#1e40af";
const ROW_TINT = "bg-blue-50/90";

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
  "w-full min-w-0 border-0 border-b border-transparent bg-transparent py-0.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-blue-800 focus:outline-none";
const FIELD_RIGHT = `${FIELD} text-right tabular-nums`;

export function InvoiceFluvo13Template() {
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
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [headerBgUrl, setHeaderBgUrl] = useState<string | null>(null);

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

  useEffect(() => {
    return () => {
      if (logoUrl?.startsWith("blob:")) URL.revokeObjectURL(logoUrl);
    };
  }, [logoUrl]);

  useEffect(() => {
    return () => {
      if (headerBgUrl?.startsWith("blob:")) URL.revokeObjectURL(headerBgUrl);
    };
  }, [headerBgUrl]);

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
    setLines((prev) =>
      prev.length <= 1 ? prev : prev.filter((r) => r.id !== id)
    );
  }

  function onDiscountInput(e: ChangeEvent<HTMLInputElement>) {
    let v = e.target.value;
    if (v.startsWith("-")) v = v.slice(1);
    setDiscount(v);
  }

  const heroBgStyle: CSSProperties | undefined = headerBgUrl
    ? {
        backgroundImage: `url(${headerBgUrl})`,
      }
    : undefined;

  return (
    <div
      className={cn(
        styles.paper,
        "mx-auto max-w-4xl overflow-hidden bg-white text-zinc-800 shadow-md print:shadow-none"
      )}
    >
      <div className="px-6 pt-6 print:hidden">
        <InvoiceFluvo13Branding
          logoUrl={logoUrl}
          onLogoUrlChange={setLogoUrl}
          headerBgUrl={headerBgUrl}
          onHeaderBgUrlChange={setHeaderBgUrl}
        />
      </div>

      <header className={styles.hero}>
        <div
          className={cn(styles.heroBg, headerBgUrl && styles.heroBgImage)}
          style={heroBgStyle}
          aria-hidden
        />
        <div className={styles.heroOverlay} aria-hidden />
        <div className={styles.heroContent}>
          <div className={styles.logoSlot}>
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- user-uploaded blob
              <img
                src={logoUrl}
                alt="Company logo"
                className="h-full w-full object-contain p-1.5"
              />
            ) : (
              <span className={styles.logoPlaceholder}>
                YOUR
                <br />
                LOGO
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-1 text-sm leading-relaxed">
            <input
              className={cn(styles.fieldLight, "text-base font-bold")}
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              aria-label="Sender name"
            />
            <input
              className={styles.fieldLight}
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
              aria-label="Sender address"
            />
            <input
              className={styles.fieldLight}
              value={fromPhone}
              onChange={(e) => setFromPhone(e.target.value)}
              aria-label="Sender phone"
            />
            <input
              className={styles.fieldLight}
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              aria-label="Sender email"
            />
          </div>

          <h1 className="shrink-0 self-center text-4xl font-bold uppercase tracking-[0.12em] sm:text-5xl">
            Invoice
          </h1>
        </div>
      </header>

      <div className="px-8 pb-10 pt-8 sm:px-10">
        <section className="grid gap-10 sm:grid-cols-2 sm:gap-12">
          <div className="space-y-1.5 text-sm">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-900">
              Bill To
            </p>
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
          <dl className="grid w-full grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-sm sm:ml-auto sm:max-w-sm">
            <dt className="font-bold uppercase tracking-wide text-zinc-900">
              Invoice #
            </dt>
            <dd>
              <input
                className={cn(FIELD_RIGHT)}
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                aria-label="Invoice number"
              />
            </dd>
            <dt className="font-bold uppercase tracking-wide text-zinc-900">
              Date
            </dt>
            <dd>
              <input
                className={cn(FIELD_RIGHT)}
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                aria-label="Invoice date"
              />
            </dd>
            <dt className="font-bold uppercase tracking-wide text-zinc-900">
              Due date
            </dt>
            <dd>
              <input
                className={cn(FIELD_RIGHT)}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                aria-label="Due date"
              />
            </dd>
            <dt className="font-bold uppercase tracking-wide text-zinc-900">
              P.O. #
            </dt>
            <dd>
              <input
                className={cn(FIELD_RIGHT)}
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                aria-label="Purchase order number"
              />
            </dd>
          </dl>
        </section>

        <section className="mt-10 space-y-4">
          <div className="overflow-x-auto rounded-sm">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="text-white" style={{ backgroundColor: BLUE_800 }}>
                  <th className="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide">
                    Description
                  </th>
                  <th className="w-20 px-2 py-3.5 text-center text-xs font-bold uppercase tracking-wide">
                    Qty
                  </th>
                  <th className="w-28 px-2 py-3.5 text-right text-xs font-bold uppercase tracking-wide">
                    Price
                  </th>
                  <th className="w-24 px-2 py-3.5 text-right text-xs font-bold uppercase tracking-wide">
                    Tax
                  </th>
                  <th className="w-32 px-2 py-3.5 text-right text-xs font-bold uppercase tracking-wide">
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
                        stripe ? ROW_TINT : "bg-white",
                        "text-zinc-800"
                      )}
                    >
                      <td className="border border-blue-200 p-2 align-top">
                        <input
                          className={FIELD}
                          value={row.description}
                          onChange={(e) =>
                            updateLine(row.id, { description: e.target.value })
                          }
                          aria-label={`Line ${i + 1} description`}
                        />
                      </td>
                      <td className="border border-blue-200 p-2 align-top text-center">
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
                      <td className="border border-blue-200 p-2 align-top">
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
                      <td className="border border-blue-200 p-2 align-top">
                        <div className="flex items-center justify-end gap-0.5">
                          <input
                            className={cn(FIELD_RIGHT, "max-w-[3.25rem]")}
                            value={row.taxPercent}
                            onChange={(e) =>
                              updateLine(row.id, {
                                taxPercent: e.target.value,
                              })
                            }
                            inputMode="decimal"
                            aria-label={`Line ${i + 1} tax percent`}
                          />
                          <span className="text-xs text-zinc-500">%</span>
                        </div>
                      </td>
                      <td className="border border-blue-200 px-2 py-2 text-right align-top tabular-nums font-medium text-zinc-900">
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
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-950 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
            >
              <Plus className="size-3.5 text-blue-800" aria-hidden />
              Add line
            </button>
            {lines.length > 1 ? (
              <button
                type="button"
                onClick={() => removeLine(lines[lines.length - 1]!.id)}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
              >
                <Trash2 className="size-3.5" aria-hidden />
                Remove last line
              </button>
            ) : null}
          </div>
        </section>

        <div className="mt-10 flex justify-end">
          <div className="w-full max-w-sm space-y-0 text-sm">
            <div className="flex justify-between gap-6 border-b border-blue-200 py-2.5">
              <span className="font-bold text-zinc-900">Subtotal</span>
              <span className="tabular-nums text-zinc-800">
                {formatBdt(subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-6 border-b border-blue-200 py-2.5">
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
            <div className="flex items-center justify-between gap-6 border-b border-blue-200 py-2.5">
              <span className="font-bold text-zinc-900">
                Tax (
                <input
                  className="inline-block w-9 border-0 border-b border-transparent bg-transparent text-right font-bold focus:border-blue-800 focus:outline-none"
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

            <div
              className="mt-1 flex justify-between gap-6 px-4 py-4 text-base font-bold text-white"
              style={{ backgroundColor: BLUE_800 }}
            >
              <span>TOTAL</span>
              <span className="tabular-nums">{formatBdt(total)}</span>
            </div>
          </div>
        </div>

        <section className="mt-14 grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="flex min-w-0 flex-col gap-10">
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
                      className={cn(FIELD, "inline-block min-w-[8rem]")}
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
                        FIELD,
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
                      className={cn(FIELD, "inline-block w-24")}
                      value={payZip}
                      onChange={(e) => setPayZip(e.target.value)}
                      aria-label="ZIP code"
                    />
                  </p>
                </>
              ) : null}
            </div>

            {showTerms ? (
              <footer className="border-t border-blue-200 pt-6 text-sm">
                <p className="font-bold text-zinc-900">
                  Terms &amp; Conditions
                </p>
                <textarea
                  className="mt-2 min-h-[5rem] w-full resize-y rounded-sm border-0 bg-transparent text-xs leading-relaxed text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-800/20"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  aria-label="Terms and conditions"
                />
              </footer>
            ) : null}
          </div>

          {showSignature ? (
            <InvoiceFluvo13Signature
              imageUrl={signatureUrl}
              onImageUrlChange={setSignatureUrl}
              className="lg:min-h-[280px]"
            />
          ) : null}
        </section>
      </div>

      <div className={styles.footerStripe} aria-hidden />
    </div>
  );
}
