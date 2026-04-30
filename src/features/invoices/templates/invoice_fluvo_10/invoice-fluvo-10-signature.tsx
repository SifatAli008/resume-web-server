"use client";

import { SimpleSignatureField } from "@/features/invoices/templates/shared/simple-signature-field";

export type InvoiceFluvo10SignatureProps = {
  className?: string;
  imageUrl: string | null;
  onImageUrlChange: (url: string | null) => void;
};

export function InvoiceFluvo10Signature({
  className,
  imageUrl,
  onImageUrlChange,
}: InvoiceFluvo10SignatureProps) {
  return (
    <SimpleSignatureField
      className={className}
      value={imageUrl ?? ""}
      onChange={(value) => onImageUrlChange(value)}
    />
  );
}
