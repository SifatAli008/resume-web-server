import { isKnownInvoiceTemplateId } from "./constants.js";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function asNumber(value) {
  const n = Number(String(value ?? "").replaceAll(",", ""));
  return Number.isFinite(n) ? n : 0;
}

function money(value, currencySymbol) {
  return `${currencySymbol}${asNumber(value).toFixed(2)}`;
}

function shortDate(value) {
  const s = String(value ?? "").trim();
  if (!s) return "";
  if (s.length >= 10 && s.includes("-")) return s.slice(0, 10);
  return s;
}

function sanitizeAssetUrl(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  if (raw.startsWith("data:image/")) return raw;
  try {
    const u = new URL(raw);
    if (u.protocol === "http:" || u.protocol === "https:") {
      return u.toString();
    }
  } catch {
    return "";
  }
  return "";
}

function getTemplateTheme(templateId) {
  const n = Number(String(templateId).replace("invoice_fluvo_", ""));
  const palette = [
    { head: "bg-zinc-900", total: "bg-zinc-900 text-white", border: "border-zinc-200", stripe: "bg-zinc-50" },
    { head: "bg-teal-500", total: "bg-teal-500 text-white", border: "border-teal-200", stripe: "bg-teal-50/50" },
    { head: "bg-red-700", total: "bg-red-700 text-white", border: "border-red-200", stripe: "bg-red-50/60" },
    { head: "bg-green-600", total: "bg-green-600 text-white", border: "border-green-200", stripe: "bg-green-50/60" },
    { head: "bg-sky-600", total: "bg-sky-600 text-white", border: "border-sky-200", stripe: "bg-sky-50/60" },
    { head: "bg-amber-600", total: "bg-amber-600 text-zinc-900", border: "border-amber-200", stripe: "bg-amber-50/60" },
    { head: "bg-cyan-800", total: "bg-cyan-800 text-white", border: "border-cyan-200", stripe: "bg-cyan-50/50" },
    { head: "bg-violet-700", total: "bg-violet-700 text-white", border: "border-violet-200", stripe: "bg-violet-50/50" },
  ];
  return palette[(Number.isFinite(n) && n > 0 ? n - 1 : 0) % palette.length];
}

function normalizeDraft(draft = {}) {
  const company = draft.company && typeof draft.company === "object" ? draft.company : {};
  const client = draft.client && typeof draft.client === "object" ? draft.client : {};
  const itemsRaw = Array.isArray(draft.items) ? draft.items : [];
  const items = itemsRaw.map((item) => ({
    description: String(item?.description ?? ""),
    quantity: asNumber(item?.quantity),
    rate: asNumber(item?.rate),
    taxPercent: asNumber(item?.tax_percent),
  }));

  const subtotalComputed = items.reduce((sum, row) => sum + row.quantity * row.rate, 0);
  const discount = asNumber(draft.discount);
  const taxPercent = asNumber(draft.tax_percent);
  const taxAmount = Math.max(0, subtotalComputed - discount) * (taxPercent / 100);
  const total = subtotalComputed - discount + taxAmount;
  const currency = String(draft.currency ?? "USD").trim().toUpperCase();
  const currencySymbol = currency === "BDT" ? "৳" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";

  return {
    invoiceNumber: String(draft.invoice_number ?? ""),
    invoiceDate: shortDate(draft.invoice_date),
    dueDate: shortDate(draft.due_date),
    poNumber: String(draft.po_number ?? ""),
    terms: String(draft.terms ?? ""),
    signature: String(draft.signature ?? ""),
    paymentInstructions: String(draft.payment_instructions ?? ""),
    logoUrl: sanitizeAssetUrl(draft.logo_url ?? draft.company_logo_url),
    signatureImageUrl: sanitizeAssetUrl(draft.signature_image_url),
    company: {
      name: String(company.name ?? ""),
      address: [company.address, company.address_line2].filter(Boolean).join(", "),
      phone: String(company.phone ?? ""),
      email: String(company.email ?? ""),
    },
    client: {
      name: String(client.name ?? ""),
      address: [client.address, client.address_line2].filter(Boolean).join(", "),
      phone: String(client.phone ?? ""),
      email: String(client.email ?? ""),
    },
    items,
    subtotal: subtotalComputed,
    discount,
    taxPercent,
    taxAmount,
    total,
    currencySymbol,
  };
}

function lineRow(row, idx, theme, currencySymbol) {
  const amount = row.quantity * row.rate * (1 + row.taxPercent / 100);
  const striped = idx % 2 === 1 ? theme.stripe : "bg-white";
  return `
    <tr class="${striped}">
      <td class="invoice-safe-cell border ${theme.border} px-3 py-2 align-top text-sm">${escapeHtml(row.description)}</td>
      <td class="border ${theme.border} px-3 py-2 text-right tabular-nums text-sm">${escapeHtml(row.quantity)}</td>
      <td class="border ${theme.border} px-3 py-2 text-right tabular-nums text-sm">${escapeHtml(money(row.rate, currencySymbol))}</td>
      <td class="border ${theme.border} px-3 py-2 text-right tabular-nums text-sm">${escapeHtml(row.taxPercent.toFixed(2))}%</td>
      <td class="border ${theme.border} px-3 py-2 text-right tabular-nums text-sm font-medium">${escapeHtml(money(amount, currencySymbol))}</td>
    </tr>
  `;
}

export function renderInvoiceStaticHTML(templateId, draft) {
  if (!isKnownInvoiceTemplateId(templateId)) {
    throw new Error("Unknown template id");
  }

  const theme = getTemplateTheme(templateId);
  const data = normalizeDraft(draft);
  const rows = data.items.length
    ? data.items.map((row, idx) => lineRow(row, idx, theme, data.currencySymbol)).join("")
    : `<tr><td colspan="5" class="border ${theme.border} px-3 py-4 text-center text-sm text-zinc-500">No line items</td></tr>`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invoice ${escapeHtml(data.invoiceNumber || templateId)}</title>
    <link rel="stylesheet" href="/app/tailwind.generated.css" />
    <link rel="stylesheet" href="/app/invoice.print.css" />
  </head>
  <body class="bg-zinc-100 px-5 py-8 text-zinc-900">
    <main class="invoice-root mx-auto max-w-4xl bg-white px-10 py-10 shadow-sm">
      <header class="invoice-section mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 class="text-4xl font-bold tracking-tight">INVOICE</h1>
          <p class="invoice-safe-text mt-1 text-sm text-zinc-500">${escapeHtml(templateId)}</p>
          ${
            data.logoUrl
              ? `<img class="invoice-logo mt-3" src="${escapeHtml(data.logoUrl)}" alt="" loading="eager" decoding="sync" referrerpolicy="no-referrer" crossorigin="anonymous" onerror="this.remove()" />`
              : ""
          }
        </div>
        <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt class="font-semibold">Invoice #</dt><dd class="invoice-safe-text">${escapeHtml(data.invoiceNumber)}</dd>
          <dt class="font-semibold">Issue Date</dt><dd class="invoice-safe-text">${escapeHtml(data.invoiceDate)}</dd>
          <dt class="font-semibold">Due Date</dt><dd class="invoice-safe-text">${escapeHtml(data.dueDate)}</dd>
          <dt class="font-semibold">PO #</dt><dd class="invoice-safe-text">${escapeHtml(data.poNumber)}</dd>
        </dl>
      </header>

      <section class="invoice-section mb-8 grid gap-8 sm:grid-cols-2">
        <div class="text-sm">
          <h2 class="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">From</h2>
          <p class="invoice-safe-text font-semibold">${escapeHtml(data.company.name)}</p>
          <p class="invoice-safe-text">${escapeHtml(data.company.address)}</p>
          <p class="invoice-safe-text">${escapeHtml(data.company.phone)}</p>
          <p class="invoice-safe-text">${escapeHtml(data.company.email)}</p>
        </div>
        <div class="text-sm">
          <h2 class="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">Bill To</h2>
          <p class="invoice-safe-text font-semibold">${escapeHtml(data.client.name)}</p>
          <p class="invoice-safe-text">${escapeHtml(data.client.address)}</p>
          <p class="invoice-safe-text">${escapeHtml(data.client.phone)}</p>
          <p class="invoice-safe-text">${escapeHtml(data.client.email)}</p>
        </div>
      </section>

      <section class="invoice-section">
        <table class="invoice-table w-full border-collapse">
          <thead>
            <tr class="text-white ${theme.head}">
              <th class="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">Description</th>
              <th class="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide">Qty</th>
              <th class="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide">Rate</th>
              <th class="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide">Tax</th>
              <th class="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide">Amount</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </section>

      <section class="invoice-section invoice-totals mt-8 ml-auto w-full max-w-sm text-sm">
        <div class="flex justify-between border-b border-zinc-200 py-2"><span class="font-semibold">Subtotal</span><span class="tabular-nums">${escapeHtml(money(data.subtotal, data.currencySymbol))}</span></div>
        <div class="flex justify-between border-b border-zinc-200 py-2"><span class="font-semibold">Discount</span><span class="tabular-nums">-${escapeHtml(money(data.discount, data.currencySymbol))}</span></div>
        <div class="flex justify-between border-b border-zinc-200 py-2"><span class="font-semibold">Tax (${escapeHtml(data.taxPercent.toFixed(2))}%)</span><span class="tabular-nums">${escapeHtml(money(data.taxAmount, data.currencySymbol))}</span></div>
        <div class="mt-1 flex justify-between px-4 py-3 text-base font-bold ${theme.total}"><span>Total</span><span class="tabular-nums">${escapeHtml(money(data.total, data.currencySymbol))}</span></div>
      </section>

      <section class="invoice-section invoice-footer mt-10 grid gap-8 sm:grid-cols-2">
        <div class="text-sm">
          <h2 class="mb-1 font-semibold">Payment Instructions</h2>
          <p class="invoice-safe-text whitespace-pre-wrap text-zinc-700">${escapeHtml(data.paymentInstructions)}</p>
        </div>
        <div class="text-sm">
          <h2 class="mb-1 font-semibold">Terms &amp; Conditions</h2>
          <p class="invoice-safe-text whitespace-pre-wrap text-zinc-700">${escapeHtml(data.terms)}</p>
          <p class="invoice-safe-text mt-6 font-medium">Signature: ${escapeHtml(data.signature)}</p>
          ${
            data.signatureImageUrl
              ? `<img class="invoice-signature-image mt-2" src="${escapeHtml(data.signatureImageUrl)}" alt="" loading="eager" decoding="sync" referrerpolicy="no-referrer" crossorigin="anonymous" onerror="this.remove()" />`
              : ""
          }
        </div>
      </section>
      <div id="pdf-ready" hidden></div>
    </main>
    <script>
      (function () {
        var marker = document.getElementById("pdf-ready");
        if (!marker) return;
        function ready() {
          marker.hidden = false;
          marker.setAttribute("data-ready", "1");
        }
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(ready, ready);
        } else {
          ready();
        }
      })();
    </script>
  </body>
</html>`;
}
