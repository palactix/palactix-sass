import { Navbar } from "@/components/home/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { PlatformsSection } from "@/components/home/PlatformsSection";
import { PainPointSection } from "@/components/home/PainPointSection";
import { ComparisonTable } from "@/components/home/ComparisonTable";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { PricingSection } from "@/components/home/PricingSection";
import { HonestySection } from "@/components/home/HonestySection";
import { FAQSection } from "@/components/home/FAQSection";
import { Footer } from "@/components/home/Footer";
import { FinalCTA } from "@/components/home/FinalCTA";
import Script from "next/script";

export default function HomePage() {

  return (
    <div className="min-h-screen">
       <Script
        id="palactix-org-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Palactix",
            url: "https://www.palactix.com",
            logo: "https://www.palactix.com/logo.png",
            description:
              "Palactix is an agency-first, white-label social publishing platform that allows agencies to publish client content using their own app credentials.",
            sameAs: [
              "https://www.linkedin.com/company/palactix",
              "https://twitter.com/palactix",
            ],
          }),
        }}
      />

      <Script
        id="palactix-website-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Palactix",
            url: "https://www.palactix.com",
          }),
        }}
      />
      <Navbar />
      <main>
        <HeroSection />
        <PlatformsSection />
        <PainPointSection />
        <ComparisonTable />
        <HowItWorksSection />
        <PricingSection />
        <HonestySection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
