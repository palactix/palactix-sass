"use client";

import { useEffect } from "react";
import { useWizardStore } from "@/features/agency-app/stores/wizard.store";
import { useMyAgencyApp } from "@/features/agency-app/api/agency-app.queries";
import { Step1BasicInfo } from "./wizard/Step1BasicInfo";
import { Step2Platforms } from "./wizard/Step2Platforms";
import { Step3Credentials } from "./wizard/Step3Credentials";
import { Step4Activation } from "./wizard/Step4Review";
import { Step5Success } from "./wizard/Step5Success";
import { Loader2 } from "lucide-react";
import { AppStatus } from "@/features/agency-app/types/agency-app.types";

interface AgencyAppWizardProps {
  onComplete: () => void;
}

export function AgencyAppWizard({ onComplete }: AgencyAppWizardProps) {
  const { currentStep, setAppId, setStep, setIsLive } = useWizardStore();
  const { data: myApp, isLoading } = useMyAgencyApp();

  // Initialize wizard state from server data
  useEffect(() => {
    if (myApp) {
      setAppId(myApp.id);
      setIsLive(myApp.is_live);
      
      // Intelligent step restoration
      if (myApp.is_live === 1) {
        onComplete();
      } else {
        // If we have channels with credentials, go to step 4 (Activation)
        // If we have channels, go to step 3 (Credentials)
        // If we have ID, go to step 2 (Platforms)
        // Otherwise step 1
        
        const hasCredentials = myApp.channels?.some(c => c.client_id && c.client_secret);
        const hasChannels = myApp.channels?.length > 0;

        if (hasCredentials) {
             setStep(4);
        } else if (hasChannels) {
             setStep(3);
        } else {
             setStep(2);
        }
      }
    }
  }, [myApp, setAppId, setIsLive, setStep, onComplete]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10 mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between px-2">
          {["Basic Info", "Platforms", "Credentials", "Review", "Success"].map((step, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;

            return (
              <div key={step} className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted bg-background text-muted-foreground"
                  }`}
                >
                  {stepNum}
                </div>
                <span
                  className={`text-xs font-medium ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
        <div className="relative mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="mt-8">
        {currentStep === 1 && <Step1BasicInfo />}
        {currentStep === 2 && <Step2Platforms />}
        {currentStep === 3 && <Step3Credentials />}
        {currentStep === 4 && <Step4Activation onComplete={onComplete} />}
        {currentStep === 5 && <Step5Success onComplete={onComplete} />}
      </div>
    </div>
  );
}
