"use client";

import { useCallback, useId, useRef } from "react";
import { ImageUp, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type InvoiceFluvo17BrandingProps = {
  logoUrl: string | null;
  onLogoUrlChange: (url: string | null) => void;
  className?: string;
};

export function InvoiceFluvo17Branding({
  logoUrl,
  onLogoUrlChange,
  className,
}: InvoiceFluvo17BrandingProps) {
  const logoInputId = useId();
  const logoRef = useRef<HTMLInputElement>(null);

  const onLogoFile = useCallback(
    (file: File | undefined) => {
      if (!file || !file.type.startsWith("image/")) return;
      if (logoUrl?.startsWith("blob:")) URL.revokeObjectURL(logoUrl);
      onLogoUrlChange(URL.createObjectURL(file));
      if (logoRef.current) logoRef.current.value = "";
    },
    [logoUrl, onLogoUrlChange]
  );

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 rounded-lg border border-teal-200/90 bg-teal-50/90 px-3 py-2 text-xs print:hidden",
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

      <label
        htmlFor={logoInputId}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-teal-600 bg-white px-2.5 py-1.5 font-medium text-teal-950 shadow-sm hover:bg-teal-50"
      >
        <ImageUp className="size-3.5 text-teal-800" aria-hidden />
        {logoUrl ? "Change logo" : "Add logo"}
      </label>
      {logoUrl ? (
        <button
          type="button"
          onClick={() => {
            if (logoUrl.startsWith("blob:")) URL.revokeObjectURL(logoUrl);
            onLogoUrlChange(null);
          }}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 font-medium text-zinc-600 hover:bg-white/80 hover:text-teal-900"
        >
          <X className="size-3.5" aria-hidden />
          Remove logo
        </button>
      ) : null}
    </div>
  );
}
