"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "../schemas/login.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/forms/FormMessage";
import { useLoginMutation } from "../api/auth.queries";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "../stores/auth.store";
import type { NormalizedApiError } from "@/lib/api/error-handler";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const { mutate, isPending } = useLoginMutation();

  const onSubmit = (values: LoginSchema) => {
    mutate(values, {
      onSuccess: () => {
        setAuthenticated(true);
        console.log({ returnUrl });
        router.push(returnUrl || "/dashboard");
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
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@agency.com" {...register("email")} />
        <FormMessage>{errors.email?.message}</FormMessage>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Input id="password" type="password" placeholder="Enter your password" {...register("password")} />
        <FormMessage>{errors.password?.message}</FormMessage>
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" size="lg" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
