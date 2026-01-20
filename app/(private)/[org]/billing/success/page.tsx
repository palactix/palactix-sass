"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Home, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { motion } from "motion/react";
import { useOrgPaths } from "@/lib/utils/org-urls";

export default function BillingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orgPaths = useOrgPaths();
  const [checkoutId, setCheckoutId] = useState<string | null>(null);

  useEffect(() => {
    // Paddle appends ?checkout_id=... to the URL on success
    const id = searchParams.get("checkout_id");
    //if (id) setCheckoutId(id);
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
       // transition={{ duration: 0.5, ease: "out" }}
        className="w-full max-w-md"
      >
        <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-xl">
          <CardHeader className="flex flex-col items-center text-center pb-2 pt-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
              className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </motion.div>
            
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              Payment Successful
            </h1>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Your subscription has been confirmed. You now have access to all the updated premium features.
            </p>
          </CardHeader>

          <CardContent className="space-y-4 pt-6">
            <div className="bg-muted/50 rounded-lg p-4 text-xs space-y-3">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Status</span>
                <span className="text-green-600 dark:text-green-400 font-medium bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Transaction Ref</span>
                <span className="font-mono text-foreground">
                  {checkoutId ? checkoutId.slice(0, 16) + "..." : "Confirming..."}
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pb-8">
            <Button 
              className="w-full h-11" 
              onClick={() => router.push(orgPaths.dashboard)}
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full text-muted-foreground hover:text-foreground"
              onClick={() => router.push(orgPaths.billing)}
            >
              View Billing Details
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-xs text-muted-foreground text-center"
      >
        A receipt has been sent to your email address.
      </motion.p>
    </div>
  );
}
