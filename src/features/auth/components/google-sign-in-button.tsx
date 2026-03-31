"use client";

import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export type GoogleSignInButtonProps = {
  label?: string;
  className?: string;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
};

export function GoogleSignInButton({
  label = "Sign up with Google",
  className,
  onClick,
  disabled,
}: GoogleSignInButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn("w-full border-zinc-300 py-3", className)}
      onClick={onClick}
      disabled={disabled}
    >
      <FcGoogle className="size-5 shrink-0" aria-hidden />
      {label}
    </Button>
  );
}
