import type { LoginFieldErrors, LoginPayload } from "@/features/auth/types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginPayload(
  data: LoginPayload
): LoginFieldErrors | null {
  const errors: LoginFieldErrors = {};

  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!emailPattern.test(data.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!data.password) {
    errors.password = "Password is required.";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
