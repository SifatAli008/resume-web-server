"use client";

import { useCallback, useId, useRef, useState } from "react";
import { ImageUp, Loader2 } from "lucide-react";
import { removeSignatureBackground } from "@/features/invoices/lib/remove-signature-background";
import { cn } from "@/lib/utils/cn";
import styles from "@/features/invoices/templates/invoice_fluvo_19/invoice-fluvo-19.module.css";

type InvoiceFluvo19SignatureProps = {
  className?: string;
  imageUrl: string | null;
  onImageUrlChange: (url: string | null) => void;
};

export function InvoiceFluvo19Signature({
  className,
  imageUrl,
  onImageUrlChange,
}: InvoiceFluvo19SignatureProps) {
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
      <p className="text-[11px] font-normal uppercase tracking-wider text-[#141414]">
        Signature
      </p>

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
          "relative flex min-h-[160px] flex-1 items-center justify-center border-[3px] border-dashed border-[#141414] bg-[#fff3c4]",
          imageUrl &&
            "border-solid bg-[repeating-conic-gradient(#ffe066_0%_25%,#fff8e7_0%_50%)_50%/10px_10px]"
        )}
      >
        {processing ? (
          <div className="flex flex-col items-center gap-2 py-8 text-[11px] text-[#141414]">
            <Loader2
              className="size-8 animate-spin text-[#0055bf]"
              aria-hidden
            />
            <span>Removing background…</span>
          </div>
        ) : imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- dynamic blob URLs from user upload
          <img
            src={imageUrl}
            alt="Signature"
            className={cn(
              "max-h-40 w-auto max-w-full object-contain p-3",
              styles.pixelImg
            )}
          />
        ) : (
          <span className="px-4 py-10 text-center text-[10px] leading-relaxed text-[#141414]/80">
            Add a signature image — background removed automatically.
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <label
          htmlFor={inputId}
          className={cn(
            styles.btnBrick,
            "inline-flex cursor-pointer items-center gap-2 bg-[#ffd500] px-3 py-2 text-[10px] font-normal uppercase tracking-wide text-[#141414]",
            processing && "pointer-events-none opacity-50"
          )}
        >
          <ImageUp className="size-4 shrink-0 text-[#0055bf]" aria-hidden />
          {imageUrl ? "Replace" : "Add pic"}
        </label>
        {imageUrl ? (
          <button
            type="button"
            onClick={clearSignature}
            className={cn(
              styles.btnBrick,
              "bg-white px-3 py-2 text-[10px] font-normal uppercase tracking-wide text-[#141414] underline-offset-2 hover:bg-[#fff3c4]"
            )}
          >
            Remove
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="text-[10px] text-[#b45309]" role="status">
          {error}
        </p>
      ) : null}
    </div>
  );
}
