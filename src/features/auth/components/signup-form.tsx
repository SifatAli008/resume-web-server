"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Building2, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DividerWithLabel } from "@/components/ui/divider-with-label";
import { TextField } from "@/components/ui/text-field";
import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button";
import { validateSignupPayload } from "@/features/auth/lib/validate-signup";
import type { SignupFieldErrors, SignupPayload } from "@/features/auth/types";

const initialForm: SignupPayload = {
  businessLocation: "",
  fullName: "",
  email: "",
  password: "",
};

export type SignupFormProps = {
  onManualSubmit?: (payload: SignupPayload) => void | Promise<void>;
  onGoogleSignUp?: () => void | Promise<void>;
};

export function SignupForm({ onManualSubmit, onGoogleSignUp }: SignupFormProps) {
  const [form, setForm] = useState<SignupPayload>(initialForm);
  const [errors, setErrors] = useState<SignupFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function updateField<K extends keyof SignupPayload>(
    key: K,
    value: SignupPayload[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validateSignupPayload(form);
    if (nextErrors) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await onManualSubmit?.(form);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      await onGoogleSignUp?.();
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-black">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Add your business details and choose how you&apos;d like to sign up.
        </p>
      </header>

      <GoogleSignInButton
        onClick={handleGoogle}
        disabled={submitting || googleLoading}
      />

      <DividerWithLabel label="Or sign up with email" />

      <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        <TextField
          id="signup-business-location"
          name="businessLocation"
          label="Business location"
          placeholder="City, region, or address"
          autoComplete="organization"
          value={form.businessLocation}
          onChange={(e) =>
            updateField("businessLocation", e.target.value)
          }
          error={errors.businessLocation}
          icon={Building2}
        />
        <TextField
          id="signup-full-name"
          name="fullName"
          label="Full name"
          placeholder="Jane Doe"
          autoComplete="name"
          value={form.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          error={errors.fullName}
          icon={User}
        />
        <TextField
          id="signup-email"
          name="email"
          type="email"
          inputMode="email"
          label="Email"
          placeholder="you@company.com"
          autoComplete="email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          error={errors.email}
          icon={Mail}
        />
        <TextField
          id="signup-password"
          name="password"
          type="password"
          label="Password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => updateField("password", e.target.value)}
          error={errors.password}
          icon={Lock}
        />

        <Button
          type="submit"
          className="mt-1 w-full py-3"
          disabled={submitting || googleLoading}
        >
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-blue-500 hover:text-blue-600 focus-visible:outline-none focus-visible:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
