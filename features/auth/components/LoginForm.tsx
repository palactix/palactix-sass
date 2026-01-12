"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "../schemas/login.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/forms/FormMessage";
import { useLoginMutation, useUser } from "../api/auth.queries";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "../stores/auth.store";
import type { NormalizedApiError } from "@/lib/api/error-handler";
import Link from "next/link";
import { buildPostLoginRedirect } from "@/lib/utils/org-urls";
import { useEffect } from "react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const { data: user, refetch } = useUser();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const firstOrgSlug = user.organizations?.[0]?.slug;
      const redirectUrl = buildPostLoginRedirect(returnUrl, firstOrgSlug);
      router.push(redirectUrl);
    }
  }, [user, router, returnUrl]);
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
      onSuccess: async () => {
        setAuthenticated(true);
        
        // Refetch user data to get organizations
        const { data: userData } = await refetch();
        
        // Get first org slug from user data
        const firstOrgSlug = userData?.organizations?.[0]?.slug;
        
        // Build redirect URL with org context
        const redirectUrl = buildPostLoginRedirect(returnUrl, firstOrgSlug);
        
        router.push(redirectUrl);
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
