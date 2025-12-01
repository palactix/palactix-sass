"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordSchema } from "../schemas/reset-password.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/forms/FormMessage";
import { useResetPasswordMutation } from "../api/auth.queries";
import { useRouter } from "next/navigation";
import type { NormalizedApiError } from "@/lib/api/error-handler";
import { toast } from "sonner";

type ResetPasswordFormProps = {
  token: string;
  email: string;
};

export default function ResetPasswordForm({ token, email }: ResetPasswordFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      token,
      email,
    },
  });

  useEffect(() => {
    setValue("token", token);
    setValue("email", email);
  }, [token, email, setValue]);

  const { mutate, isPending } = useResetPasswordMutation();

  const onSubmit = (values: ResetPasswordSchema) => {
    mutate(values, {
      onSuccess: (data) => {
        toast.success(data.message || "Password reset successful!");
        router.push("/auth/login");
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

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("token")} />
      <input type="hidden" {...register("email")} />

      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input id="password" type="password" placeholder="Enter new password" {...register("password")} />
        <FormMessage>{errors.password?.message}</FormMessage>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password_confirmation">Confirm Password</Label>
        <Input id="password_confirmation" type="password" placeholder="Confirm new password" {...register("password_confirmation")} />
        <FormMessage>{errors.password_confirmation?.message}</FormMessage>
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" size="lg" disabled={isPending}>
        {isPending ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );
}
