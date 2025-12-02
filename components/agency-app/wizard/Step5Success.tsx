"use client";

import { motion } from "motion/react";
import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMyAgencyApp } from "@/features/agency-app/api/agency-app.queries";

interface Step5SuccessProps {
  onComplete: () => void;
}

export function Step5Success({ onComplete }: Step5SuccessProps) {
  const { data: myApp } = useMyAgencyApp();

  return (
    <motion.div
      key="step5"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-10"
    >
      <div className="flex justify-center mb-6">
        <div className="h-24 w-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <PartyPopper className="h-12 w-12 text-green-600" />
        </div>
      </div>
      <h2 className="text-4xl font-bold mb-4">You now own your social stack.</h2>
      <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-8">
        Your clients will only see <span className="font-semibold text-foreground">"{myApp?.name || "Your App"}"</span> on consent screens — never Palactix or a third-party tool.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6" asChild>
          <Link href="/clients/new">Connect Your First Client</Link>
        </Button>
        <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={onComplete}>
          View App Dashboard
        </Button>
      </div>
    </motion.div>
  );
}
