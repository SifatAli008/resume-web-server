"use client";

import { useCallback, useId, useRef, useState } from "react";
import { Dancing_Script } from "next/font/google";
import { ImageUp, Loader2 } from "lucide-react";
import { removeSignatureBackground } from "@/features/invoices/lib/remove-signature-background";
import { cn } from "@/lib/utils/cn";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export type InvoiceFluvo9SignatureProps = {
  className?: string;
  imageUrl: string | null;
  onImageUrlChange: (url: string | null) => void;
};

export function InvoiceFluvo9Signature({
  className,
  imageUrl,
  onImageUrlChange,
}: InvoiceFluvo9SignatureProps) {
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
    <div className={cn("flex flex-col items-end gap-3 text-right", className)}>
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
          "relative flex min-h-[100px] w-full max-w-[220px] items-center justify-end rounded-sm border border-dashed border-neutral-400 bg-neutral-50",
          imageUrl && "border-solid border-neutral-300 bg-white"
        )}
      >
        {processing ? (
          <div className="flex w-full flex-col items-center gap-2 py-6 text-sm text-neutral-600">
            <Loader2 className="size-8 animate-spin text-black" aria-hidden />
            <span>Removing background…</span>
          </div>
        ) : imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- dynamic blob URLs from user upload
          <img
            src={imageUrl}
            alt="Signature"
            className="max-h-28 w-auto max-w-full object-contain p-2"
          />
        ) : (
          <div className="flex w-full flex-col items-end gap-1 px-3 py-4">
            <p
              className={cn(
                dancingScript.className,
                "text-3xl leading-none text-black"
              )}
            >
              Amy Clark
            </p>
            <span className="text-[10px] text-neutral-500">
              Upload signature — background removed automatically.
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <label
          htmlFor={inputId}
          className={cn(
            "inline-flex cursor-pointer items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-50 focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2",
            processing && "pointer-events-none opacity-50"
          )}
        >
          <ImageUp className="size-4 shrink-0" aria-hidden />
          {imageUrl ? "Replace" : "Add picture"}
        </label>
        {imageUrl ? (
          <button
            type="button"
            onClick={clearSignature}
            className="rounded-md px-3 py-2 text-sm font-medium text-neutral-600 underline-offset-2 hover:text-black hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            Remove
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="max-w-[220px] text-right text-xs text-amber-800" role="status">
          {error}
        </p>
      ) : null}
    </div>
  );
}
