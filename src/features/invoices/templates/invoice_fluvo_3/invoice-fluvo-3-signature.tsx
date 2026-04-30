"use client";

import { SimpleSignatureField } from "@/features/invoices/templates/shared/simple-signature-field";

export type InvoiceFluvo3SignatureProps = {
  className?: string;
  imageUrl: string | null;
  onImageUrlChange: (url: string | null) => void;
};

export function InvoiceFluvo3Signature({
  className,
  imageUrl,
  onImageUrlChange,
}: InvoiceFluvo3SignatureProps) {
  return (
    <SimpleSignatureField
      className={className}
      value={imageUrl ?? ""}
      onChange={(value) => onImageUrlChange(value)}
    />
  );
}
