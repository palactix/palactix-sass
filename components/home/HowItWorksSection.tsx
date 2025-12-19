"use client";

import React from "react";
import { Zap, Key, ShieldCheck, TrendingUp } from "lucide-react";
import { Container } from "../Container";

export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Guided onboarding",
      description: "Clear, step-by-step setup for each platform.",
      Icon: Zap,
    },
    {
      number: 2,
      title: "Add your own app keys",
      description: "Your apps, your permissions, your brand on the consent screen",
      Icon: Key,
    },
    {
      number: 3,
      title: "Client-authorized access",
      description: "Clients approve your app directly, no shared OAuth.",
      Icon: ShieldCheck,
    },
    {
      number: 4,
      title: "Publish with confidence",
      description: "Every action is isolated, auditable, and under your control.",
      Icon: TrendingUp,
    },
  ];

  return (
    <section className="py-20 relative">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Guided setup, permanent ownership
          </h2>
        </div>

        {/* Desktop - Horizontal Flow */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 relative">
          {/* Connection Line */}
          <div className="absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

          {steps.map((step) => (
            <div key={step.number} className="relative">
              {/* Step Card */}
              <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all group">
                {/* Icon Circle */}
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center relative z-10 group-hover:bg-primary/20 transition-all">
                  <step.Icon className="w-10 h-10 text-primary" />
                </div>

                {/* Step Number */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold mb-2 text-center">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground text-center">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile - Vertical Flow */}
        <div className="md:hidden space-y-6">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-12 top-24 bottom-0 w-0.5 bg-gradient-to-b from-primary to-primary/20 -mb-6" />
              )}

              {/* Step Card */}
              <div className="bg-card border border-border rounded-xl p-6 relative">
                {/* Icon Circle */}
                <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center mb-4 relative z-10">
                  <step.Icon className="w-10 h-10 text-primary" />
                </div>

                {/* Step Number Badge */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Separator Line */}
        <div className="mt-20 border-t border-border" />
      </Container>
    </section>
  );
}
