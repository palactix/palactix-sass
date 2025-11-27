"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Container } from "../Container";

export function FAQSection() {
  const faqs = [
    {
      question: 'Will my clients ever see "Palactix" anywhere?',
      answer:
        "No. Once you add your own keys, your agency's name appears everywhere — in OAuth consent screens, email notifications, and anywhere a brand name would be visible. We're completely invisible to your end clients.",
    },
    {
      question: "Do I have to pay during the 14-day pilot?",
      answer:
        "No credit card required. You get 5 days using our keys to test the platform, then you'll need to add your own keys to continue the trial. The paid plan only starts after your 14-day pilot period ends.",
    },
    {
      question: "What happens on day 6 if I haven't added my own keys yet?",
      answer:
        "Posting stops until you add them. You'll still have full access to the dashboard and setup guides. Once your keys are approved and added, publishing resumes immediately.",
    },
    {
      question:
        "How long does app approval take on Instagram/Facebook/TikTok?",
      answer:
        "4–10 days on average. Instagram/Facebook typically takes 3–7 days. TikTok can be 5–10 days. We provide detailed templates and step-by-step guides. Our support team reviews your submissions before you send them to ensure faster approval.",
    },
    {
      question: "Can my team members each have their own login?",
      answer:
        "Yes — up to 5 team seats on Starter plan. Unlimited seats on Pro and Scale plans. Each member gets their own credentials and role-based permissions.",
    },
    {
      question:
        "My clients are already connected to another tool. How seamless is the migration?",
      answer:
        "Extremely. Generate fresh OAuth link → send to client → they authorize → done. Since you own the keys, there's no data migration needed. Most agencies complete this in under 2 minutes per client.",
    },
    {
      question: "Where are the OAuth tokens stored?",
      answer:
        "Encrypted at rest using AES-256 in isolated database instances. Your keys never touch shared infrastructure. We're SOC 2 Type II compliant (in progress) and follow OAuth 2.0 best practices.",
    },
    {
      question:
        "If I ever leave Palactix, what happens to my clients and tokens?",
      answer:
        "You own your app keys — nothing is ever locked in. Simply point your apps to a new backend or export the tokens. We provide migration guides and don't hold your data hostage.",
    },
  ];

  return (
    <section className="py-20">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently asked questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/50"
              >
                <AccordionTrigger className="text-left hover:no-underline data-[state=open]:text-primary">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Separator Line */}
        <div className="mt-20 border-t border-border" />
      </Container>
    </section>
  );
}
