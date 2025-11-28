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

export default function HomePage() {

  return (
    <div className="min-h-screen">
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
