"use client";

import { SimpleSignatureField } from "@/features/invoices/templates/shared/simple-signature-field";

export type InvoiceFluvo11SignatureProps = {
  className?: string;
  imageUrl: string | null;
  onImageUrlChange: (url: string | null) => void;
};

export function InvoiceFluvo11Signature({
  className,
  imageUrl,
  onImageUrlChange,
}: InvoiceFluvo11SignatureProps) {
  return (
    <SimpleSignatureField
      className={className}
      value={imageUrl ?? ""}
      onChange={(value) => onImageUrlChange(value)}
    />
  );
}
