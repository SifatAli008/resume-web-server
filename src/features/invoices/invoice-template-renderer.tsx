"use client";

import { INVOICE_TEMPLATE_IDS } from "@/features/invoices/constants";
import { InvoiceFluvo1Template } from "@/features/invoices/templates/invoice_fluvo_1/invoice-fluvo-1-template";
import { InvoiceFluvo2Template } from "@/features/invoices/templates/invoice_fluvo_2/invoice-fluvo-2-template";
import { InvoiceFluvo3Template } from "@/features/invoices/templates/invoice_fluvo_3/invoice-fluvo-3-template";
import { InvoiceFluvo4Template } from "@/features/invoices/templates/invoice_fluvo_4/invoice-fluvo-4-template";
import { InvoiceFluvo5Template } from "@/features/invoices/templates/invoice_fluvo_5/invoice-fluvo-5-template";
import { InvoiceFluvo6Template } from "@/features/invoices/templates/invoice_fluvo_6/invoice-fluvo-6-template";
import { InvoiceFluvo7Template } from "@/features/invoices/templates/invoice_fluvo_7/invoice-fluvo-7-template";
import { InvoiceFluvo8Template } from "@/features/invoices/templates/invoice_fluvo_8/invoice-fluvo-8-template";
import { InvoiceFluvo9Template } from "@/features/invoices/templates/invoice_fluvo_9/invoice-fluvo-9-template";
import { InvoiceFluvo10Template } from "@/features/invoices/templates/invoice_fluvo_10/invoice-fluvo-10-template";
import { InvoiceFluvo11Template } from "@/features/invoices/templates/invoice_fluvo_11/invoice-fluvo-11-template";
import { InvoiceFluvo12Template } from "@/features/invoices/templates/invoice_fluvo_12/invoice-fluvo-12-template";
import { InvoiceFluvo13Template } from "@/features/invoices/templates/invoice_fluvo_13/invoice-fluvo-13-template";
import { InvoiceFluvo14Template } from "@/features/invoices/templates/invoice_fluvo_14/invoice-fluvo-14-template";
import { InvoiceFluvo15Template } from "@/features/invoices/templates/invoice_fluvo_15/invoice-fluvo-15-template";
import { InvoiceFluvo16Template } from "@/features/invoices/templates/invoice_fluvo_16/invoice-fluvo-16-template";
import { InvoiceFluvo17Template } from "@/features/invoices/templates/invoice_fluvo_17/invoice-fluvo-17-template";
import { InvoiceFluvo18Template } from "@/features/invoices/templates/invoice_fluvo_18/invoice-fluvo-18-template";
import { InvoiceFluvo19Template } from "@/features/invoices/templates/invoice_fluvo_19/invoice-fluvo-19-template";
import { InvoiceFluvo20Template } from "@/features/invoices/templates/invoice_fluvo_20/invoice-fluvo-20-template";

type InvoiceTemplateRendererProps = {
  templateId: string;
};

/**
 * Client switch for invoice templates. Add new cases when you ship another template.
 */
export function InvoiceTemplateRenderer({
  templateId,
}: InvoiceTemplateRendererProps) {
  switch (templateId) {
    case INVOICE_TEMPLATE_IDS.FLUVO_1:
      return <InvoiceFluvo1Template />;
    case INVOICE_TEMPLATE_IDS.FLUVO_2:
      return <InvoiceFluvo2Template />;
    case INVOICE_TEMPLATE_IDS.FLUVO_3:
      return <InvoiceFluvo3Template />;
    case INVOICE_TEMPLATE_IDS.FLUVO_4:
      return <InvoiceFluvo4Template />;
    case INVOICE_TEMPLATE_IDS.FLUVO_5:
      return <InvoiceFluvo5Template />;
    case INVOICE_TEMPLATE_IDS.FLUVO_6:
      return <InvoiceFluvo6Template />;
    case INVOICE_TEMPLATE_IDS.FLUVO_7:
      return <InvoiceFluvo7Template />;
    case INVOICE_TEMPLATE_IDS.FLUVO_8:
      return <InvoiceFluvo8Template />;
    case INVOICE_TEMPLATE_IDS.FLUVO_9:
      return <InvoiceFluvo9Template />;
    case INVOICE_TEMPLATE_IDS.FLUVO_10:
      return <InvoiceFluvo10Template />;
    case INVOICE_TEMPLATE_IDS.FLUVO_11:
      return <InvoiceFluvo11Template />;
    case INVOICE_TEMPLATE_IDS.FLUVO_12:
      return <InvoiceFluvo12Template />;
    case INVOICE_TEMPLATE_IDS.FLUVO_13:
      return <InvoiceFluvo13Template />;
    case INVOICE_TEMPLATE_IDS.FLUVO_14:
      return <InvoiceFluvo14Template />;
    case INVOICE_TEMPLATE_IDS.FLUVO_15:
      return <InvoiceFluvo15Template />;
    case INVOICE_TEMPLATE_IDS.FLUVO_16:
      return <InvoiceFluvo16Template />;
    case INVOICE_TEMPLATE_IDS.FLUVO_17:
      return <InvoiceFluvo17Template />;
    case INVOICE_TEMPLATE_IDS.FLUVO_18:
      return <InvoiceFluvo18Template />;
    case INVOICE_TEMPLATE_IDS.FLUVO_19:
      return <InvoiceFluvo19Template />;
    case INVOICE_TEMPLATE_IDS.FLUVO_20:
      return <InvoiceFluvo20Template />;
    default:
      return null;
  }
}
