import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  isKnownInvoiceTemplateId,
  KNOWN_INVOICE_TEMPLATE_IDS,
} from "@/features/invoices/constants";
import { DownloadInvoiceButton } from "@/features/invoices/download-invoice-button";
import { InvoiceTemplateRenderer } from "@/features/invoices/invoice-template-renderer";

type PageProps = {
  params: Promise<{ templateId: string }>;
};

export async function generateStaticParams() {
  return KNOWN_INVOICE_TEMPLATE_IDS.map((templateId) => ({ templateId }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { templateId } = await params;
  return {
    title: `Invoice · ${templateId}`,
    description: "Live-editable invoice template.",
  };
}

export default async function InvoiceTemplatePage({ params }: PageProps) {
  const { templateId } = await params;

  if (!isKnownInvoiceTemplateId(templateId)) {
    notFound();
  }

  return (
    <div className="min-h-svh bg-zinc-100 px-4 py-10 text-black print:bg-white print:py-0">
      <div id="invoice-download-target">
        <InvoiceTemplateRenderer templateId={templateId} />
      </div>
      <DownloadInvoiceButton templateId={templateId} />
    </div>
  );
}
