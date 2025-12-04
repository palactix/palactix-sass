"use client";

import { AlertWarning } from "@/components/shared/alert";

export function ReviewStatusAlert() {
  return (
    <AlertWarning
      title="App Under Review"
      message="Your app has been submitted for review. We'll notify you once it's approved and live. You can view your configuration below, but changes are restricted during review."
    />
  );
}
