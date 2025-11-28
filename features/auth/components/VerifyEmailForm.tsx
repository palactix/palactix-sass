"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useResendVerificationMutation } from "../api/auth.queries";
import { toast } from "sonner";
import { useAuthStore } from "../stores/auth.store";

export default function VerifyEmailForm() {
  const pendingEmail = useAuthStore((s) => s.pendingEmail);
  const [countdown, setCountdown] = useState(0);
  const { mutate, isPending } = useResendVerificationMutation();

  const handleResend = () => {
    if (!pendingEmail) {
      toast.error("No email found. Please sign up again.");
      return;
    }

    mutate(
      { email: pendingEmail },
      {
        onSuccess: (data) => {
          toast.success(data.message || "Verification email sent!");
          setCountdown(60);
          const interval = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(interval);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-muted-foreground">
          We&apos;ve sent a verification email to:
        </p>
        <p className="font-semibold text-foreground">{pendingEmail || "your email"}</p>
        <p className="text-sm text-muted-foreground">
          Click the link in the email to verify your account.
        </p>
      </div>

      <div className="pt-4">
        <p className="text-sm text-center text-muted-foreground mb-4">
          Didn&apos;t receive the email? Check your spam folder or resend it.
        </p>
        <Button
          onClick={handleResend}
          disabled={isPending || countdown > 0}
          variant="outline"
          className="w-full"
        >
          {countdown > 0
            ? `Resend in ${countdown}s`
            : isPending
            ? "Sending..."
            : "Resend Verification Email"}
        </Button>
      </div>
    </div>
  );
}
