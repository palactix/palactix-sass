"use client";

import { AlertWarning } from "@/components/shared/alert";

export function ReviewStatusAlert() {
  return (
    <AlertWarning
      title="Verification Required"
      message="Your app setup is in progress. Platform credentials are pending verification. Please complete verification to enable the channel for your clients."
    />
  );
}
