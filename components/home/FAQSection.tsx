import { FAQs } from "../shared/FAQs";

export function FAQSection() {
  const faqs = [
    {
      question: "Why does Palactix require my own app credentials?", 
      answer: "Because your clients trust you, not us. Using your own apps ensures full isolation, brand-safe OAuth consent, and zero shared access across agencies."
    },
    {
      question: 'Will my clients ever see "Palactix" anywhere?',
      answer:
        "No. Once you add your own keys, your agency's name appears everywhere — in OAuth consent screens, email notifications, and anywhere a brand name would be visible. We're completely invisible to your end clients.",
    },
    {
      question: "When does the 14-day agency pilot start?",
      answer:
        "Once your app credentials are connected. The pilot includes full access with no feature restrictions",
    },
    {
      question: "Do I have to pay during the 14-day pilot?",
      answer:
        "No. No credit card is required to start your 14-day evaluation. The evaluation begins once you connect your first client account using your own platform app credentials. You’ll have full access during this period, and you’ll only be asked to choose a paid plan after the evaluation ends.",
    },
    {
      question: "What if I need help with app setup?",
      answer:
        "Our support team provides step-by-step guides and reviews your submissions for free to ensure quick approval.",
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

  return <FAQs faqs={faqs} />;
}
