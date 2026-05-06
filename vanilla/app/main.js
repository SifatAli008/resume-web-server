import { INVOICE_TEMPLATE_IDS, isKnownInvoiceTemplateId } from "../features/invoices/constants.js";
import { renderInvoiceTemplate } from "../features/invoices/invoice-template-renderer.js";

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
