import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const variants = {
  primary:
    "bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-blue-500 disabled:opacity-50",
  outline:
    "border border-zinc-300 bg-white text-black hover:bg-zinc-50 focus-visible:ring-zinc-400",
  ghost: "text-black hover:bg-zinc-100 focus-visible:ring-zinc-400",
} as const;

export type ButtonVariant = keyof typeof variants;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none",
        variants[variant],
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";
