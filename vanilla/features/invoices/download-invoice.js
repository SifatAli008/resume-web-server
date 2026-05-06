export function mountDownloadInvoiceButton(templateId, targetElementId, mountId) {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  mount.innerHTML = `
    <button
      id="download-invoice-btn"
      type="button"
      class="rounded-md bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
    >
      Download Invoice
    </button>
  `;

  const button = document.getElementById("download-invoice-btn");
  if (!button) return;

  button.addEventListener("click", async () => {
    const invoiceElement = document.getElementById(targetElementId);
    if (!invoiceElement) return;
    const iframe = invoiceElement.querySelector("iframe");

    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("https://esm.sh/html2canvas-pro@2.0.2"),
      import("https://esm.sh/jspdf@3.0.3"),
    ]);

    const captureTarget =
      iframe?.contentDocument?.getElementById("invoice-download-target") ??
      invoiceElement;

    const canvas = await html2canvas(captureTarget, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
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
  });
}
