import Link from "next/link";
import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";
import { AuthCard } from "@/components/auth/AuthCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password - Palactix",
  description:
    "Reset your Palactix agency account password."
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Forgot password?"
      subtitle="No worries, we'll send you reset instructions"
    >
      <ForgotPasswordForm />
      <p className="text-center mt-6 text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link href="/auth/login" className="text-primary font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}