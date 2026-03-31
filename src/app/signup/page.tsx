import type { Metadata } from "next";
import { SignupForm } from "@/features/auth/components/signup-form";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your account with business details or Google.",
};

export default function SignupPage() {
  return (
    <main className="min-h-svh bg-white px-4 py-12 text-black">
      <div className="mx-auto w-full max-w-md">
        <SignupForm />
      </div>
    </main>
  );
}
