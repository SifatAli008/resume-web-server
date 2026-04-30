"use client";

import { SimpleSignatureField } from "@/features/invoices/templates/shared/simple-signature-field";

export type InvoiceFluvo17SignatureProps = {
  className?: string;
  imageUrl: string | null;
  onImageUrlChange: (url: string | null) => void;
};

export function InvoiceFluvo17Signature({
  className,
  imageUrl,
  onImageUrlChange,
}: InvoiceFluvo17SignatureProps) {
  return (
    <SimpleSignatureField
      className={className}
      value={imageUrl ?? ""}
      onChange={(value) => onImageUrlChange(value)}
    />
  );
}
