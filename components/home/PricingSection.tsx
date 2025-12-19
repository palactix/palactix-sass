"use client";

import React from "react";
import { Button } from "../ui/button";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { Container } from "../Container";

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "$199",
      period: "/mo",
      target: "For growing agencies",
      features: [
        "Up to 5 team seats",
        "50 Clients",
        "White-label Dashboard",
        "BYO Keys Support",
      ],
      cta: "Get started",
      ctaLink: "/auth/signup",
      popular: false,
    },
    {
      name: "Pro",
      price: "$799",
      period: "/mo",
      target: "For established agencies",
      features: [
        "Everything in Starter",
        "Unlimited Clients",
        "Unlimited team seats",
        "Priority Support",
        "Custom Domain",
      ],
      cta: "Choose Pro",
      ctaLink: "/auth/signup",
      popular: true,
    },
    {
      name: "Scale",
      price: "$1,999+",
      period: "/mo",
      target: "For large enterprises",
      features: [
        "Everything in Pro",
        "Dedicated Account Manager",
        "SLA",
        "Custom Integrations",
        "On-premise Option",
      ],
      cta: "Talk to sales",
      ctaLink: "/contact",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 px-6 scroll-mt-20">
      <Container className="mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            No shared apps. No temporary access. Full ownership from day one.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className={`relative rounded-2xl border p-8 ${
                plan.popular
                  ? "border-primary bg-primary/5 shadow-2xl scale-105"
                  : "border-border bg-card"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.target}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-lg text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-primary hover:bg-primary/90 text-white"
                    : "border-border"
                }`}
                variant={plan.popular ? "default" : "outline"}
                size="lg"
                asChild
              >
                <a href={plan.ctaLink}>{plan.cta}</a>
              </Button>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Prices shown exclude platform API costs, if applicable.
          </p>
        </div>

        {/* Separator Line */}
        <div className="mt-20 border-t border-border" />
      </Container>
    </section>
  );
}