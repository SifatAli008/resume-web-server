function parseNum(value) {
  const n = parseFloat(String(value).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

function lineAmount(line) {
  return line.qty * line.price * (1 + line.taxPercent / 100);
}

export function renderFluvoTemplate(target, options) {
  const theme = {
    shellClass: "mx-auto max-w-4xl bg-white px-10 py-12 text-zinc-800 shadow-sm",
    titleClass: "text-4xl font-bold uppercase tracking-tight sm:text-5xl",
    titleTextClass: "text-zinc-900",
    focusClass: "focus:border-blue-500",
    metaKeyClass: "font-bold text-zinc-900",
    tableClass: "w-full min-w-[560px] border-collapse border text-sm",
    tableHeadClass: "text-white",
    tableHeadBgClass: "bg-zinc-900",
    tableBorderClass: "border-zinc-200",
    rowEvenClass: "bg-white",
    rowOddClass: "bg-zinc-50",
    totalBgClass: "bg-zinc-900 text-white",
    sectionRuleClass: "border-zinc-200",
    hero: null,
    topAccentHtml: "",
    footerAccentHtml: "",
    ...options.theme,
  };

  const state = {
    invoiceNumber: `INV-2026-${String(options.number).padStart(3, "0")}`,
    invoiceDate: "06/05/2026",
    dueDate: "20/05/2026",
    poNumber: `PO-${String(7780 + options.number)}`,
    fromName: "FluvoSoft LLC",
    fromAddress: "221B Green Road, Dhaka 1212",
    fromPhone: "+8801712345678",
    fromEmail: "billing@fluvosoft.com",
    billName: "Acme Industries",
    billAddress: "12 Client Avenue, Chattogram",
    billPhone: "+8801812345678",
    billEmail: "accounts@acme.com",
    discount: "100",
    invoiceTaxPercent: "10",
    payHolder: "FluvoSoft LLC",
    payCard: "3461546793621567",
    payZip: "90026",
    terms: "Payment within 14 days. Thank you for your business.",
    signature: "Jibon Ahmed",
    lines: [
      { id: crypto.randomUUID(), description: "Website Design", qty: "1", price: "1200", taxPercent: "10" },
      { id: crypto.randomUUID(), description: "API Integration", qty: "2", price: "450", taxPercent: "10" },
      { id: crypto.randomUUID(), description: "Maintenance", qty: "1", price: "300", taxPercent: "10" },
    ],
  };

  const field =
    `w-full min-w-0 border-0 border-b border-transparent bg-transparent py-0.5 text-sm text-current placeholder:text-zinc-400 ${theme.focusClass} focus:outline-none`;
  const fieldRight = `${field} text-right tabular-nums`;

  function recomputeTotals() {
    const numericLines = state.lines.map((row) => ({
      qty: parseNum(row.qty),
      price: parseNum(row.price),
      taxPercent: parseNum(row.taxPercent),
    }));

    const subtotal = numericLines.reduce((sum, row) => sum + row.qty * row.price, 0);
    const discount = parseNum(state.discount);
    const taxRate = parseNum(state.invoiceTaxPercent) / 100;
    const taxAmount = (subtotal - discount) * taxRate;
    const total = subtotal - discount + taxAmount;

    target.querySelector("#subtotal-value").textContent = formatMoney(subtotal);
    target.querySelector("#tax-amount-value").textContent = formatMoney(taxAmount);
    target.querySelector("#total-value").textContent = formatMoney(total);

    state.lines.forEach((_, idx) => {
      const amountCell = target.querySelector(`[data-line-amount="${idx}"]`);
      if (!amountCell) return;
      amountCell.textContent = formatMoney(lineAmount(numericLines[idx]));
    });
  }

  function lineRow(line, idx) {
    const rowClass = idx % 2 === 1 ? theme.rowOddClass : theme.rowEvenClass;
    return `
      <tr class="${rowClass}">
        <td class="border ${theme.tableBorderClass} p-2 align-top"><input data-line="description" data-idx="${idx}" aria-label="Line ${idx + 1} description" class="${field}" value="${line.description}" /></td>
        <td class="border ${theme.tableBorderClass} p-2 align-top text-center"><input data-line="qty" data-idx="${idx}" aria-label="Line ${idx + 1} quantity" class="${field} text-center tabular-nums" inputmode="decimal" value="${line.qty}" /></td>
        <td class="border ${theme.tableBorderClass} p-2 align-top"><input data-line="price" data-idx="${idx}" aria-label="Line ${idx + 1} price" class="${fieldRight}" inputmode="decimal" value="${line.price}" /></td>
        <td class="border ${theme.tableBorderClass} p-2 align-top"><div class="flex items-center justify-end gap-0.5"><input data-line="taxPercent" data-idx="${idx}" aria-label="Line ${idx + 1} tax percent" class="${fieldRight} max-w-14" inputmode="decimal" value="${line.taxPercent}" /><span class="text-xs text-zinc-500">%</span></div></td>
        <td data-line-amount="${idx}" class="border ${theme.tableBorderClass} px-2 py-2 text-right align-top tabular-nums font-medium">$0.00</td>
      </tr>
    `;
  }

  function renderHeader() {
    if (theme.hero) {
      return `
        <header class="relative overflow-hidden ${theme.hero.wrapClass}">
          <div class="${theme.hero.bgClass}"></div>
          <div class="relative z-10 grid gap-6 p-6 text-white sm:grid-cols-[1fr_auto] sm:items-start">
            <div class="space-y-1 text-sm">
              <p class="text-xs font-semibold uppercase tracking-[0.2em]">From</p>
              <input id="fromName" class="${field} font-bold" aria-label="Sender name" value="${state.fromName}" />
              <input id="fromAddress" class="${field}" aria-label="Sender address" value="${state.fromAddress}" />
              <input id="fromPhone" class="${field}" aria-label="Sender phone" value="${state.fromPhone}" />
              <input id="fromEmail" class="${field}" aria-label="Sender email" value="${state.fromEmail}" />
            </div>
            <div class="space-y-3 sm:text-right">
              <h1 class="${theme.titleClass} text-white">INVOICE</h1>
              <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs sm:text-sm">
                <dt class="font-bold">INVOICE #</dt><dd><input id="invoiceNumber" class="${fieldRight} sm:text-right" aria-label="Invoice number" value="${state.invoiceNumber}" /></dd>
                <dt class="font-bold">DATE</dt><dd><input id="invoiceDate" class="${fieldRight} sm:text-right" aria-label="Invoice date" value="${state.invoiceDate}" /></dd>
                <dt class="font-bold">DUE DATE</dt><dd><input id="dueDate" class="${fieldRight} sm:text-right" aria-label="Due date" value="${state.dueDate}" /></dd>
                <dt class="font-bold">P.O. #</dt><dd><input id="poNumber" class="${fieldRight} sm:text-right" aria-label="Purchase order number" value="${state.poNumber}" /></dd>
              </dl>
            </div>
          </div>
        </header>
      `;
    }

    return `
      <header class="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <h1 class="${theme.titleClass} ${theme.titleTextClass}">INVOICE</h1>
        <dl class="grid w-full max-w-xs grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm sm:text-right">
          <dt class="${theme.metaKeyClass}">INVOICE #:</dt><dd><input id="invoiceNumber" class="${fieldRight} sm:text-right" aria-label="Invoice number" value="${state.invoiceNumber}" /></dd>
          <dt class="${theme.metaKeyClass}">DATE:</dt><dd><input id="invoiceDate" class="${fieldRight} sm:text-right" aria-label="Invoice date" value="${state.invoiceDate}" /></dd>
          <dt class="${theme.metaKeyClass}">DUE DATE:</dt><dd><input id="dueDate" class="${fieldRight} sm:text-right" aria-label="Due date" value="${state.dueDate}" /></dd>
          <dt class="${theme.metaKeyClass}">P.O. #:</dt><dd><input id="poNumber" class="${fieldRight} sm:text-right" aria-label="Purchase order number" value="${state.poNumber}" /></dd>
        </dl>
      </header>
    `;
  }

  function render() {
    const isHero = Boolean(theme.hero);
    target.innerHTML = `
      <div class="${theme.shellClass}">
        ${theme.topAccentHtml}
        ${renderHeader()}
        <div class="my-8 border-t ${theme.sectionRuleClass}"></div>
        <section class="grid gap-10 sm:grid-cols-2">
          ${isHero ? `
            <div class="space-y-1.5 text-sm">
              <p class="text-sm font-bold">Bill To</p>
              <input id="billName" class="${field} font-bold" aria-label="Bill to name" value="${state.billName}" />
              <input id="billAddress" class="${field}" aria-label="Bill to address" value="${state.billAddress}" />
              <input id="billPhone" class="${field}" aria-label="Bill to phone" value="${state.billPhone}" />
              <input id="billEmail" class="${field}" aria-label="Bill to email" value="${state.billEmail}" />
            </div>
            <div class="space-y-1.5 text-sm">
              <p class="text-sm font-bold uppercase tracking-wide">Payment Method</p>
              <p><span class="font-semibold">Holder Name</span> <input id="payHolder" class="${field} inline-block min-w-32" aria-label="Card holder name" value="${state.payHolder}" /></p>
              <p><span class="font-semibold">Card Number</span> <input id="payCard" class="${field} inline-block min-w-40 tracking-wide" aria-label="Card number" value="${state.payCard}" /></p>
              <p><span class="font-semibold">ZIP Code</span> <input id="payZip" class="${field} inline-block w-24" aria-label="ZIP code" value="${state.payZip}" /></p>
            </div>
          ` : `
            <div class="space-y-1.5 text-sm">
              <p class="text-sm font-bold uppercase tracking-wide">From</p>
              <input id="fromName" class="${field} font-bold" aria-label="Sender name" value="${state.fromName}" />
              <input id="fromAddress" class="${field}" aria-label="Sender address" value="${state.fromAddress}" />
              <input id="fromPhone" class="${field}" aria-label="Sender phone" value="${state.fromPhone}" />
              <input id="fromEmail" class="${field}" aria-label="Sender email" value="${state.fromEmail}" />
            </div>
            <div class="space-y-1.5 text-sm">
              <p class="text-sm font-bold">Bill To</p>
              <input id="billName" class="${field} font-bold" aria-label="Bill to name" value="${state.billName}" />
              <input id="billAddress" class="${field}" aria-label="Bill to address" value="${state.billAddress}" />
              <input id="billPhone" class="${field}" aria-label="Bill to phone" value="${state.billPhone}" />
              <input id="billEmail" class="${field}" aria-label="Bill to email" value="${state.billEmail}" />
            </div>
          `}
        </section>

        <section class="mt-10 space-y-4">
          <div class="overflow-x-auto rounded-sm">
            <table class="${theme.tableClass}">
              <thead>
                <tr class="${theme.tableHeadClass} ${theme.tableHeadBgClass}">
                  <th class="border ${theme.tableBorderClass} px-3 py-3 text-left text-xs font-bold uppercase tracking-wide">Description</th>
                  <th class="w-20 border ${theme.tableBorderClass} px-2 py-3 text-center text-xs font-bold uppercase tracking-wide">QTY</th>
                  <th class="w-28 border ${theme.tableBorderClass} px-2 py-3 text-right text-xs font-bold uppercase tracking-wide">Price</th>
                  <th class="w-24 border ${theme.tableBorderClass} px-2 py-3 text-right text-xs font-bold uppercase tracking-wide">Tax</th>
                  <th class="w-32 border ${theme.tableBorderClass} px-2 py-3 text-right text-xs font-bold uppercase tracking-wide">Amount</th>
                </tr>
              </thead>
              <tbody>${state.lines.map((line, idx) => lineRow(line, idx)).join("")}</tbody>
            </table>
          </div>
        </section>

        <div class="mt-10 flex justify-end"><div class="w-full max-w-sm space-y-0 text-sm">
          <div class="flex justify-between gap-6 border-b ${theme.sectionRuleClass} py-2.5"><span class="font-bold">Subtotal</span><span id="subtotal-value" class="tabular-nums">$0.00</span></div>
          <div class="flex items-center justify-between gap-6 border-b ${theme.sectionRuleClass} py-2.5"><span class="font-bold">Discount</span><span class="inline-flex items-center gap-0.5 tabular-nums"><span aria-hidden>−$</span><input id="discount" class="${fieldRight} max-w-28" inputmode="decimal" aria-label="Discount amount" value="${state.discount}" /></span></div>
          <div class="flex items-center justify-between gap-6 border-b ${theme.sectionRuleClass} py-2.5"><span class="font-bold">Tax (<input id="invoiceTaxPercent" class="inline-block w-9 border-0 border-b border-transparent bg-transparent text-right font-bold ${theme.focusClass} focus:outline-none" inputmode="decimal" aria-label="Invoice tax percent" value="${state.invoiceTaxPercent}" />%)</span><span id="tax-amount-value" class="tabular-nums">$0.00</span></div>
          <div class="mt-1 flex justify-between gap-6 px-4 py-4 text-base font-bold ${theme.totalBgClass}"><span>TOTAL</span><span id="total-value" class="tabular-nums">$0.00</span></div>
        </div></div>

        <section class="mt-14 grid gap-12 lg:grid-cols-2 lg:items-start">
          ${isHero ? `
            <footer class="border-t ${theme.sectionRuleClass} pt-6 text-sm">
              <p class="font-bold">Terms &amp; Conditions</p>
              <textarea id="terms" aria-label="Terms and conditions" class="mt-2 min-h-20 w-full resize-y rounded-sm border-0 bg-transparent text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/25">${state.terms}</textarea>
            </footer>
            <div class="flex flex-col gap-2 lg:min-h-[280px]">
              <p class="text-sm font-bold text-current">Signature</p>
              <input id="signature" type="text" value="${state.signature}" placeholder="Type signature" aria-label="Signature" class="w-full min-w-0 border-0 border-b border-zinc-300 bg-transparent py-1 text-sm text-current placeholder:text-zinc-400 ${theme.focusClass} focus:outline-none" />
            </div>
          ` : `
            <div class="space-y-2.5 text-sm">
              <p class="font-bold">Payment Method</p>
              <p><span class="font-semibold">Holder Name</span> <input id="payHolder" class="${field} inline-block min-w-32" aria-label="Card holder name" value="${state.payHolder}" /></p>
              <p><span class="font-semibold">Card Number</span> <input id="payCard" class="${field} inline-block min-w-40 tracking-wide" aria-label="Card number" value="${state.payCard}" /></p>
              <p><span class="font-semibold">ZIP Code</span> <input id="payZip" class="${field} inline-block w-24" aria-label="ZIP code" value="${state.payZip}" /></p>
            </div>
            <div class="flex flex-col gap-2 lg:min-h-[280px]">
              <p class="text-sm font-bold text-current">Signature</p>
              <input id="signature" type="text" value="${state.signature}" placeholder="Type signature" aria-label="Signature" class="w-full min-w-0 border-0 border-b border-zinc-300 bg-transparent py-1 text-sm text-current placeholder:text-zinc-400 ${theme.focusClass} focus:outline-none" />
            </div>
          `}
        </section>
        ${theme.footerAccentHtml}
      </div>
    `;

    const bind = [
      ["invoiceNumber", "invoiceNumber"], ["invoiceDate", "invoiceDate"], ["dueDate", "dueDate"], ["poNumber", "poNumber"],
      ["fromName", "fromName"], ["fromAddress", "fromAddress"], ["fromPhone", "fromPhone"], ["fromEmail", "fromEmail"],
      ["billName", "billName"], ["billAddress", "billAddress"], ["billPhone", "billPhone"], ["billEmail", "billEmail"],
      ["discount", "discount"], ["invoiceTaxPercent", "invoiceTaxPercent"], ["payHolder", "payHolder"], ["payCard", "payCard"], ["payZip", "payZip"],
      ["terms", "terms"], ["signature", "signature"],
    ];

    bind.forEach(([id, key]) => {
      const el = target.querySelector(`#${id}`);
      if (!el) return;
      el.addEventListener("input", (event) => {
        state[key] = event.target.value;
        recomputeTotals();
      });
    });

    target.querySelectorAll("[data-line]").forEach((el) => {
      el.addEventListener("input", (event) => {
        const idx = Number(event.target.dataset.idx);
        const fieldName = event.target.dataset.line;
        state.lines[idx][fieldName] = event.target.value;
        recomputeTotals();
      });
    });

    recomputeTotals();
  }

  render();
}
