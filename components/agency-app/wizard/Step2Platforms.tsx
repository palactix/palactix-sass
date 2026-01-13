"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdatePlatformsMutation, useMyAgencyApp } from "@/features/agency-app/api/agency-app.queries";
import { useWizardStore } from "@/features/agency-app/stores/wizard.store";
import { toast } from "sonner";
import { PlatformSelectorForm } from "@/components/agency-app/forms/PlatformSelectorForm";
import { PlatformSelectorSchema } from "@/features/agency-app/schemas/agency-app.schemas";
import { useMemo } from "react";

export function Step2Platforms() {
  const { appId, setStep } = useWizardStore();
  const { data: myApp } = useMyAgencyApp();
  const { mutate, isPending } = useUpdatePlatformsMutation();

  const prevStep = () => setStep(1);
  
  const defaultValues = useMemo(() => {
    const channels = myApp?.channels;
    if (channels) {
      return { platform_ids: channels.map(c => c.channel_id.toString()) };
    }
    return { platform_ids: [] };
  }, [myApp]);

  const handleStep2Submit = (data: PlatformSelectorSchema) => {
    if (!appId) {
      toast.error("App ID not found. Please restart.");
      return;
    }

    mutate(
      { appId, payload: { platform_ids: data.platform_ids } },
      {
        onSuccess: () => {
          setStep(3);
          toast.success("Platforms saved");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to save platforms");
        },
      }
    );
  };

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Platforms</CardTitle>
          <CardDescription>Select the platforms you want to enable for your clients. You can add more later.</CardDescription>
        </CardHeader>
        <CardContent>
           <PlatformSelectorForm 
              defaultValues={defaultValues} 
              onSubmit={handleStep2Submit} 
              isPending={isPending} 
              prevStep={prevStep}
           />
        </CardContent>
      </Card>
    </motion.div>
  );
}
