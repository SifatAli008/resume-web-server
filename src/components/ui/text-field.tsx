"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
  icon?: LucideIcon;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ id, label, error, icon: Icon, className, ...props }, ref) => (
    <div className="w-full">
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-black"
      >
        {label}
      </label>
      <div className="relative">
        {Icon ? (
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
            aria-hidden
          />
        ) : null}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-black placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
            Icon && "pl-10",
            error &&
              "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      </div>
      {error ? (
        <p
          id={`${id}-error`}
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  )
);

TextField.displayName = "TextField";
