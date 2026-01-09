"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useCreateAppMutation, useMyAgencyApp, useUpdateAppNameMutation } from "@/features/agency-app/api/agency-app.queries";
import { useWizardStore } from "@/features/agency-app/stores/wizard.store";
import { toast } from "sonner";

export function Step1BasicInfo() {
  const { setAppId, setStep } = useWizardStore();
  const { data: myApp } = useMyAgencyApp();
  const { mutate, isPending } = useCreateAppMutation();
  const updateAppNameMutation = useUpdateAppNameMutation();

  
  const [appName, setAppName] = useState("");
  const initialized = useRef(false);

  useEffect(() => {
    const name = myApp?.name;
    if (name && !initialized.current) {
      setTimeout(() => {
        setAppName(name);
        initialized.current = true;
      }, 0);
    }
  }, [myApp]);

  const handleStep1Submit = () => {
    if (myApp?.id) {
        updateAppNameMutation.mutate(
          { appId: myApp.id, payload: { name: appName } },
          {
            onSuccess: (data) => {
              setAppId(myApp.id);
              setStep(2);
            },
            onError: (error) => {
              toast.error(error.message || "Failed to update app name");
            }
          }
        );
        return;
    }

    mutate({ name: appName }, {
      onSuccess: (res) => {
        setAppId(res?.id);
        setStep(2);
        toast.success("App created successfully");
      },
      onError: (err) => toast.error(err.message || "Failed to create app")
    });
  };

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Name Your App</CardTitle>
          <CardDescription>This name will appear on consent screens when your clients connect their accounts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="appName">App Name</Label>
            <Input 
              id="appName" 
              placeholder="e.g. Rivera Social App" 
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="text-lg py-6"
            />
            <p className="text-sm text-muted-foreground">
              Preview: <span className="font-medium text-foreground">{appName || "Your App Name"}</span> wants to access your Instagram account.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" disabled>Back</Button>
          <Button onClick={handleStep1Submit} disabled={!appName.trim() || isPending || updateAppNameMutation.isPending}>
            {(isPending || updateAppNameMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Next Step <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
