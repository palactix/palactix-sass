"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setPasswordSchema, type SetPasswordSchema } from "@/features/auth/schemas/set-password.schema";
import { useSetPasswordMutation, useUser } from "@/features/auth/api/auth.queries";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { buildOrgUrl } from "@/lib/utils/org-urls";

function InvitationAcceptContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userName = searchParams.get("name") || "User";
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { refetch } = useUser();

  const form = useForm<SetPasswordSchema>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const setPasswordMutation = useSetPasswordMutation();

  const password = form.watch("password");

  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  const onSubmit = async (data: SetPasswordSchema) => {
    try {
      await setPasswordMutation.mutateAsync({
        token,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      
      toast.success("Password created successfully!", {
        description: "Redirecting to dashboard...",
      });
      
      // Refetch user data to get organizations
      const { data: userData } = await refetch();

      const firstOrgSlug = userData?.organizations?.[0]?.slug;
      
      const redirectUrl = `${firstOrgSlug ? `/${firstOrgSlug}` : ""}/dashboard`;
      
      setTimeout(() => {
        router.push(redirectUrl);
      }, 1000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create password. Please try again.";
      toast.error("Error", {
        description: errorMessage,
      });
    }
  };

  if (!token || !email) {
    return (
      <AuthCard
        title="Invalid invitation link"
        subtitle="The invitation link is invalid or has expired"
      >
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Please contact your administrator for a new invitation link.
          </p>
          <Link href="/auth/login" className="text-primary font-semibold hover:underline">
            Back to Login
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Success Message Card */}
        <Card className="bg-green-50 border-green-200 p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-green-900 mb-1">
                Welcome aboard, {userName}! 🎉
              </h2>
              <p className="text-sm text-green-700">
                Your invitation has been accepted successfully. You&apos;re now part of the team!
              </p>
            </div>
          </div>
        </Card>

        {/* Password Creation Card */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Set Your Password</h1>
          <p className="text-muted-foreground">
            Create a secure password to complete your account setup
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Display */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-muted"
                />
              </div>

              {/* Password Input */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password Input */}
              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Confirm Password <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter your password"
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Requirements */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Password must contain:
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <span className={passwordRequirements.minLength ? "text-green-600" : ""}>
                      {passwordRequirements.minLength ? "✓" : "○"}
                    </span>
                    At least 8 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={passwordRequirements.hasUppercase ? "text-green-600" : ""}>
                      {passwordRequirements.hasUppercase ? "✓" : "○"}
                    </span>
                    One uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={passwordRequirements.hasLowercase ? "text-green-600" : ""}>
                      {passwordRequirements.hasLowercase ? "✓" : "○"}
                    </span>
                    One lowercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={passwordRequirements.hasNumber ? "text-green-600" : ""}>
                      {passwordRequirements.hasNumber ? "✓" : "○"}
                    </span>
                    One number
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={setPasswordMutation.isPending}
              >
                {setPasswordMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Password...
                  </>
                ) : (
                  "Create Password & Continue"
                )}
              </Button>
            </form>
          </Form>

          {/* Footer Link */}
          <p className="text-center mt-6 text-sm text-muted-foreground">
            Need help?{" "}
            <Link href="/support" className="text-primary font-semibold hover:underline">
              Contact Support
            </Link>
          </p>
        </div>

        {/* Additional Info */}
        <p className="text-center mt-6 text-xs text-muted-foreground">
          By creating a password, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function InvitationAcceptPage() {
  return (
    <Suspense fallback={
      <AuthCard title="Loading..." subtitle="Please wait">
        <div className="text-center py-8">Loading...</div>
      </AuthCard>
    }>
      <InvitationAcceptContent />
    </Suspense>
  );
}
