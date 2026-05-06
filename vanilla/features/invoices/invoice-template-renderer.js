import { INVOICE_TEMPLATE_IDS } from "./constants.js";
import { renderInvoiceFluvo1Template } from "./templates/invoice_fluvo_1/template.js";
import { renderInvoiceFluvo2Template } from "./templates/invoice_fluvo_2/template.js";
import { renderInvoiceFluvo3Template } from "./templates/invoice_fluvo_3/template.js";
import { renderInvoiceFluvo4Template } from "./templates/invoice_fluvo_4/template.js";
import { renderInvoiceFluvo5Template } from "./templates/invoice_fluvo_5/template.js";
import { renderInvoiceFluvo6Template } from "./templates/invoice_fluvo_6/template.js";
import { renderInvoiceFluvo7Template } from "./templates/invoice_fluvo_7/template.js";
import { renderInvoiceFluvo8Template } from "./templates/invoice_fluvo_8/template.js";
import { renderInvoiceFluvo9Template } from "./templates/invoice_fluvo_9/template.js";
import { renderInvoiceFluvo10Template } from "./templates/invoice_fluvo_10/template.js";
import { renderInvoiceFluvo11Template } from "./templates/invoice_fluvo_11/template.js";
import { renderInvoiceFluvo12Template } from "./templates/invoice_fluvo_12/template.js";
import { renderInvoiceFluvo13Template } from "./templates/invoice_fluvo_13/template.js";
import { renderInvoiceFluvo14Template } from "./templates/invoice_fluvo_14/template.js";
import { renderInvoiceFluvo15Template } from "./templates/invoice_fluvo_15/template.js";
import { renderInvoiceFluvo16Template } from "./templates/invoice_fluvo_16/template.js";
import { renderInvoiceFluvo17Template } from "./templates/invoice_fluvo_17/template.js";
import { renderInvoiceFluvo18Template } from "./templates/invoice_fluvo_18/template.js";
import { renderInvoiceFluvo19Template } from "./templates/invoice_fluvo_19/template.js";
import { renderInvoiceFluvo20Template } from "./templates/invoice_fluvo_20/template.js";

export function renderInvoiceTemplate(target, templateId) {
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
