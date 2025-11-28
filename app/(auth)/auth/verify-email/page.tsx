import Link from "next/link";
import VerifyEmailForm from "@/features/auth/components/VerifyEmailForm";
import { AuthCard } from "@/components/auth/AuthCard";

export default function VerifyEmailPage() {
  return (
    <AuthCard
      title="Check your email"
      subtitle="We sent you a verification link"
    >
      <VerifyEmailForm />
      <p className="text-center mt-6 text-sm text-muted-foreground">
        Back to{" "}
        <Link href="/auth/login" className="text-primary font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
