'use client'

import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import Image from "next/image";

export default function Home() {
  return (
     <div className="min-h-screen">
      <Header />
      <HeroSection />
    </div>
  );
}
