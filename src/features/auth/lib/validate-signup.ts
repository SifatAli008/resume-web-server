import type { SignupFieldErrors, SignupPayload } from "@/features/auth/types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSignupPayload(
  data: SignupPayload
): SignupFieldErrors | null {
  const errors: SignupFieldErrors = {};

  if (!data.businessLocation.trim()) {
    errors.businessLocation = "Business location is required.";
  }

  if (!data.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!emailPattern.test(data.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!data.password) {
    errors.password = "Password is required.";
  } else if (data.password.length < 8) {
    errors.password = "Use at least 8 characters.";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
