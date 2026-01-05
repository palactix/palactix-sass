import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "@/features/auth/components/LoginForm";
import { AuthCard } from "@/components/auth/AuthCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Palactix",
  description:
    "Login to your Palactix agency account."
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your agency account"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
      <p className="text-center mt-6 text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="text-primary font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </AuthCard>
  );
}