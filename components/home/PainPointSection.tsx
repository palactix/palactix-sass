"use client";

import React from "react";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { Container } from "../Container";

export function PainPointSection() {
  return (
    <section className="py-20">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Visual Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative bg-card rounded-2xl border border-destructive/60 p-8 backdrop-blur-sm overflow-hidden" style={{ boxShadow: '0 0 60px rgba(212, 24, 61, 0.5)' }}>
              {/* Reddish gradient background overlay */}
              <div className="absolute inset-0 bg-linear-to-br from-destructive/20 via-destructive/25 to-destructive/20 pointer-events-none z-0" />
              
              {/* OAuth Consent Screen Mockup - Bad Example */}
              <div className="space-y-6 relative z-10">
                {/* Header */}
                <div className="flex items-center gap-4 pb-4 border-b border-border/30">
                  <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">H</span>
                  </div>
                  <div className="relative">
                    <div className="border-2 border-destructive/90 px-4 py-2 rounded-full">
                      <h3 className="font-semibold ">Hootsuite</h3>
                      <p className="text-sm">
                        wants to access your account
                      </p>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div className="space-y-3 opacity-50">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Publish posts</p>
                      <p className="text-xs text-muted-foreground">
                        Create and schedule content
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Manage media</p>
                      <p className="text-xs text-muted-foreground">
                        Upload photos and videos
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 opacity-50">
                  <button className="flex-1 px-4 py-3 rounded-lg bg-blue-600 text-white font-medium">
                    Allow Access
                  </button>
                  <button className="flex-1 px-4 py-3 rounded-lg border border-border text-muted-foreground">
                    Cancel
                  </button>
                </div>
              </div>

              {/* Large Red X Overlay - centered */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative">
                  <X className="w-40 h-40 text-destructive stroke-3 opacity-80" />
                  <div className="absolute inset-0 bg-destructive/20 rounded-full blur-3xl" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Text Content with Red Accent */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 order-1 lg:order-2"
          >
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              This screen costs agencies{" "}
              <span className="text-destructive">six-figure clients</span> every
              single week
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Never again explain a third-party tool to a{" "}
              <span className="text-destructive font-semibold">million-follower creator</span>.
              {` When high-profile clients see a generic tool's name
              asking for permissions, trust erodes instantly.`}
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              With Palactix, they only see{" "}
              <span className="text-primary font-semibold">YOUR brand</span>.
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}