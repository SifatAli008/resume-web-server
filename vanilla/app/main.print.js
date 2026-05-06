"use strict";
(() => {
  // vanilla/features/invoices/constants.js
  var INVOICE_TEMPLATE_IDS = {
    FLUVO_1: "invoice_fluvo_1",
    FLUVO_2: "invoice_fluvo_2",
    FLUVO_3: "invoice_fluvo_3",
    FLUVO_4: "invoice_fluvo_4",
    FLUVO_5: "invoice_fluvo_5",
    FLUVO_6: "invoice_fluvo_6",
    FLUVO_7: "invoice_fluvo_7",
    FLUVO_8: "invoice_fluvo_8",
    FLUVO_9: "invoice_fluvo_9",
    FLUVO_10: "invoice_fluvo_10",
    FLUVO_11: "invoice_fluvo_11",
    FLUVO_12: "invoice_fluvo_12",
    FLUVO_13: "invoice_fluvo_13",
    FLUVO_14: "invoice_fluvo_14",
    FLUVO_15: "invoice_fluvo_15",
    FLUVO_16: "invoice_fluvo_16",
    FLUVO_17: "invoice_fluvo_17",
    FLUVO_18: "invoice_fluvo_18",
    FLUVO_19: "invoice_fluvo_19",
    FLUVO_20: "invoice_fluvo_20"
  };
  var KNOWN_INVOICE_TEMPLATE_IDS = Object.values(INVOICE_TEMPLATE_IDS);
  function isKnownInvoiceTemplateId(id) {
    return KNOWN_INVOICE_TEMPLATE_IDS.includes(id);
  }

  // vanilla/features/invoices/templates/invoice_fluvo_1/template.js
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
  function renderInvoiceFluvo1Template(target) {
    const state = {
      invoiceNumber: "INV-2026-001",
      invoiceDate: "06/05/2026",
      dueDate: "20/05/2026",
      poNumber: "PO-7781",
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
        { id: crypto.randomUUID(), description: "Maintenance", qty: "1", price: "300", taxPercent: "10" }
      ]
    };
    const field = "w-full min-w-0 border-0 border-b border-transparent bg-transparent py-0.5 text-sm text-black placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none";
    const fieldRight = `${field} text-right tabular-nums`;
    function recomputeTotals() {
      const numericLines = state.lines.map((row) => ({
        qty: parseNum(row.qty),
        price: parseNum(row.price),
        taxPercent: parseNum(row.taxPercent)
      }));
      const subtotal = numericLines.reduce((sum, row) => sum + row.qty * row.price, 0);
      const discount = parseNum(state.discount);
      const taxRate = parseNum(state.invoiceTaxPercent) / 100;
      const taxAmount = (subtotal - discount) * taxRate;
      const total = subtotal - discount + taxAmount;
      target.querySelector("#subtotal-value").textContent = formatMoney(subtotal);
      target.querySelector("#tax-amount-value").textContent = formatMoney(taxAmount);
      target.querySelector("#total-value").textContent = formatMoney(total);
      state.lines.forEach((line, idx) => {
        const amountCell = target.querySelector(`[data-line-amount="${idx}"]`);
        if (!amountCell) return;
        amountCell.textContent = formatMoney(lineAmount(numericLines[idx]));
      });
    }
    function lineRow(line, idx) {
      return `
      <tr class="border-b border-zinc-200">
        <td class="py-2 pr-2 align-top">
          <input data-line="description" data-idx="${idx}" aria-label="Line ${idx + 1} description" class="${field}" value="${line.description}" />
        </td>
        <td class="py-2 pr-2 align-top">
          <input data-line="qty" data-idx="${idx}" aria-label="Line ${idx + 1} quantity" class="${fieldRight}" inputmode="decimal" value="${line.qty}" />
        </td>
        <td class="py-2 pr-2 align-top">
          <input data-line="price" data-idx="${idx}" aria-label="Line ${idx + 1} price" class="${fieldRight}" inputmode="decimal" value="${line.price}" />
        </td>
        <td class="py-2 pr-2 align-top">
          <div class="flex items-center justify-end gap-0.5">
            <input data-line="taxPercent" data-idx="${idx}" aria-label="Line ${idx + 1} tax percent" class="${fieldRight} max-w-14" inputmode="decimal" value="${line.taxPercent}" />
            <span class="text-zinc-500">%</span>
          </div>
        </td>
        <td data-line-amount="${idx}" class="py-2 text-right align-top tabular-nums text-black">$0.00</td>
      </tr>
    `;
    }
    function render2() {
      target.innerHTML = `
      <div class="mx-auto max-w-4xl border-2 border-blue-500 bg-white p-8 text-black shadow-sm">
        <header class="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <h1 class="text-3xl font-bold tracking-tight text-black sm:text-4xl">INVOICE</h1>
          <dl class="grid w-full max-w-xs grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm sm:text-right">
            <dt class="font-bold text-black">INVOICE #</dt><dd><input id="invoiceNumber" class="${fieldRight} sm:text-right" aria-label="Invoice number" value="${state.invoiceNumber}" /></dd>
            <dt class="font-bold text-black">DATE</dt><dd><input id="invoiceDate" class="${fieldRight} sm:text-right" aria-label="Invoice date" value="${state.invoiceDate}" /></dd>
            <dt class="font-bold text-black">DUE DATE</dt><dd><input id="dueDate" class="${fieldRight} sm:text-right" aria-label="Due date" value="${state.dueDate}" /></dd>
            <dt class="font-bold text-black">P.O. #</dt><dd><input id="poNumber" class="${fieldRight} sm:text-right" aria-label="Purchase order number" value="${state.poNumber}" /></dd>
          </dl>
        </header>
        <div class="my-6 border-t border-zinc-300"></div>
        <section class="grid gap-8 sm:grid-cols-2">
          <div class="space-y-1 text-sm">
            <p class="text-xs font-bold uppercase tracking-wide text-black">From</p>
            <input id="fromName" class="${field} font-bold" aria-label="Sender name" value="${state.fromName}" />
            <input id="fromAddress" class="${field}" aria-label="Sender address" value="${state.fromAddress}" />
            <input id="fromPhone" class="${field}" aria-label="Sender phone" value="${state.fromPhone}" />
            <input id="fromEmail" class="${field}" aria-label="Sender email" value="${state.fromEmail}" />
          </div>
          <div class="space-y-1 text-sm">
            <p class="text-xs font-bold text-black">Bill To</p>
            <input id="billName" class="${field} font-bold" aria-label="Bill to name" value="${state.billName}" />
            <input id="billAddress" class="${field}" aria-label="Bill to address" value="${state.billAddress}" />
            <input id="billPhone" class="${field}" aria-label="Bill to phone" value="${state.billPhone}" />
            <input id="billEmail" class="${field}" aria-label="Bill to email" value="${state.billEmail}" />
          </div>
        </section>
        <div class="my-6 border-t border-zinc-300"></div>
        <section class="space-y-3">
          <div class="overflow-x-auto">
            <table class="w-full min-w-[520px] border-collapse text-sm">
              <thead><tr class="border-b border-zinc-300 text-left text-black"><th class="pb-2 pr-2 font-bold">Description</th><th class="w-20 pb-2 pr-2 text-right font-bold">QTY</th><th class="w-28 pb-2 pr-2 text-right font-bold">Price</th><th class="w-24 pb-2 pr-2 text-right font-bold">Tax</th><th class="w-32 pb-2 text-right font-bold">Amount</th></tr></thead>
              <tbody id="line-items-body">${state.lines.map((line, idx) => lineRow(line, idx)).join("")}</tbody>
            </table>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button id="add-line-btn" type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-black hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Add line</button>
            <button id="remove-line-btn" type="button" class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Remove last line</button>
          </div>
        </section>
        <div class="mt-8 flex justify-end">
          <div class="w-full max-w-xs space-y-2 text-sm">
            <div class="flex justify-between gap-4"><span class="font-bold text-black">Subtotal</span><span id="subtotal-value" class="tabular-nums text-black">$0.00</span></div>
            <div class="flex items-center justify-between gap-4"><span class="font-bold text-black">Discount</span><span class="inline-flex items-center gap-0.5 tabular-nums text-black"><span aria-hidden>-</span><input id="discount" class="${fieldRight} max-w-28" aria-label="Discount amount" inputmode="decimal" value="${state.discount}" /></span></div>
            <div class="flex items-center justify-between gap-4"><span class="font-bold text-black">Tax (<input id="invoiceTaxPercent" class="inline-block w-10 border-0 border-b border-transparent bg-transparent text-right font-bold focus:border-blue-500 focus:outline-none" aria-label="Invoice tax percent" inputmode="decimal" value="${state.invoiceTaxPercent}" />%)</span><span id="tax-amount-value" class="tabular-nums text-black">$0.00</span></div>
            <div class="my-2 border-t-2 border-zinc-900"></div>
            <div class="flex justify-between gap-4 text-base font-bold text-black"><span>TOTAL</span><span id="total-value" class="tabular-nums">$0.00</span></div>
            <div class="mt-2 border-t border-zinc-300"></div>
          </div>
        </div>
        <section class="mt-10 grid gap-10 sm:grid-cols-2">
          <div class="space-y-2 text-sm">
            <p class="font-bold text-black">Payment Method</p>
            <p class="text-zinc-600"><span class="font-medium text-black">Holder Name</span> <input id="payHolder" class="${field} inline-block min-w-32" aria-label="Card holder name" value="${state.payHolder}" /></p>
            <p class="text-zinc-600"><span class="font-medium text-black">Card Number</span> <input id="payCard" class="${field} inline-block min-w-40 tracking-wide" aria-label="Card number" value="${state.payCard}" /></p>
            <p class="text-zinc-600"><span class="font-medium text-black">ZIP Code</span> <input id="payZip" class="${field} inline-block w-24" aria-label="ZIP code" value="${state.payZip}" /></p>
          </div>
          <div class="flex flex-col gap-2">
            <p class="text-sm font-bold text-current">Signature</p>
            <input id="signature" type="text" aria-label="Signature" placeholder="Type signature" class="w-full min-w-0 border-0 border-b border-zinc-300 bg-transparent py-1 text-sm text-current placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none" value="${state.signature}" />
          </div>
        </section>
        <footer class="mt-10 border-t border-zinc-200 pt-6 text-sm">
          <p class="font-bold text-black">Terms &amp; Conditions</p>
          <textarea id="terms" aria-label="Terms and conditions" class="mt-2 min-h-16 w-full resize-y rounded-sm border-0 bg-transparent text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30">${state.terms}</textarea>
        </footer>
      </div>
    `;
      const bind = [
        ["invoiceNumber", "invoiceNumber"],
        ["invoiceDate", "invoiceDate"],
        ["dueDate", "dueDate"],
        ["poNumber", "poNumber"],
        ["fromName", "fromName"],
        ["fromAddress", "fromAddress"],
        ["fromPhone", "fromPhone"],
        ["fromEmail", "fromEmail"],
        ["billName", "billName"],
        ["billAddress", "billAddress"],
        ["billPhone", "billPhone"],
        ["billEmail", "billEmail"],
        ["discount", "discount"],
        ["invoiceTaxPercent", "invoiceTaxPercent"],
        ["payHolder", "payHolder"],
        ["payCard", "payCard"],
        ["payZip", "payZip"],
        ["terms", "terms"],
        ["signature", "signature"]
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
      target.querySelector("#add-line-btn").addEventListener("click", () => {
        state.lines.push({
          id: crypto.randomUUID(),
          description: "",
          qty: "1",
          price: "0",
          taxPercent: state.invoiceTaxPercent || "0"
        });
        render2();
      });
      target.querySelector("#remove-line-btn").addEventListener("click", () => {
        if (state.lines.length <= 1) return;
        state.lines = state.lines.slice(0, -1);
        render2();
      });
      recomputeTotals();
    }
    render2();
  }

  // vanilla/features/invoices/templates/shared-template.js
  function parseNum2(value) {
    const n = parseFloat(String(value).replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  function formatMoney2(value) {
    return `$${value.toFixed(2)}`;
  }
  function lineAmount2(line) {
    return line.qty * line.price * (1 + line.taxPercent / 100);
  }
  function renderFluvoTemplate(target, options) {
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
      ...options.theme
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
        { id: crypto.randomUUID(), description: "Maintenance", qty: "1", price: "300", taxPercent: "10" }
      ]
    };
    const field = `w-full min-w-0 border-0 border-b border-transparent bg-transparent py-0.5 text-sm text-current placeholder:text-zinc-400 ${theme.focusClass} focus:outline-none`;
    const fieldRight = `${field} text-right tabular-nums`;
    function recomputeTotals() {
      const numericLines = state.lines.map((row) => ({
        qty: parseNum2(row.qty),
        price: parseNum2(row.price),
        taxPercent: parseNum2(row.taxPercent)
      }));
      const subtotal = numericLines.reduce((sum, row) => sum + row.qty * row.price, 0);
      const discount = parseNum2(state.discount);
      const taxRate = parseNum2(state.invoiceTaxPercent) / 100;
      const taxAmount = (subtotal - discount) * taxRate;
      const total = subtotal - discount + taxAmount;
      target.querySelector("#subtotal-value").textContent = formatMoney2(subtotal);
      target.querySelector("#tax-amount-value").textContent = formatMoney2(taxAmount);
      target.querySelector("#total-value").textContent = formatMoney2(total);
      state.lines.forEach((_, idx) => {
        const amountCell = target.querySelector(`[data-line-amount="${idx}"]`);
        if (!amountCell) return;
        amountCell.textContent = formatMoney2(lineAmount2(numericLines[idx]));
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
    function render2() {
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
          <div class="flex items-center justify-between gap-6 border-b ${theme.sectionRuleClass} py-2.5"><span class="font-bold">Discount</span><span class="inline-flex items-center gap-0.5 tabular-nums"><span aria-hidden>\u2212$</span><input id="discount" class="${fieldRight} max-w-28" inputmode="decimal" aria-label="Discount amount" value="${state.discount}" /></span></div>
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
        ["invoiceNumber", "invoiceNumber"],
        ["invoiceDate", "invoiceDate"],
        ["dueDate", "dueDate"],
        ["poNumber", "poNumber"],
        ["fromName", "fromName"],
        ["fromAddress", "fromAddress"],
        ["fromPhone", "fromPhone"],
        ["fromEmail", "fromEmail"],
        ["billName", "billName"],
        ["billAddress", "billAddress"],
        ["billPhone", "billPhone"],
        ["billEmail", "billEmail"],
        ["discount", "discount"],
        ["invoiceTaxPercent", "invoiceTaxPercent"],
        ["payHolder", "payHolder"],
        ["payCard", "payCard"],
        ["payZip", "payZip"],
        ["terms", "terms"],
        ["signature", "signature"]
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
    render2();
  }

  // vanilla/features/invoices/templates/invoice_fluvo_2/template.js
  function renderInvoiceFluvo2Template(target) {
    renderFluvoTemplate(target, {
      number: 2,
      theme: { shellClass: "mx-auto max-w-4xl bg-white px-10 py-12 text-zinc-800 shadow-sm", titleTextClass: "text-teal-500", focusClass: "focus:border-teal-500", tableHeadBgClass: "bg-teal-500", tableBorderClass: "border-teal-500", rowOddClass: "bg-teal-50/40", totalBgClass: "bg-teal-500 text-white" }
    });
  }

  // vanilla/features/invoices/templates/invoice_fluvo_3/template.js
  function renderInvoiceFluvo3Template(target) {
    renderFluvoTemplate(target, {
      number: 3,
      theme: { shellClass: "mx-auto flex max-w-5xl bg-white shadow-sm", titleTextClass: "text-red-700", focusClass: "focus:border-red-500", tableHeadBgClass: "bg-red-700", tableBorderClass: "border-red-300", rowOddClass: "bg-red-50/60", totalBgClass: "bg-red-700 text-white", topAccentHtml: '<div class="w-7 bg-red-900 bg-[linear-gradient(45deg,rgba(255,255,255,0.08)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.08)_75%,transparent_75%,transparent)] bg-[length:16px_16px]"></div><div class="flex-1 px-8 py-10">', footerAccentHtml: "</div>" }
    });
  }

  // vanilla/features/invoices/templates/invoice_fluvo_4/template.js
  function renderInvoiceFluvo4Template(target) {
    renderFluvoTemplate(target, {
      number: 4,
      theme: { shellClass: "mx-auto flex max-w-5xl bg-white shadow-sm", titleTextClass: "text-green-500", focusClass: "focus:border-green-500", tableHeadBgClass: "bg-green-500", tableBorderClass: "border-green-200", rowOddClass: "bg-green-50/70", totalBgClass: "bg-green-500 text-white", topAccentHtml: '<div class="relative w-24 overflow-hidden bg-white"><div class="absolute -left-24 top-4 h-80 w-56 rotate-[-14deg] rounded-[42%_58%_55%_45%/48%_42%_58%_52%] bg-gradient-to-br from-green-300/75 via-green-400/30 to-transparent"></div><div class="absolute -left-20 bottom-8 h-72 w-52 rotate-[16deg] rounded-[52%_48%_42%_58%/50%_55%_45%_50%] bg-gradient-to-tr from-sky-200/80 via-sky-300/40 to-transparent"></div></div><div class="flex-1 px-8 py-10">', footerAccentHtml: "</div>" }
    });
  }

  // vanilla/features/invoices/templates/invoice_fluvo_5/template.js
  function renderInvoiceFluvo5Template(target) {
    renderFluvoTemplate(target, {
      number: 5,
      theme: { shellClass: "mx-auto max-w-4xl overflow-hidden bg-white shadow-sm", titleTextClass: "text-sky-600", focusClass: "focus:border-sky-500", tableHeadBgClass: "bg-sky-600", tableBorderClass: "border-sky-200", rowOddClass: "bg-sky-50/70", totalBgClass: "bg-sky-600 text-white", topAccentHtml: '<div class="relative"><div class="absolute right-0 top-0 h-44 w-56 bg-gradient-to-bl from-sky-200/90 via-indigo-100/40 to-transparent [clip-path:polygon(100%_0,100%_78%,8%_0)]"></div><div class="absolute bottom-0 right-0 h-56 w-72 bg-gradient-to-tr from-transparent via-blue-200/70 to-blue-300/30 [clip-path:polygon(92%_100%,100%_100%,100%_12%,55%_100%)]"></div></div><div class="px-10 py-12">', footerAccentHtml: "</div>" }
    });
  }

  // vanilla/features/invoices/templates/invoice_fluvo_6/template.js
  function renderInvoiceFluvo6Template(target) {
    renderFluvoTemplate(target, {
      number: 6,
      theme: { shellClass: "mx-auto max-w-4xl bg-white shadow-sm", titleTextClass: "text-white", focusClass: "focus:border-amber-500", tableHeadBgClass: "bg-[#232323]", tableBorderClass: "border-amber-200", rowOddClass: "bg-amber-50", totalBgClass: "bg-amber-500 text-[#232323]", topAccentHtml: '<div class="flex min-h-[92px] items-stretch"><div class="flex min-w-[15rem] items-center bg-[#232323] px-6 py-4 text-3xl font-bold uppercase tracking-wide text-white [clip-path:polygon(0_0,86%_0,100%_100%,0_100%)]">INVOICE</div><div class="h-16 w-28 bg-amber-500 [clip-path:polygon(28%_0,100%_0,100%_100%,0_55%)]"></div></div><div class="px-10 py-12">', footerAccentHtml: '<div class="mt-8 flex h-3 w-full"><div class="flex-1 bg-[#232323] [clip-path:polygon(0_0,100%_0,93%_100%,0_100%)]"></div><div class="w-44 bg-amber-500 [clip-path:polygon(7%_0,100%_0,100%_100%,0_100%)]"></div></div></div>' }
    });
  }

  // vanilla/features/invoices/templates/invoice_fluvo_7/template.js
  function renderInvoiceFluvo7Template(target) {
    renderFluvoTemplate(target, {
      number: 7,
      theme: { shellClass: "mx-auto max-w-4xl bg-white px-10 py-12 text-zinc-800 shadow-sm", titleTextClass: "text-[#00333d]", focusClass: "focus:border-cyan-500", tableHeadBgClass: "bg-[#00333d]", tableBorderClass: "border-cyan-200", rowOddClass: "bg-zinc-100", totalBgClass: "bg-[#00333d] text-white", topAccentHtml: '<div class="mb-6"><div class="inline-flex min-w-[15rem] items-center bg-[#00333d] px-6 py-4 text-3xl font-bold uppercase tracking-wide text-white [clip-path:polygon(0_0,88%_0,100%_100%,0_100%)]">INVOICE</div><div class="h-2 w-48 bg-gradient-to-r from-cyan-200 to-cyan-400 [clip-path:polygon(0_0,72%_0,100%_100%,0_100%)]"></div></div>' }
    });
  }

  // vanilla/features/invoices/templates/invoice_fluvo_8/template.js
  function renderInvoiceFluvo8Template(target) {
    renderFluvoTemplate(target, {
      number: 8,
      theme: { shellClass: "mx-auto max-w-4xl bg-white px-10 py-12 text-zinc-800 shadow-sm", titleTextClass: "text-[#6b6ba3]", focusClass: "focus:border-violet-500", tableHeadBgClass: "bg-[#6b6ba3]", tableBorderClass: "border-violet-200", rowOddClass: "bg-zinc-100", totalBgClass: "bg-[#6b6ba3] text-white" }
    });
  }

  // vanilla/features/invoices/templates/invoice_fluvo_9/template.js
  function renderInvoiceFluvo9Template(target) {
    renderFluvoTemplate(target, {
      number: 9,
      theme: { shellClass: "mx-auto max-w-4xl bg-white px-10 py-12 text-zinc-900 shadow-sm", titleTextClass: "text-black", focusClass: "focus:border-black", tableHeadBgClass: "bg-black", tableBorderClass: "border-black/30", rowOddClass: "bg-zinc-100", totalBgClass: "bg-black text-white", sectionRuleClass: "border-black/20" }
    });
  }

  // vanilla/features/invoices/templates/invoice_fluvo_10/template.js
  function renderInvoiceFluvo10Template(target) {
    renderFluvoTemplate(target, {
      number: 10,
      theme: { shellClass: "mx-auto max-w-4xl overflow-hidden rounded-xl bg-white px-10 py-12 text-zinc-800 shadow-sm", titleTextClass: "text-[#e8502d]", focusClass: "focus:border-[#e8502d]", tableHeadBgClass: "bg-[#e8502d]", tableBorderClass: "border-orange-200", rowOddClass: "bg-orange-50", totalBgClass: "bg-[#e8502d] text-white" }
    });
  }

  // vanilla/features/invoices/templates/invoice_fluvo_11/template.js
  function renderInvoiceFluvo11Template(target) {
    renderFluvoTemplate(target, {
      number: 11,
      theme: { shellClass: "mx-auto max-w-4xl overflow-hidden bg-white px-10 py-12 shadow-sm", focusClass: "focus:border-rose-400", tableHeadBgClass: "bg-rose-700", tableBorderClass: "border-rose-200", rowOddClass: "bg-rose-50", totalBgClass: "bg-rose-700 text-white", hero: { wrapClass: "min-h-[11.5rem]", bgClass: "absolute inset-0 bg-[#c45c6a] bg-[radial-gradient(ellipse_120%_80%_at_20%_30%,rgba(255,255,255,0.12)_0%,transparent_50%),radial-gradient(ellipse_80%_60%_at_80%_70%,rgba(0,0,0,0.08)_0%,transparent_45%)]" }, footerAccentHtml: '<div class="h-2 bg-[repeating-linear-gradient(-45deg,#6b2d2d,#6b2d2d_5px,#fff_5px,#fff_10px)]"></div>' }
    });
  }

  // vanilla/features/invoices/templates/invoice_fluvo_12/template.js
  function renderInvoiceFluvo12Template(target) {
    renderFluvoTemplate(target, {
      number: 12,
      theme: { shellClass: "mx-auto max-w-4xl overflow-hidden bg-white px-10 py-12 shadow-sm", focusClass: "focus:border-zinc-400", tableHeadBgClass: "bg-zinc-900", tableBorderClass: "border-zinc-300", rowOddClass: "bg-zinc-50", totalBgClass: "bg-zinc-900 text-white", hero: { wrapClass: "min-h-[11.5rem]", bgClass: "absolute inset-0 bg-[#0a0a0a] bg-[radial-gradient(ellipse_120%_80%_at_20%_30%,rgba(255,255,255,0.06)_0%,transparent_50%),radial-gradient(ellipse_80%_60%_at_80%_70%,rgba(255,255,255,0.04)_0%,transparent_45%)]" }, footerAccentHtml: '<div class="h-2 bg-[repeating-linear-gradient(-45deg,#0a0a0a,#0a0a0a_5px,#fff_5px,#fff_10px)]"></div>' }
    });
  }

  // vanilla/features/invoices/templates/invoice_fluvo_13/template.js
  function renderInvoiceFluvo13Template(target) {
    renderFluvoTemplate(target, {
      number: 13,
      theme: { shellClass: "mx-auto max-w-4xl overflow-hidden bg-white px-10 py-12 shadow-sm", focusClass: "focus:border-blue-400", tableHeadBgClass: "bg-blue-700", tableBorderClass: "border-blue-200", rowOddClass: "bg-blue-50", totalBgClass: "bg-blue-700 text-white", hero: { wrapClass: "min-h-[11.5rem]", bgClass: "absolute inset-0 bg-[#1e40af] bg-[radial-gradient(ellipse_120%_80%_at_20%_30%,rgba(255,255,255,0.14)_0%,transparent_50%),radial-gradient(ellipse_80%_60%_at_80%_70%,rgba(0,0,0,0.12)_0%,transparent_45%)]" }, footerAccentHtml: '<div class="h-2 bg-[repeating-linear-gradient(-45deg,#1e40af,#1e40af_5px,#fff_5px,#fff_10px)]"></div>' }
    });
  }

  // vanilla/features/invoices/templates/invoice_fluvo_14/template.js
  function renderInvoiceFluvo14Template(target) {
    renderFluvoTemplate(target, {
      number: 14,
      theme: { shellClass: "mx-auto max-w-4xl overflow-hidden bg-white px-10 py-12 shadow-sm", focusClass: "focus:border-green-400", tableHeadBgClass: "bg-green-700", tableBorderClass: "border-green-200", rowOddClass: "bg-green-50", totalBgClass: "bg-green-700 text-white", hero: { wrapClass: "min-h-[11.5rem]", bgClass: "absolute inset-0 bg-[#166534] bg-[radial-gradient(ellipse_120%_80%_at_20%_30%,rgba(255,255,255,0.1)_0%,transparent_50%),radial-gradient(ellipse_80%_60%_at_80%_70%,rgba(0,0,0,0.1)_0%,transparent_45%)]" }, footerAccentHtml: '<div class="h-2 bg-[repeating-linear-gradient(-45deg,#166534,#166534_5px,#fff_5px,#fff_10px)]"></div>' }
    });
  }

  // vanilla/features/invoices/templates/invoice_fluvo_15/template.js
  function renderInvoiceFluvo15Template(target) {
    renderFluvoTemplate(target, {
      number: 15,
      theme: { shellClass: "mx-auto max-w-4xl overflow-hidden bg-white px-10 py-12 shadow-sm", focusClass: "focus:border-zinc-400", tableHeadBgClass: "bg-zinc-800", tableBorderClass: "border-zinc-300", rowOddClass: "bg-zinc-50", totalBgClass: "bg-zinc-800 text-white", hero: { wrapClass: "min-h-[12.5rem]", bgClass: "absolute inset-0 bg-[#262626]" }, footerAccentHtml: '<div class="relative h-3 bg-[#1c1c1c]"><div class="absolute right-0 top-0 h-full w-16 rounded-bl-full bg-gradient-to-br from-transparent via-white/15 to-white/25"></div></div>' }
    });
  }

  // vanilla/features/invoices/templates/invoice_fluvo_16/template.js
  function renderInvoiceFluvo16Template(target) {
    renderFluvoTemplate(target, {
      number: 16,
      theme: { shellClass: "mx-auto max-w-4xl overflow-hidden bg-white px-10 py-12 shadow-sm", focusClass: "focus:border-blue-400", tableHeadBgClass: "bg-blue-800", tableBorderClass: "border-blue-200", rowOddClass: "bg-blue-50", totalBgClass: "bg-blue-800 text-white", hero: { wrapClass: "min-h-[12.5rem]", bgClass: "absolute inset-0 bg-[#1e40af]" }, footerAccentHtml: '<div class="relative h-3 bg-[#1e40af]"><div class="absolute right-0 top-0 h-full w-16 rounded-bl-full bg-gradient-to-br from-transparent via-white/15 to-white/25"></div></div>' }
    });
  }

  // vanilla/features/invoices/templates/invoice_fluvo_17/template.js
  function renderInvoiceFluvo17Template(target) {
    renderFluvoTemplate(target, {
      number: 17,
      theme: { shellClass: "mx-auto max-w-4xl overflow-hidden bg-white px-10 py-12 shadow-sm", focusClass: "focus:border-teal-400", tableHeadBgClass: "bg-teal-700", tableBorderClass: "border-teal-200", rowOddClass: "bg-teal-50", totalBgClass: "bg-teal-700 text-white", hero: { wrapClass: "min-h-[12.5rem]", bgClass: "absolute inset-0 bg-[#115e59]" }, footerAccentHtml: '<div class="relative h-3 bg-[#115e59]"><div class="absolute right-0 top-0 h-full w-16 rounded-bl-full bg-gradient-to-br from-transparent via-white/15 to-white/25"></div></div>' }
    });
  }

  // vanilla/features/invoices/templates/invoice_fluvo_18/template.js
  function renderInvoiceFluvo18Template(target) {
    renderFluvoTemplate(target, {
      number: 18,
      theme: { shellClass: "mx-auto max-w-4xl overflow-hidden bg-white px-10 py-12 shadow-sm", focusClass: "focus:border-purple-400", tableHeadBgClass: "bg-purple-700", tableBorderClass: "border-purple-200", rowOddClass: "bg-purple-50", totalBgClass: "bg-purple-700 text-white", hero: { wrapClass: "min-h-[12.5rem]", bgClass: "absolute inset-0 bg-[#6b21a8]" }, footerAccentHtml: '<div class="relative h-3 bg-[#6b21a8]"><div class="absolute right-0 top-0 h-full w-16 rounded-bl-full bg-gradient-to-br from-transparent via-white/15 to-white/25"></div></div>' }
    });
  }

  // vanilla/features/invoices/templates/invoice_fluvo_19/template.js
  function renderInvoiceFluvo19Template(target) {
    renderFluvoTemplate(target, {
      number: 19,
      theme: { shellClass: "mx-auto max-w-4xl border-4 border-black bg-[#fff8e7] px-8 py-8 text-zinc-900 shadow-[8px_8px_0_#141414]", titleClass: "inline-block border-[3px] border-black bg-yellow-300 px-3 py-1 text-3xl font-extrabold uppercase tracking-wide shadow-[4px_4px_0_#141414]", titleTextClass: "text-black", focusClass: "focus:border-blue-700", tableHeadBgClass: "bg-[#0055bf]", tableBorderClass: "border-black", rowOddClass: "bg-[#fff3c4]", totalBgClass: "bg-[#e3000b] text-white border-[3px] border-black shadow-[4px_4px_0_#141414]", topAccentHtml: '<div class="mb-6 h-[18px] border-b-[3px] border-black bg-[#00a550] bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0.35)_22%,rgba(0,0,0,0.12)_23%,rgba(0,0,0,0.12)_45%,transparent_46%)] bg-[length:16px_16px]"></div>', sectionRuleClass: "border-black/40" }
    });
  }

  // vanilla/features/invoices/templates/invoice_fluvo_20/template.js
  function renderInvoiceFluvo20Template(target) {
    renderFluvoTemplate(target, {
      number: 20,
      theme: { shellClass: "mx-auto max-w-4xl bg-white px-10 py-12 text-zinc-800 shadow-sm", titleTextClass: "text-zinc-900", focusClass: "focus:border-indigo-500", tableHeadBgClass: "bg-zinc-900", tableBorderClass: "border-zinc-300", rowOddClass: "bg-zinc-50", totalBgClass: "bg-zinc-900 text-white", topAccentHtml: '<p class="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">pixel crisp edition</p>' }
    });
  }

  // vanilla/features/invoices/invoice-template-renderer.js
  function renderInvoiceTemplate(target, templateId) {
    switch (templateId) {
      case INVOICE_TEMPLATE_IDS.FLUVO_1:
        renderInvoiceFluvo1Template(target);
        break;
      case INVOICE_TEMPLATE_IDS.FLUVO_2:
        renderInvoiceFluvo2Template(target);
        break;
      case INVOICE_TEMPLATE_IDS.FLUVO_3:
        renderInvoiceFluvo3Template(target);
        break;
      case INVOICE_TEMPLATE_IDS.FLUVO_4:
        renderInvoiceFluvo4Template(target);
        break;
      case INVOICE_TEMPLATE_IDS.FLUVO_5:
        renderInvoiceFluvo5Template(target);
        break;
      case INVOICE_TEMPLATE_IDS.FLUVO_6:
        renderInvoiceFluvo6Template(target);
        break;
      case INVOICE_TEMPLATE_IDS.FLUVO_7:
        renderInvoiceFluvo7Template(target);
        break;
      case INVOICE_TEMPLATE_IDS.FLUVO_8:
        renderInvoiceFluvo8Template(target);
        break;
      case INVOICE_TEMPLATE_IDS.FLUVO_9:
        renderInvoiceFluvo9Template(target);
        break;
      case INVOICE_TEMPLATE_IDS.FLUVO_10:
        renderInvoiceFluvo10Template(target);
        break;
      case INVOICE_TEMPLATE_IDS.FLUVO_11:
        renderInvoiceFluvo11Template(target);
        break;
      case INVOICE_TEMPLATE_IDS.FLUVO_12:
        renderInvoiceFluvo12Template(target);
        break;
      case INVOICE_TEMPLATE_IDS.FLUVO_13:
        renderInvoiceFluvo13Template(target);
        break;
      case INVOICE_TEMPLATE_IDS.FLUVO_14:
        renderInvoiceFluvo14Template(target);
        break;
      case INVOICE_TEMPLATE_IDS.FLUVO_15:
        renderInvoiceFluvo15Template(target);
        break;
      case INVOICE_TEMPLATE_IDS.FLUVO_16:
        renderInvoiceFluvo16Template(target);
        break;
      case INVOICE_TEMPLATE_IDS.FLUVO_17:
        renderInvoiceFluvo17Template(target);
        break;
      case INVOICE_TEMPLATE_IDS.FLUVO_18:
        renderInvoiceFluvo18Template(target);
        break;
      case INVOICE_TEMPLATE_IDS.FLUVO_19:
        renderInvoiceFluvo19Template(target);
        break;
      case INVOICE_TEMPLATE_IDS.FLUVO_20:
        renderInvoiceFluvo20Template(target);
        break;
      default:
        target.innerHTML = `
        <section class="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-sm">
          <h1 class="text-xl font-semibold text-zinc-900">Template not migrated yet</h1>
          <p class="mt-2 text-sm text-zinc-600">
            This vanilla port keeps architecture intact. Next step is migrating <code>${templateId}</code>.
          </p>
        </section>
      `;
    }
  }

  // vanilla/app/main.js
  function resolveTemplateId() {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get("templateId");
    if (fromQuery && isKnownInvoiceTemplateId(fromQuery)) return fromQuery;
    const parts = window.location.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex((p) => p === "invoice");
    const fromPath = idx >= 0 ? parts[idx + 1] : null;
    if (fromPath && isKnownInvoiceTemplateId(fromPath)) return fromPath;
    return INVOICE_TEMPLATE_IDS.FLUVO_4;
  }
  function render() {
    const app = document.getElementById("app");
    if (!app) return;
    const templateId = resolveTemplateId();
    app.innerHTML = `
    <div id="invoice-download-target"></div>
  `;
    const target = document.getElementById("invoice-download-target");
    if (!target) return;
    renderInvoiceTemplate(target, templateId);
  }
  render();
})();
