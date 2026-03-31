"use client";

import { useCallback, useId, useRef } from "react";
import { ImageUp, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type InvoiceFluvo12BrandingProps = {
  logoUrl: string | null;
  onLogoUrlChange: (url: string | null) => void;
  headerBgUrl: string | null;
  onHeaderBgUrlChange: (url: string | null) => void;
  className?: string;
};

export function InvoiceFluvo12Branding({
  logoUrl,
  onLogoUrlChange,
  headerBgUrl,
  onHeaderBgUrlChange,
  className,
}: InvoiceFluvo12BrandingProps) {
  const logoInputId = useId();
  const bgInputId = useId();
  const logoRef = useRef<HTMLInputElement>(null);
  const bgRef = useRef<HTMLInputElement>(null);

  const onLogoFile = useCallback(
    (file: File | undefined) => {
      if (!file || !file.type.startsWith("image/")) return;
      if (logoUrl?.startsWith("blob:")) URL.revokeObjectURL(logoUrl);
      onLogoUrlChange(URL.createObjectURL(file));
      if (logoRef.current) logoRef.current.value = "";
    },
    [logoUrl, onLogoUrlChange]
  );

  const onBgFile = useCallback(
    (file: File | undefined) => {
      if (!file || !file.type.startsWith("image/")) return;
      if (headerBgUrl?.startsWith("blob:")) URL.revokeObjectURL(headerBgUrl);
      onHeaderBgUrlChange(URL.createObjectURL(file));
      if (bgRef.current) bgRef.current.value = "";
    },
    [headerBgUrl, onHeaderBgUrlChange]
  );

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 rounded-lg border border-zinc-300/90 bg-zinc-100/90 px-3 py-2 text-xs print:hidden",
        className
      )}
    >
      <input
        ref={logoRef}
        id={logoInputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => onLogoFile(e.target.files?.[0])}
      />
      <input
        ref={bgRef}
        id={bgInputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => onBgFile(e.target.files?.[0])}
      />

      <label
        htmlFor={logoInputId}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-zinc-400 bg-white px-2.5 py-1.5 font-medium text-zinc-900 shadow-sm hover:bg-zinc-50"
      >
        <ImageUp className="size-3.5 text-zinc-700" aria-hidden />
        {logoUrl ? "Change logo" : "Add logo"}
      </label>
      {logoUrl ? (
        <button
          type="button"
          onClick={() => {
            if (logoUrl.startsWith("blob:")) URL.revokeObjectURL(logoUrl);
            onLogoUrlChange(null);
          }}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 font-medium text-zinc-600 hover:bg-white/80 hover:text-zinc-900"
        >
          <X className="size-3.5" aria-hidden />
          Remove logo
        </button>
      ) : null}

      <span className="mx-1 hidden h-5 w-px self-center bg-zinc-300 sm:inline" />

      <label
        htmlFor={bgInputId}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-zinc-400 bg-white px-2.5 py-1.5 font-medium text-zinc-900 shadow-sm hover:bg-zinc-50"
      >
        <ImageUp className="size-3.5 text-zinc-700" aria-hidden />
        {headerBgUrl ? "Change header background" : "Add header background"}
      </label>
      {headerBgUrl ? (
        <button
          type="button"
          onClick={() => {
            if (headerBgUrl.startsWith("blob:"))
              URL.revokeObjectURL(headerBgUrl);
            onHeaderBgUrlChange(null);
          }}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 font-medium text-zinc-600 hover:bg-white/80 hover:text-zinc-900"
        >
          <X className="size-3.5" aria-hidden />
          Remove background
        </button>
      ) : null}
    </div>
  );
}
