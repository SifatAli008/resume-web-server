"use client";

import { useCallback, useId, useRef, useState } from "react";
import { ImageUp, Loader2 } from "lucide-react";
import { removeSignatureBackground } from "@/features/invoices/lib/remove-signature-background";
import { cn } from "@/lib/utils/cn";

type InvoiceFluvo1SignatureProps = {
  className?: string;
  imageUrl: string | null;
  onImageUrlChange: (url: string | null) => void;
};

export function InvoiceFluvo1Signature({
  className,
  imageUrl,
  onImageUrlChange,
}: InvoiceFluvo1SignatureProps) {
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
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="text-sm font-bold text-black">Signature</p>

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
          "relative flex min-h-[100px] items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50/80",
          imageUrl && "border-solid border-zinc-200 bg-[repeating-conic-gradient(#f4f4f5_0%_25%,#ffffff_0%_50%)_50%/12px_12px]"
        )}
      >
        {processing ? (
          <div className="flex flex-col items-center gap-2 py-6 text-sm text-zinc-600">
            <Loader2 className="size-8 animate-spin text-blue-500" aria-hidden />
            <span>Removing background…</span>
          </div>
        ) : imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- dynamic blob URLs from user upload
          <img
            src={imageUrl}
            alt="Signature"
            className="max-h-24 w-auto max-w-full object-contain p-2"
          />
        ) : (
          <span className="px-4 py-8 text-center text-sm text-zinc-500">
            Add a signature image — background will be removed automatically.
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <label
          htmlFor={inputId}
          className={cn(
            "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2",
            processing && "pointer-events-none opacity-50"
          )}
        >
          <ImageUp className="size-4 shrink-0 text-blue-500" aria-hidden />
          {imageUrl ? "Replace image" : "Add picture"}
        </label>
        {imageUrl ? (
          <button
            type="button"
            onClick={clearSignature}
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 underline-offset-2 hover:text-black hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
