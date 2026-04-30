"use client";

import { SimpleSignatureField } from "@/features/invoices/templates/shared/simple-signature-field";

export type InvoiceFluvo5SignatureProps = {
  className?: string;
  imageUrl: string | null;
  onImageUrlChange: (url: string | null) => void;
};

export function InvoiceFluvo5Signature({
  className,
  imageUrl,
  onImageUrlChange,
}: InvoiceFluvo5SignatureProps) {
  return (
    <SimpleSignatureField
      className={className}
      value={imageUrl ?? ""}
      onChange={(value) => onImageUrlChange(value)}
    />
  );
}
