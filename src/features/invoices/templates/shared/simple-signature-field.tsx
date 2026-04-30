"use client";

import { cn } from "@/lib/utils/cn";

type SimpleSignatureFieldProps = {
  className?: string;
  value: string;
  onChange: (value: string) => void;
};

export function SimpleSignatureField({
  className,
  value,
  onChange,
}: SimpleSignatureFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="text-sm font-bold text-current">Signature</p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type signature"
        aria-label="Signature"
        className="w-full min-w-0 border-0 border-b border-zinc-300 bg-transparent py-1 text-sm text-current placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none"
      />
    </div>
  );
}
