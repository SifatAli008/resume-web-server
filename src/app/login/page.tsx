import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in with email and password or Google.",
};

export default function LoginPage() {
  return (
    <main className="min-h-svh bg-white px-4 py-12 text-black">
      <div className="mx-auto w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
