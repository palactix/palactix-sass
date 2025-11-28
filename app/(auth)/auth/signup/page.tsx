import Link from "next/link";
import SignupForm from "@/features/auth/components/SignupForm";
import { AuthCard } from "@/components/auth/AuthCard";

export default function SignupPage() {
  return (
    <AuthCard
      title="Create your agency account"
      subtitle="Start your 14-day free trial — no credit card required"
    >
      <SignupForm />
      <p className="text-xs text-center text-muted-foreground mt-6">
        By signing up, you agree to our{" "}
        <Link href="/terms" className="text-primary hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy-policy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
      </p>
      <p className="text-center mt-6 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}