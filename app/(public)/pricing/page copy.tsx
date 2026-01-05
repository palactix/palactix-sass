"use client";

import { PricingSection } from "@/components/home/PricingSection";
import { FAQSection } from "@/components/home/FAQSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Container } from "@/components/Container";
import { motion } from "motion/react";
import { Check, Clock } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Pricing
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              Palactix is built for digital marketing agencies that manage social
              media publishing for their clients using their own platform app
              credentials (BYO keys).
            </p>
            <p className="text-lg text-muted-foreground">
              Our pricing is designed to scale with your agency as you onboard
              more clients and team members — without shared apps, temporary
              access, or hidden platform risks.
            </p>
          </motion.div>
        </Container>
        
        {/* Background gradient effects similar to hero */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full opacity-50" />
        </div>
      </section>

      {/* Evaluation Info Section */}
      <section className="pb-10">
        <Container>
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
            {/* 14-Day Evaluation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-sm h-full"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">14-Day Evaluation</h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <p className="font-medium text-foreground">
                  All new agencies start with a <span className="text-primary font-bold">14-day evaluation period</span>.
                </p>
                <p>The evaluation begins once you:</p>
                <ul className="space-y-3 mt-2">
                  {[
                    "Create your Palactix account",
                    "Add your own social platform app credentials",
                    "Connect your first client account"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="pt-2 text-sm italic">
                  No payment is required during the evaluation period.
                </p>
              </div>
            </motion.div>

            {/* After Evaluation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-sm h-full flex flex-col justify-center"
            >
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold">After the Evaluation</h2>
              </div>
              
              <p className="text-muted-foreground text-lg leading-relaxed">
                Once the evaluation period ends, continued access requires an
                active paid subscription based on the plan that best fits your
                agency&apos;s size and needs.
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Pricing Cards */}
      <PricingSection hideHeader={true} />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA */}
      <FinalCTA />
    </div>
  );
}