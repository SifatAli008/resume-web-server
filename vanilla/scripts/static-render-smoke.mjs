import assert from "node:assert/strict";
import { renderInvoiceStaticHTML } from "../features/invoices/static-invoice-html.js";

const html = renderInvoiceStaticHTML("invoice_fluvo_1", {
  invoice_number: "INV-1",
  company: { name: "FluvoSoft", email: "ops@fluvosoft.com" },
  client: { name: "Long Customer Name ".repeat(6), email: "client@example.com" },
  items: [{ description: "Very long product title ".repeat(20), quantity: 1, rate: 100, tax_percent: 5 }],
});

assert.match(html, /id="pdf-ready"/, "pdf-ready marker must exist");
assert.match(html, /tailwind\.generated\.css/, "tailwind bundle should be linked");
assert.match(html, /invoice\.print\.css/, "print stylesheet should be linked");
assert.doesNotMatch(html, /\/app\/main\.js/, "spa runtime bundle must not be included");
assert.doesNotMatch(html, /\/app\/main\.print\.js/, "legacy print bundle must not be included");
assert.match(html, /document\.fonts\.ready/, "font readiness sync should be present");

console.log("static-render smoke test passed");
