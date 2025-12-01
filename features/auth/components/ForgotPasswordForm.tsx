"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordSchema } from "../schemas/forgot-password.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/forms/FormMessage";
import { useForgotPasswordMutation } from "../api/auth.queries";
import type { NormalizedApiError } from "@/lib/api/error-handler";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
  });

  const { mutate, isPending } = useForgotPasswordMutation();

  const onSubmit = (values: ForgotPasswordSchema) => {
    mutate(values, {
      onSuccess: (data) => {
        toast.success(data.message || "Password reset link sent!");
        setEmailSent(true);
      },
      onError: (error: NormalizedApiError) => {
        if (error.fieldErrors) {
          Object.entries(error.fieldErrors).forEach(([field, message]) => {
            // @ts-expect-error: field comes from backend validation keys
            setError(field, { type: "server", message });
          });
        }
      },
    });
  };

  if (emailSent) {
    return (
      <div className="space-y-6 text-center">
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            We&apos;ve sent a password reset link to:
          </p>
          <p className="font-semibold text-foreground">{getValues("email")}</p>
          <p className="text-sm text-muted-foreground">
            Check your inbox and click the link to reset your password.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground text-center mb-4">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@agency.com" {...register("email")} />
        <FormMessage>{errors.email?.message}</FormMessage>
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" size="lg" disabled={isPending}>
        {isPending ? "Sending..." : "Send Reset Link"}
      </Button>
    </form>
  );
}
