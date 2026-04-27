"use client";

import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

type DownloadInvoiceButtonProps = {
  templateId: string;
};

export function DownloadInvoiceButton({ templateId }: DownloadInvoiceButtonProps) {
  const handleDownload = async () => {
    const invoiceElement = document.getElementById("invoice-download-target");
    if (!invoiceElement) return;

    const canvas = await html2canvas(invoiceElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      onclone: (clonedDocument) => {
        const formFields = clonedDocument.querySelectorAll(
          "input, textarea, select",
        );

        formFields.forEach((field) => {
          const element = field as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
          const value =
            element instanceof HTMLSelectElement
              ? element.selectedOptions[0]?.textContent ?? ""
              : element.value ?? "";

          const replacement = clonedDocument.createElement("div");
          const styles = clonedDocument.defaultView?.getComputedStyle(element);

          replacement.textContent = value;
          replacement.style.whiteSpace = "pre-wrap";
          replacement.style.wordBreak = "break-word";
          replacement.style.boxSizing = "border-box";

          if (styles) {
            replacement.style.width = styles.width;
            replacement.style.minHeight = styles.height;
            replacement.style.padding = styles.padding;
            replacement.style.border = styles.border;
            replacement.style.borderRadius = styles.borderRadius;
            replacement.style.background = styles.background;
            replacement.style.color = styles.color;
            replacement.style.font = styles.font;
            replacement.style.letterSpacing = styles.letterSpacing;
            replacement.style.lineHeight = styles.lineHeight;
            replacement.style.textAlign = styles.textAlign;
            replacement.style.display = "flex";
            replacement.style.alignItems = "center";
          }

          element.replaceWith(replacement);
        });
      },
    });

    const imageData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imageWidth = pdfWidth;
    const imageHeight = (canvas.height * imageWidth) / canvas.width;

    let remainingHeight = imageHeight;
    let currentY = 0;

    pdf.addImage(imageData, "PNG", 0, currentY, imageWidth, imageHeight);
    remainingHeight -= pdfHeight;

    while (remainingHeight > 0) {
      currentY = remainingHeight - imageHeight;
      pdf.addPage();
      pdf.addImage(imageData, "PNG", 0, currentY, imageWidth, imageHeight);
      remainingHeight -= pdfHeight;
    }

    pdf.save(`invoice-${templateId}.pdf`);
  };

  return (
    <div className="relative z-50 mt-6 flex justify-center print:hidden">
      <button
        type="button"
        onClick={handleDownload}
        className="pointer-events-auto rounded-md bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      >
        Download Invoice
      </button>
    </div>
  );
}
