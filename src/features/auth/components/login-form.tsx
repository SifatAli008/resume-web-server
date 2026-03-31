"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DividerWithLabel } from "@/components/ui/divider-with-label";
import { TextField } from "@/components/ui/text-field";
import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button";
import { validateLoginPayload } from "@/features/auth/lib/validate-login";
import type { LoginFieldErrors, LoginPayload } from "@/features/auth/types";

const initialForm: LoginPayload = {
  email: "",
  password: "",
};

export type LoginFormProps = {
  onManualSubmit?: (payload: LoginPayload) => void | Promise<void>;
  onGoogleSignIn?: () => void | Promise<void>;
};

export function LoginForm({ onManualSubmit, onGoogleSignIn }: LoginFormProps) {
  const [form, setForm] = useState<LoginPayload>(initialForm);
  const [errors, setErrors] = useState<LoginFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function updateField<K extends keyof LoginPayload>(
    key: K,
    value: LoginPayload[K]
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
    const nextErrors = validateLoginPayload(form);
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
      await onGoogleSignIn?.();
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-black">
          Log in
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Use your email or Google to access your account.
        </p>
      </header>

      <GoogleSignInButton
        label="Sign in with Google"
        onClick={handleGoogle}
        disabled={submitting || googleLoading}
      />

      <DividerWithLabel label="Or sign in with email" />

      <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        <TextField
          id="login-email"
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
          id="login-password"
          name="password"
          type="password"
          label="Password"
          placeholder="Your password"
          autoComplete="current-password"
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
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-600">
        Need an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-blue-500 hover:text-blue-600 focus-visible:outline-none focus-visible:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
