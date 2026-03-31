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
import { InvoiceFluvo19Signature } from "@/features/invoices/templates/invoice_fluvo_19/invoice-fluvo-19-signature";
import styles from "@/features/invoices/templates/invoice_fluvo_19/invoice-fluvo-19.module.css";
import { cn } from "@/lib/utils/cn";

const legoPixel = Press_Start_2P({
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
  "w-full min-w-0 border-0 border-b-2 border-transparent bg-transparent py-1 text-[11px] text-[#141414] placeholder:text-[#141414]/40 focus:border-[#ffd500] focus:outline-none";
const FIELD_RIGHT = `${FIELD} text-right tabular-nums`;

export function InvoiceFluvo19Template() {
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
        legoPixel.className,
        styles.pixelCrisp,
        "mx-auto max-w-4xl text-[#141414] print:shadow-none"
      )}
    >
      <div className={styles.paper}>
        <div className={styles.studStrip} aria-hidden />

        <div className="px-8 py-8 sm:px-10 sm:py-10">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className={cn(styles.titleBrick, "text-lg sm:text-xl")}>
            INVOICE
          </h1>
          <p className="text-[9px] uppercase tracking-[0.2em] text-[#0055bf]">
            Build · Bill · Play
          </p>
        </div>
        <dl className="grid w-full max-w-xs grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[10px] sm:text-right">
          <dt className="font-normal text-[#141414]">INV #</dt>
          <dd>
            <input
              className={cn(FIELD_RIGHT, "sm:text-right")}
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              aria-label="Invoice number"
            />
          </dd>
          <dt className="font-normal text-[#141414]">DATE</dt>
          <dd>
            <input
              className={cn(FIELD_RIGHT, "sm:text-right")}
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              aria-label="Invoice date"
            />
          </dd>
          <dt className="font-normal text-[#141414]">DUE</dt>
          <dd>
            <input
              className={cn(FIELD_RIGHT, "sm:text-right")}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              aria-label="Due date"
            />
          </dd>
          <dt className="font-normal text-[#141414]">P.O.</dt>
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

      <div className={cn("my-6", styles.headerRule)} />

      <section className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-2 text-[11px]">
          <p className={styles.brickLabel}>From</p>
          <input
            className={cn(FIELD, "font-normal text-[#141414]")}
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
        <div className="space-y-2 text-[11px]">
          <p className={cn(styles.brickLabel, "bg-[#e3000b]")}>Bill To</p>
          <input
            className={cn(FIELD, "font-normal text-[#141414]")}
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
        <div className={cn("overflow-x-auto", styles.tableWrap)}>
          <table className="w-full min-w-[560px] border-collapse text-[10px]">
            <thead>
              <tr className={cn(styles.tableHead, "uppercase tracking-wide")}>
                <th
                  className={cn(styles.tableCell, "px-2 py-3 text-left")}
                >
                  Item
                </th>
                <th
                  className={cn(styles.tableCell, "w-20 px-2 py-3 text-center")}
                >
                  Qty
                </th>
                <th
                  className={cn(
                    styles.tableCell,
                    "w-28 px-2 py-3 text-right"
                  )}
                >
                  Price
                </th>
                <th
                  className={cn(styles.tableCell, "w-24 px-2 py-3 text-right")}
                >
                  Tax
                </th>
                <th
                  className={cn(
                    styles.tableCell,
                    "w-32 px-2 py-3 text-right"
                  )}
                >
                  Amt
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
                      stripe ? styles.rowStripe : "bg-[#fff8e7]",
                      "text-[#141414]"
                    )}
                  >
                    <td className={cn(styles.tableCell, "p-2 align-top")}>
                      <input
                        className={FIELD}
                        value={row.description}
                        onChange={(e) =>
                          updateLine(row.id, { description: e.target.value })
                        }
                        aria-label={`Line ${i + 1} description`}
                      />
                    </td>
                    <td
                      className={cn(styles.tableCell, "p-2 align-top text-center")}
                    >
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
                    <td className={cn(styles.tableCell, "p-2 align-top")}>
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
                    <td className={cn(styles.tableCell, "p-2 align-top")}>
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
                        <span className="text-[9px] text-[#141414]/60">%</span>
                      </div>
                    </td>
                    <td
                      className={cn(
                        styles.tableCell,
                        "px-2 py-2 text-right align-top tabular-nums font-normal text-[#141414]"
                      )}
                    >
                      {formatBdt(amt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={addLine}
            className={cn(
              styles.btnBrick,
              "inline-flex items-center gap-1.5 bg-[#00a550] px-3 py-2 text-[10px] font-normal uppercase tracking-wide text-white"
            )}
          >
            <Plus className="size-3.5" aria-hidden />
            Add brick
          </button>
          {lines.length > 1 ? (
            <button
              type="button"
              onClick={() => removeLine(lines[lines.length - 1]!.id)}
              className={cn(
                styles.btnBrick,
                "inline-flex items-center gap-1.5 bg-[#fff3c4] px-3 py-2 text-[10px] font-normal uppercase tracking-wide text-[#141414]"
              )}
            >
              <Trash2 className="size-3.5" aria-hidden />
              Pop last
            </button>
          ) : null}
        </div>
      </section>

      <div className="mt-10 flex justify-end">
        <div className="w-full max-w-sm space-y-0 text-[11px]">
          <div className="flex justify-between gap-6 border-b-2 border-[#141414] py-2.5">
            <span className="font-normal text-[#141414]">Subtotal</span>
            <span className="tabular-nums text-[#141414]">
              {formatBdt(subtotal)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 border-b-2 border-[#141414] py-2.5">
            <span className="font-normal text-[#141414]">Discount</span>
            <span className="inline-flex items-center gap-0.5 tabular-nums text-[#141414]">
              <span aria-hidden>−৳</span>
              <input
                className={cn(FIELD_RIGHT, "max-w-[6.5rem]")}
                value={discount}
                onChange={onDiscountInput}
                inputMode="decimal"
                aria-label="Discount amount"
              />
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 border-b-2 border-[#141414] py-2.5">
            <span className="font-normal text-[#141414]">
              Tax (
              <input
                className="inline-block w-9 border-0 border-b-2 border-transparent bg-transparent text-right font-normal focus:border-[#ffd500] focus:outline-none"
                value={invoiceTaxPercent}
                onChange={(e) => setInvoiceTaxPercent(e.target.value)}
                inputMode="decimal"
                aria-label="Invoice tax percent"
              />
              %)
            </span>
            <span className="tabular-nums text-[#141414]">
              {formatBdt(taxAmount)}
            </span>
          </div>

          <div
            className={cn(
              styles.totalBrick,
              "mt-2 flex justify-between gap-6 px-4 py-4 text-sm font-normal tabular-nums"
            )}
          >
            <span>TOTAL</span>
            <span>{formatBdt(total)}</span>
          </div>
        </div>
      </div>

      <section className="mt-14 grid gap-12 lg:grid-cols-2 lg:items-start">
        <div className="flex min-w-0 flex-col gap-10">
          <div className="space-y-2.5 text-[11px]">
            <p className={cn(styles.brickLabel, "bg-[#141414]")}>
              Payment
            </p>
            <p className="text-[#141414]/90">
              <span className="font-normal text-[#141414]">Holder</span>{" "}
              <input
                className={cn(FIELD, "inline-block min-w-[8rem]")}
                value={payHolder}
                onChange={(e) => setPayHolder(e.target.value)}
                aria-label="Card holder name"
              />
            </p>
            <p className="text-[#141414]/90">
              <span className="font-normal text-[#141414]">Card</span>{" "}
              <input
                className={cn(
                  FIELD,
                  "inline-block min-w-[10rem] tracking-wide"
                )}
                value={payCard}
                onChange={(e) => setPayCard(e.target.value)}
                aria-label="Card number"
              />
            </p>
            <p className="text-[#141414]/90">
              <span className="font-normal text-[#141414]">ZIP</span>{" "}
              <input
                className={cn(FIELD, "inline-block w-24")}
                value={payZip}
                onChange={(e) => setPayZip(e.target.value)}
                aria-label="ZIP code"
              />
            </p>
          </div>

          <footer className="border-t-[3px] border-[#141414] pt-6 text-[11px]">
            <p className={styles.brickLabel}>Terms</p>
            <textarea
              className="mt-2 min-h-[5rem] w-full resize-y border-0 bg-transparent text-[10px] leading-relaxed text-[#141414]/85 focus:outline-none focus:ring-2 focus:ring-[#0055bf]/30"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              aria-label="Terms and conditions"
            />
          </footer>
        </div>

        <InvoiceFluvo19Signature
          imageUrl={signatureUrl}
          onImageUrlChange={setSignatureUrl}
          className={cn(legoPixel.className, styles.pixelCrisp, "lg:min-h-[280px]")}
        />
      </section>
        </div>
      </div>
    </div>
  );
}
