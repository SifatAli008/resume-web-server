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

export function renderInvoiceFluvo1Template(target) {
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
      { id: crypto.randomUUID(), description: "Maintenance", qty: "1", price: "300", taxPercent: "10" },
    ],
  };

  const field =
    "w-full min-w-0 border-0 border-b border-transparent bg-transparent py-0.5 text-sm text-black placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none";
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

  function render() {
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

    target.querySelector("#add-line-btn").addEventListener("click", () => {
      state.lines.push({
        id: crypto.randomUUID(),
        description: "",
        qty: "1",
        price: "0",
        taxPercent: state.invoiceTaxPercent || "0",
      });
      render();
    });

    target.querySelector("#remove-line-btn").addEventListener("click", () => {
      if (state.lines.length <= 1) return;
      state.lines = state.lines.slice(0, -1);
      render();
    });

    recomputeTotals();
  }

  render();
}
