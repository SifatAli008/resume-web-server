export type InvoiceLineInput = {
  qty: number;
  price: number;
  taxPercent: number;
};

export function lineAmount(line: InvoiceLineInput): number {
  const q = Number.isFinite(line.qty) ? line.qty : 0;
  const p = Number.isFinite(line.price) ? line.price : 0;
  const t = Number.isFinite(line.taxPercent) ? line.taxPercent : 0;
  return q * p * (1 + t / 100);
}

export function sumLineAmounts(lines: InvoiceLineInput[]): number {
  return lines.reduce((acc, line) => acc + lineAmount(line), 0);
}

export function invoiceTaxAmount(
  subtotal: number,
  discount: number,
  invoiceTaxPercent: number
): number {
  const base = subtotal - discount;
  if (!Number.isFinite(base) || base < 0) return 0;
  const pct = Number.isFinite(invoiceTaxPercent) ? invoiceTaxPercent : 0;
  return base * (pct / 100);
}

export function invoiceTotal(
  subtotal: number,
  discount: number,
  invoiceTaxPercent: number
): number {
  return subtotal - discount + invoiceTaxAmount(subtotal, discount, invoiceTaxPercent);
}
