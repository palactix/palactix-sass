"use client";

import React from "react";
import { Button } from "./ui/button";
import { ArrowRight, Shield, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { Container } from "./Container";

export function HeroSection() {
  return (
    <section className="pt-32 pb-20">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10"
            >
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">
                Zero Platform Bans Since Launch • Used by 1,000+ Accounts
              </span>
            </motion.div>

            {/* H1 Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              Run your own{" "}
              <span className="text-primary">white-label</span> social
              publishing platform
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-muted-foreground leading-relaxed"
            >
              Your clients see only YOUR agency name on Instagram, TikTok, X,
              and LinkedIn. Zero third-party branding. Zero shared keys. Flat
              pricing.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white text-base group"
                asChild
              >
                <a href="/auth/signup" className="flex items-center gap-2">
                  Start 14-day Agency Pilot
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base"
                asChild
              >
                <a href="#pricing">See Pricing</a>
              </Button>
            </motion.div>

            {/* Microcopy */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-sm text-muted-foreground"
            >
              No credit card required for pilot.
            </motion.p>
          </motion.div>

          {/* Right Column - Visual Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="relative bg-card rounded-2xl border border-border shadow-2xl p-8 backdrop-blur-sm">
              {/* OAuth Consent Screen Mockup */}
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">JA</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Johnson Social Agency</h3>
                    <p className="text-sm text-muted-foreground">
                      wants to access your account
                    </p>
                  </div>
                </div>

                {/* Permissions */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Publish posts</p>
                      <p className="text-xs text-muted-foreground">
                        Create and schedule content on your behalf
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Manage media</p>
                      <p className="text-xs text-muted-foreground">
                        Upload photos and videos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Read insights</p>
                      <p className="text-xs text-muted-foreground">
                        View basic analytics
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button className="flex-1 px-4 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
                    Allow Access
                  </button>
                  <button className="flex-1 px-4 py-3 rounded-lg border border-border hover:bg-accent transition-colors">
                    Cancel
                  </button>
                </div>

                {/* Footer */}
                <p className="text-xs text-center text-muted-foreground pt-2">
                  You can revoke access at any time in your settings
                </p>
              </div>

              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-xl -z-10" />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}