import { cn } from "@/lib/utils/cn";

type DividerWithLabelProps = {
  label: string;
  className?: string;
};

export function DividerWithLabel({ label, className }: DividerWithLabelProps) {
  return (
    <div className={cn("relative my-6", className)} role="separator">
      <div className="absolute inset-0 flex items-center" aria-hidden>
        <span className="w-full border-t border-zinc-200" />
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-wide">
        <span className="bg-white px-2 text-zinc-500">{label}</span>
      </div>
    </div>
  );
}
