import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { PlatformsSection } from "@/components/PlatformsSection";
import { PainPointSection } from "@/components/PainPointSection";
import { ComparisonTable } from "@/components/ComparisonTable";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { PricingSection } from "@/components/PricingSection";
import { HonestySection } from "@/components/HonestySection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {

  return (
    <div className="min-h-screen bg-background">
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
      </main>
      <Footer />
    </div>
  );
}
