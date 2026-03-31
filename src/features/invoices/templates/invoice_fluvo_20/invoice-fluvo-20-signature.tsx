"use client";

import { useCallback, useId, useRef, useState } from "react";
import { ImageUp, Loader2 } from "lucide-react";
import { removeSignatureBackground } from "@/features/invoices/lib/remove-signature-background";
import { cn } from "@/lib/utils/cn";
import styles from "@/features/invoices/templates/invoice_fluvo_20/invoice-fluvo-20.module.css";

type InvoiceFluvo20SignatureProps = {
  className?: string;
  imageUrl: string | null;
  onImageUrlChange: (url: string | null) => void;
};

export function InvoiceFluvo20Signature({
  className,
  imageUrl,
  onImageUrlChange,
}: InvoiceFluvo20SignatureProps) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file || !file.type.startsWith("image/")) return;

      setError(null);
      setProcessing(true);

      try {
        const blob = await removeSignatureBackground(file);
        const nextUrl = URL.createObjectURL(blob);
        onImageUrlChange(nextUrl);
      } catch (err) {
        console.error("[signature] Background removal failed:", err);
        try {
          const fallback = URL.createObjectURL(file);
          onImageUrlChange(fallback);
          setError(
            "Could not remove the background automatically. Showing the original image."
          );
        } catch {
          setError("Could not load this image. Try another file.");
        }
      } finally {
        setProcessing(false);
        if (fileRef.current) fileRef.current.value = "";
      }
    },
    [onImageUrlChange]
  );

  function clearSignature() {
    onImageUrlChange(null);
    setError(null);
  }

  return (
    <div className={cn("flex h-full flex-col gap-2", className)}>
      <p className="text-xs font-medium text-neutral-800">Signature</p>

      <input
        ref={fileRef}
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />

      <div
        className={cn(
          "relative flex min-h-[140px] flex-1 items-center justify-center border border-dashed border-neutral-400 bg-neutral-50",
          imageUrl && "border-solid border-neutral-300 bg-white"
        )}
      >
        {processing ? (
          <div className="flex flex-col items-center gap-2 py-8 text-sm text-neutral-600">
            <Loader2 className="size-7 animate-spin text-neutral-500" aria-hidden />
            <span>Removing background…</span>
          </div>
        ) : imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- dynamic blob URLs from user upload
          <img
            src={imageUrl}
            alt="Signature"
            className={cn(
              "max-h-36 w-auto max-w-full object-contain p-3",
              styles.pixelImg
            )}
          />
        ) : (
          <span className="px-4 py-8 text-center text-xs text-neutral-500">
            Add an image. Background is removed automatically.
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <label
          htmlFor={inputId}
          className={cn(
            "inline-flex cursor-pointer items-center gap-2 border border-neutral-900 bg-[#ffd500] px-3 py-1.5 text-xs font-medium text-neutral-900 hover:bg-[#ffe566]",
            processing && "pointer-events-none opacity-50"
          )}
        >
          <ImageUp className="size-3.5 shrink-0" aria-hidden />
          {imageUrl ? "Replace" : "Upload"}
        </label>
        {imageUrl ? (
          <button
            type="button"
            onClick={clearSignature}
            className="border border-neutral-900 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Remove
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="text-xs text-amber-800" role="status">
          {error}
        </p>
      ) : null}
    </div>
  );
}
