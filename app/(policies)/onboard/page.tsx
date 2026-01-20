"use client";

import { useEffect, Suspense } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Container } from "@/components/Container";
import { Shield, Lock, HelpCircle, Loader2 } from "lucide-react";
import { useUser } from "@/features/auth/api/auth.queries";
import { useOnboardInfo } from "@/features/onboard/api/onboard.queries";
import { useChannelLogo } from "@/hooks/use-channel-logo";
import { useChannelConnect } from "@/hooks/use-channel-connect";
import { toast } from "sonner";
import Link from "next/link";

function OnboardPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orgSlug = searchParams.get("org");
  
  const { data: user, isLoading: isUserLoading } = useUser();
  const { data: onboardInfo, isLoading: isOnboardLoading } = useOnboardInfo(orgSlug);
  const getChannelLogo = useChannelLogo();
  const { connectChannel, connectingChannel } = useChannelConnect({
    redirectPath: `/${orgSlug}/dashboard`,
    onSuccess: () => {
      toast.success("Account connected successfully!");
    }
  });

  const isLoading = isUserLoading || isOnboardLoading;

  // Listen for OAuth success message from popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== window.location.origin) return;
      
      if (event.data?.type === "OAUTH_SUCCESS") {
        toast.success("Account connected successfully!");
        // Redirect to dashboard after successful connection
        router.push(`/${orgSlug}/dashboard`);
      } else if (event.data?.type === "OAUTH_ERROR") {
        toast.error(event.data?.message || "Failed to connect account");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router, orgSlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!onboardInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Container className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid Link</h1>
          <p className="text-muted-foreground">
            This onboarding link is invalid or has expired. Please contact your agency.
          </p>
        </Container>
      </div>
    );
  }

  const organization = onboardInfo.organization;
  const channels = onboardInfo.channels;
  const userName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/5 -z-10" />
      
      <Container className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Agency Branding Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-center space-y-4"
          >
            {/* Agency Logo */}
            <div className="flex justify-center">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg bg-primary"
              >
                {organization.name.slice(0, 2).toUpperCase()}
              </div>
            </div>
            
            <h2 className="text-lg font-medium text-muted-foreground">
              {organization.name}
            </h2>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative bg-card rounded-2xl border border-border shadow-2xl p-8 backdrop-blur-sm"
          >
            {/* Welcome Message */}
            <div className="text-center space-y-3 mb-8">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold"
              >
                Welcome, {userName}!
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-muted-foreground leading-relaxed"
              >
                Your agency uses their own secure platform to manage your 
                social accounts — no third-party tools involved.
              </motion.p>
            </div>

            {/* Time Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center justify-center gap-2 mb-8"
            >
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm text-muted-foreground px-4">
                Let&apos;s connect your accounts (30 seconds)
              </span>
              <div className="h-px flex-1 bg-border" />
            </motion.div>

            {/* Channel Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-8"
            >
              {channels.map((channel, index) => {
                const isConnecting = connectingChannel === channel.slug;
                
                return (
                <motion.button
                  key={channel.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                  whileHover={!isConnecting ? { scale: 1.05, y: -2 } : {}}
                  whileTap={!isConnecting ? { scale: 0.95 } : {}}
                  onClick={() => connectChannel(channel)}
                  disabled={!!connectingChannel}
                  className={`group relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                    isConnecting 
                      ? "border-primary bg-primary/5 cursor-wait" 
                      : connectingChannel 
                        ? "border-border bg-card/30 opacity-50 cursor-not-allowed"
                        : "border-border bg-card/50 hover:border-primary/50 hover:bg-card cursor-pointer"
                  }`}
                >
                  {/* Icon Container */}
                  <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center overflow-hidden relative">
                    {isConnecting ? (
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    ) : (
                      <Image
                        src={getChannelLogo(channel.icon)}
                        alt={channel.name}
                        width={32}
                        height={32}
                        className="object-contain"
                        unoptimized
                      />
                    )}
                  </div>
                  
                  {/* Channel Name */}
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {channel.name}
                  </span>

                  {/* Hover Glow */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-sm" />
                </motion.button>
              )})}
            </motion.div>

            {/* Security Notice */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <Lock className="w-5 h-5 text-primary shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Your data is encrypted and only used to publish on your behalf. 
                  You can revoke access anytime.
                </p>
              </div>

               {/* Account Actions */}
               <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 px-2">
                 <button 
                  onClick={() => router.push("/auth/reset-password")}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
                >
                  Create or Reset Password
                </button>

                <Link 
                  href={'/dashboard'}
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Go to Dashboard 
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </motion.div>

            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-xl -z-10" />
          </motion.div>

          {/* Help Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="text-center"
          >
            <a 
              href="#" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              Having trouble? Contact your agency
            </a>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            className="flex items-center justify-center gap-6 pt-4"
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
              <Shield className="w-4 h-4" />
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
              <Lock className="w-4 h-4" />
              <span>OAuth 2.0 Secure</span>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}

export default function OnboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <OnboardPageContent />
    </Suspense>
  );
}