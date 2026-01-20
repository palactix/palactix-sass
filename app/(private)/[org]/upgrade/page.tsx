"use client";

import React from "react";
import { UpgradePricingTable } from "@/components/billing/UpgradePricingTable";
import { Container } from "@/components/Container";
import Link from "next/link";


export default function UpgradePage() {
  return (
    <div className="py-10">
      <Container>
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Unleash Your Agency&apos;s Full Potential
          </h1>
          <p className="text-lg text-muted-foreground">
            Scale with higher limits, advanced analytics, and priority support. 
            Choose the plan that fits your growth.
          </p>
        </div>
        
        <UpgradePricingTable />
        
        <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>
                Secure payments processed by Paddle. By upgrading, you agree to our Terms of Service.
                <br />
                Need a custom enterprise plan? &nbsp;
                <Link href="/contact-us" className="underline underline-offset-4 hover:text-primary">
                  Contact Sales
                </Link>
            </p>
        </div>
      </Container>
    </div>
  );
}
