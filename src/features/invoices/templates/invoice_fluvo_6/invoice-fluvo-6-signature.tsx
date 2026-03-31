"use client";

import { useCallback, useId, useRef, useState } from "react";
import { ImageUp, Loader2 } from "lucide-react";
import { removeSignatureBackground } from "@/features/invoices/lib/remove-signature-background";
import { cn } from "@/lib/utils/cn";

export type InvoiceFluvo6SignatureProps = {
  className?: string;
  imageUrl: string | null;
  onImageUrlChange: (url: string | null) => void;
};

export function InvoiceFluvo6Signature({
  className,
  imageUrl,
  onImageUrlChange,
}: InvoiceFluvo6SignatureProps) {
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
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="text-sm font-bold text-[#232323]">Signature</p>

      <div className="h-px w-full bg-zinc-400" aria-hidden />

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
          "relative flex min-h-[120px] items-center justify-center rounded-md border border-dashed border-orange-200 bg-[#fdf5e6]/40",
          imageUrl &&
            "border-solid border-zinc-200 bg-[repeating-conic-gradient(#fff7ed_0%_25%,#ffffff_0%_50%)_50%/12px_12px]"
        )}
      >
        {processing ? (
          <div className="flex flex-col items-center gap-2 py-6 text-sm text-zinc-600">
            <Loader2
              className="size-8 animate-spin"
              style={{ color: "#f39200" }}
              aria-hidden
            />
            <span>Removing background…</span>
          </div>
        ) : imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- dynamic blob URLs from user upload
          <img
            src={imageUrl}
            alt="Signature"
            className="max-h-32 w-auto max-w-full object-contain p-2"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 px-4 py-6 text-center">
            <p
              className="text-2xl text-[#232323]"
              style={{
                fontFamily:
                  '"Segoe Script", "Brush Script MT", "Snell Roundhand", cursive',
              }}
            >
              Amy Clark
            </p>
            <span className="text-xs text-zinc-500">
              Upload your signature — background removed automatically.
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <label
          htmlFor={inputId}
          className={cn(
            "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm font-medium text-[#232323] transition-colors hover:bg-orange-50 focus-within:ring-2 focus-within:ring-[#f39200] focus-within:ring-offset-2",
            processing && "pointer-events-none opacity-50"
          )}
          style={{ borderColor: "rgba(243, 146, 0, 0.5)" }}
        >
          <ImageUp className="size-4 shrink-0" style={{ color: "#f39200" }} aria-hidden />
          {imageUrl ? "Replace image" : "Add picture"}
        </label>
        {imageUrl ? (
          <button
            type="button"
            onClick={clearSignature}
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 underline-offset-2 hover:text-[#232323] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f39200]"
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
