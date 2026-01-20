"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Check, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { usePermissionStore } from "@/features/organization/stores/permission.store";
import { useUser } from "@/features/auth/api/auth.queries";
import { useOrganizationStore } from "@/features/organization/stores/organization.store";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { startBilling } from "@/features/organization/api/billing.api";

// You should move these to env variables
const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || ""; 
const PADDLE_ENV = (process.env.NEXT_PUBLIC_PADDLE_ENV || "sandbox") as "sandbox" | "production";

// Map your plan names to Paddle Price IDs
const PLAN_PRICE_IDS = {
  "Starter": "pri_01kew3ab5yxxqe57pbrdpz3mfy", // Replace with actual ID
  "Pro": "pri_01kew3b243t99e9fzb6ajfmddh",         // Replace with actual ID
  "Scale": "pri_scale_month_price_id"      // Replace with actual ID
};

export function UpgradePricingTable() {
  const { data: permissions } = usePermissionStore();
  const { data: user } = useUser();
  const { currentOrganization } = useOrganizationStore();
  const [paddle, setPaddle] = useState<Paddle | null>(null);

  // Initialize Paddle
  useEffect(() => {
    if (PADDLE_CLIENT_TOKEN) {
        initializePaddle({ 
            environment: PADDLE_ENV, 
            token: PADDLE_CLIENT_TOKEN 
        }).then((paddleInstance) => {
            if (paddleInstance) {
                setPaddle(paddleInstance);
            }
        });
    }
  }, []);

  const handleCheckout = async (priceId: string) => {
    if (!paddle || !user || !currentOrganization) return;
    const paddleConfig = await startBilling(currentOrganization.slug, priceId);
    console.log("Redirecting to checkout URL:", paddleConfig);

    // paddle.Checkout.open({
    //   items: [{ priceId, quantity: 1 }],
    //   customer: {
    //     email: user.email,
    //   },
    //   customData: {
    //     organizationId: currentOrganization.id.toString(),
    //     userId: user.id.toString(),
    //     organizationSlug: currentOrganization.slug
    //   },
    //   //focusedVia: "upgrade-page"
    // });

    if (paddleConfig.settings) {
      delete paddleConfig.settings.displayMode;
      delete paddleConfig.settings.frameStyle;
    }
    paddle.Checkout.open(paddleConfig);
  };

  const plans = [
    {
      name: "Starter",
      price: "$199",
      period: "/mo",
      target: "For boutique agencies",
      features: [
        "Up to 5 team seats",
        "50 Client Brands",
        "White-label Dashboard",
        "BYO Sovereign Keys Support",
        "Standard Email Support",
      ],
      priceId: PLAN_PRICE_IDS["Starter"],
      popular: false,
    },
    {
      name: "Pro",
      price: "$799",
      period: "/mo",
      target: "The Agency Powerhouse",
      features: [
        "Everything in Starter",
        "Unlimited Clients & Brands",
        "Unlimited Team Seats",
        "Custom Domain (White-label)",
        "Priority 4h Response Support",
        "Basic Analytics Export",
      ],
      priceId: PLAN_PRICE_IDS["Pro"],
      popular: true,
    },
    {
      name: "Scale",
      price: "$1,999+",
      period: "/mo",
      target: "Enterprise Infrastructure",
      features: [
        "Everything in Pro",
        "Hierarchical Approval Workflows (Beta)",
        "Audit Logs & Activity Tracking (Beta)",
        "SAML / SSO Support (Roadmap)",
        "API Concierge (Hands-on Setup)",
        "Dedicated Technical Lead",
        "99.9% Uptime SLA",
      ],
      priceId: PLAN_PRICE_IDS["Scale"],
      popular: false,
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {plans.map((plan, index) => {
        const isCurrentPlan = permissions?.plan?.name === plan.name;
        console.log("Rendering plan:", plan.name, "Is current plan:", isCurrentPlan);
        
        return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={`relative rounded-2xl border p-6 flex flex-col h-full ${
                plan.popular
                  ? "border-primary bg-primary/5 shadow-xl"
                  : "border-border bg-card"
              } ${isCurrentPlan ? "ring-2 ring-primary ring-offset-2" : ""}`}
            >
              {isCurrentPlan && (
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-0.5 rounded-full text-xs font-semibold">
                    Current Plan
                 </div>
              )}
              {plan.popular && !isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-0.5 rounded-full text-xs font-semibold">
                  Recommended
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-xs text-muted-foreground">{plan.target}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => {
                   const betaMatch = feature.match(/^(.*?)\s*\(Beta\)$/);
                   const roadmapMatch = feature.match(/^(.*?)\s*\(Roadmap\)$/);
                   const featureText = betaMatch ? betaMatch[1] : roadmapMatch ? roadmapMatch[1] : feature;
                   const tagText = betaMatch ? "Beta" : roadmapMatch ? "Roadmap" : null;

                  return (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-sm flex items-center gap-1.5 flex-wrap">
                        <span>{featureText}</span>
                         {tagText && (
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium leading-none ${
                            tagText === "Beta" 
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300" 
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                          }`}>
                            {tagText}
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <Button
                className={`w-full ${plan.popular && !isCurrentPlan ? "bg-primary text-primary-foreground" : ""}`}
                variant={isCurrentPlan ? "outline" : plan.popular ? "default" : "outline"}
                disabled={isCurrentPlan || !paddle}
                onClick={() => handleCheckout(plan.priceId)}
              >
                 {!paddle ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                 ) : isCurrentPlan ? (
                  "Current Plan"
                ) : (
                  `Upgrade to ${plan.name}`
                )}
              </Button>
            </motion.div>
        );
      })}
    </div>
  );
}
