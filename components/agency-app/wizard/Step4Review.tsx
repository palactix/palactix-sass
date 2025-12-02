"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Check, Instagram, Linkedin, Twitter, Facebook, Youtube, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSendAppToReviewMutation, useMyAgencyApp, useChannels } from "@/features/agency-app/api/agency-app.queries";
import { useWizardStore } from "@/features/agency-app/stores/wizard.store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getPlatformIcon } from "@/lib/utils/platform-icons";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Pencil } from "lucide-react";



interface Step4ActivationProps {
  onComplete?: () => void;
}

export function Step4Activation({ onComplete }: Step4ActivationProps) {
  const { appId, setStep } = useWizardStore();
  const { data: myApp } = useMyAgencyApp();
  const { data: allChannels } = useChannels();
  const { mutate, isPending } = useSendAppToReviewMutation();
  const router = useRouter();
  const { theme } = useTheme();

  // Reactively update when data changes
  useEffect(() => {
    if (myApp) {
      // This will update whenever myApp changes (including after credentials are saved)
    }
  }, [myApp]);

  const prevStep = () => setStep(3);

  const handleActivate = () => {
    if (!appId) return;
    
    mutate(appId, {
      onSuccess: () => {
        toast.success("App sent to review successfully!");
        setStep(5);
      },
      onError: (err) => toast.error(err.message)
    })
  }

  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Review & Activate</CardTitle>
          <CardDescription>Review your configuration before activating your agency app.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">App Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="h-8 gap-2">
                <Pencil className="h-3 w-3" /> Edit
              </Button>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg border">
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{myApp?.name }</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Platforms Configured</h3>
              <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="h-8 gap-2">
                <Pencil className="h-3 w-3" /> Edit
              </Button>
            </div>
            <div className="grid gap-3">
              {myApp?.channels?.map(appChannel => {
                const channel = allChannels?.find(c => c.id === appChannel.channel_id);
                if (!channel) return null;
                
                const hasCreds = appChannel.client_id && appChannel.client_secret;
                const iconUrl = getPlatformIcon(channel.icon, theme);
                
                return (
                  <div key={channel.id} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                    <div className="flex items-center gap-3">
                      {iconUrl ? (
                        <Image 
                          width={20} 
                          height={20} 
                          src={iconUrl} 
                          alt={channel.name} 
                          className="h-5 w-5 object-contain" 
                          unoptimized
                        />
                      ) : (
                        <div className="h-5 w-5 bg-muted rounded-full" />
                      )}
                      <span className="font-medium">{channel.name}</span>
                    </div>
                    {hasCreds ? (
                      <div className="flex items-center text-green-600 text-sm bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                        <Check className="h-3 w-3 mr-1" /> Configured
                      </div>
                    ) : (
                      <div className="flex items-center text-amber-600 text-sm bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                        <AlertCircle className="h-3 w-3 mr-1" /> Missing Credentials
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Ready to Activate</AlertTitle>
            <AlertDescription>
              Your app will be live immediately after activation. You can update settings later from the dashboard.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={prevStep}>Back</Button>
          <Button onClick={handleActivate} disabled={isPending} className="bg-green-600 hover:bg-green-700">
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending to Review...</>
            ) : (
              <><Check className="mr-2 h-4 w-4" /> Send to Review</>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
