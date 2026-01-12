"use client";

import { useEffect } from "react";
import { useClientPageAccess } from "@/hooks/use-client-page-access";
import { FirstTimeClientSelector } from "@/components/shared/FirstTimeClientSelector";
import { Skeleton } from "@/components/ui/skeleton";

export default function SchedulerPage() {
  const { clientId, isLoading, showClientSelector, trackAccess } = useClientPageAccess({
    pageModule: "scheduler",
  });

  console.log({clientId, isLoading, showClientSelector, trackAccess})

  // Track client access when clientId is available
  useEffect(() => {
    if (clientId) {
      trackAccess();
    }
  }, [clientId, trackAccess]);

  // Show client selector for first-time users
  if (showClientSelector) {
    return <FirstTimeClientSelector open pageModule="scheduler" />;
  }

  // Show loading state while determining redirect
  if (isLoading || !clientId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 w-full max-w-md p-8">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  // This should never render since we redirect to /clients/{clientId}/scheduler
  // But just in case, show a message
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Redirecting to client scheduler...</p>
    </div>
  );
}