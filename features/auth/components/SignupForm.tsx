"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupSchema } from "../schemas/signup.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/forms/FormMessage";
import { Button } from "@/components/ui/button";
import { useSignupMutation } from "../api/auth.queries";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/auth.store";
import type { NormalizedApiError } from "@/lib/api/error-handler";

export default function SignupForm() {
  const router = useRouter();
  const setPendingEmail = useAuthStore((s) => s.setPendingEmail);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    mode: "onSubmit",
  });

  const { mutate, isPending } = useSignupMutation();

  const onSubmit = (values: SignupSchema) => {
    mutate(values, {
      onSuccess: () => {
        setPendingEmail(values.email);
        router.push("/auth/verify-email");
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
      <div className="space-y-2">
        <Label htmlFor="name">Agency Name</Label>
        <Input id="name" placeholder="Acme Digital Agency" {...register("name")} />
        <FormMessage>{errors.name?.message}</FormMessage>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@agency.com" {...register("email")} />
        <FormMessage>{errors.email?.message}</FormMessage>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Create a strong password" {...register("password")} />
        {errors.password ? (
          <FormMessage>{errors.password.message}</FormMessage>
        ) : (
          <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
        )}
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" size="lg" disabled={isPending}>
        {isPending ? "Creating account..." : "Start 14-Day Evaluation"}
      </Button>
    </form>
  );
}
