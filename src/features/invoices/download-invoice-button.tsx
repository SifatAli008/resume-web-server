"use client";

export function DownloadInvoiceButton() {
  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="mt-6 flex justify-center print:hidden">
      <button
        type="button"
        onClick={handleDownload}
        className="rounded-md bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      >
        Download Invoice
      </button>
    </div>
  );
}
