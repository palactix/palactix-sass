import { PricingSection } from "@/components/home/PricingSection";
import { FAQs } from "@/components/shared/FAQs";
import { Container } from "@/components/Container";
import {
  AnimatedDiv,
  AnimatedBenefitCard,
  ChecklistItem,
  CTAButton,
} from "@/components/pricing/PricingClientSections";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan and Pricing - Palactix",
  description:
    "Transparent pricing for Palactix. Start with a 14-day evaluation and scale as your agency grows",
};

export default function PricingPage() {
  const faqs = [
    {
      question: "What happens during the 14-day evaluation period?",
      answer:
        "During your 14-day evaluation, you get full access to all features. The evaluation starts when you create your account, add your platform app credentials, and connect your first client. No payment is required during this time.",
    },
    {
      question: "Do I need to provide credit card details for the evaluation?",
      answer:
        "No, you can start your 14-day evaluation without providing any payment information. You'll only need to add payment details when you're ready to continue after the evaluation period.",
    },
    {
      question: "What does 'BYO Keys' mean?",
      answer:
        "BYO Keys (Bring Your Own Keys) means you use your own social platform app credentials instead of shared access. This gives you full ownership and control, eliminates platform risks, and ensures your clients' data stays secure under your management.",
    },
    {
      question: "Can I change plans later?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Plan changes take effect immediately, and billing adjustments are handled automatically by Paddle.",
    },
    {
      question: "What are the platform API usage costs?",
      answer:
        "Some social platforms charge for API access (e.g., LinkedIn, TikTok). These costs are billed directly by the platforms to your developer accounts. Our pricing covers only the Palactix platform — we don't mark up or charge for platform API usage.",
    },
    {
      question: "Is there a limit on posts or content?",
      answer:
        "No. All plans include unlimited scheduled posts and content management. Your only limits are the number of clients and team seats based on your chosen plan.",
    },
    {
      question: "What happens if I exceed my plan limits?",
      answer:
        "If you reach your client or team seat limits, you'll be prompted to upgrade to the next tier. We'll never block access unexpectedly — you'll always have time to adjust your plan.",
    },
    {
      question: "Do you offer discounts for annual billing?",
      answer:
        "Yes! Contact our sales team for information about annual billing discounts and custom enterprise pricing.",
    },
  ];

  const benefits = [
    {
      iconName: "shield" as const,
      title: "Full Ownership & Control",
      description:
        "Use your own platform app credentials. No shared access, no temporary permissions, no platform risks.",
    },
    {
      iconName: "clock" as const,
      title: "14-Day Free Evaluation",
      description:
        "Test all features with your real clients before committing. No credit card required to start.",
    },
    {
      iconName: "zap" as const,
      title: "Scales With Your Agency",
      description:
        "From 5 clients to unlimited. Add team members and clients as you grow without platform limitations.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <Container>
          <AnimatedDiv
            animate="onMount"
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-block mb-4 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
              <span className="text-sm font-medium text-primary">
                Simple, Transparent Pricing
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Pricing Built for Agencies
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Palactix is built for digital marketing agencies that manage
              social media publishing for their clients using their own platform
              app credentials (BYO keys).
            </p>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our pricing is designed to scale with your agency as you onboard
              more clients and team members — without shared apps, temporary
              access, or hidden platform risks.
            </p>
          </AnimatedDiv>
        </Container>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full opacity-50" />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6 bg-muted/30">
        <Container>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <AnimatedBenefitCard
                key={benefit.title}
                iconName={benefit.iconName}
                title={benefit.title}
                description={benefit.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Pricing Cards */}
      <PricingSection hideHeader={true} />

      {/* 14-Day Evaluation Section */}
      <section className="py-20 px-6">
        <Container>
          <AnimatedDiv className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start with a 14-Day Evaluation
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              All new agencies start with a{" "}
              <strong>14-day evaluation period</strong>. Test every feature with
              your real clients before making a commitment.
            </p>
            <div className="bg-card border rounded-xl p-8 text-left">
              <h3 className="text-xl font-semibold mb-4">
                Your evaluation begins once you:
              </h3>
              <ul className="space-y-3">
                <ChecklistItem>Create your Palactix account</ChecklistItem>
                <ChecklistItem>
                  Add your own social platform app credentials
                </ChecklistItem>
                <ChecklistItem>Connect your first client account</ChecklistItem>
              </ul>
              <p className="mt-6 text-muted-foreground font-medium">
                No payment is required during the evaluation period.
              </p>
            </div>
          </AnimatedDiv>
        </Container>
      </section>

      {/* After Evaluation Section */}
      <section className="py-20 px-6 bg-muted/30">
        <Container>
          <AnimatedDiv className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              After the Evaluation
            </h2>
            <p className="text-lg text-muted-foreground">
              Once the evaluation period ends, continued access requires an
              active paid subscription based on the plan that best fits your
              agency&apos;s size and needs. Choose the plan that matches where
              you are today, and scale up as your agency grows.
            </p>
          </AnimatedDiv>
        </Container>
      </section>

      {/* FAQ Section */}
      <FAQs faqs={faqs} />

      {/* Final CTA Section */}
      <section className="py-20 px-6">
        <Container>
          <AnimatedDiv className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start your 14-day evaluation today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/auth/signup">Start Free Evaluation</CTAButton>
              <CTAButton href="/contact-us" variant="outline">
                Talk to Sales
              </CTAButton>
            </div>
          </AnimatedDiv>
        </Container>
      </section>
    </div>
  );
}