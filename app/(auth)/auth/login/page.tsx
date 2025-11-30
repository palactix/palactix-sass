import Link from "next/link";
import LoginForm from "@/features/auth/components/LoginForm";
import { AuthCard } from "@/components/auth/AuthCard";

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your agency account"
    >
      <LoginForm />
      <p className="text-center mt-6 text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="text-primary font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </AuthCard>
  );
}