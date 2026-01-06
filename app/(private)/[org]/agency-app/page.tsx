"use client"

import { AgencyAppWizard } from "@/components/agency-app/AgencyAppWizard"
import { AgencyAppDashboard } from "@/components/agency-app/dashboard"
import { useMyAgencyApp } from "@/features/agency-app/api/agency-app.queries"
import { Loader2 } from "lucide-react"
import { AppStatus } from "@/features/agency-app/types/agency-app.types"
import { withPermission } from "@/components/shared/withPermission"
import { PERMISSIONS } from "@/utils/constants/permissions"

export function AgencyAppPage() {
  const { data: myApp, isLoading, isError, error, refetch } = useMyAgencyApp()

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col h-[50vh] w-full items-center justify-center gap-4">
        <div className="text-destructive font-medium">Failed to load agency app data.</div>
        <p className="text-sm text-muted-foreground">{error?.message || "Unknown error occurred"}</p>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  // Show dashboard if app is in review or live
  if (myApp && (myApp.status === AppStatus.REVIEW || myApp.is_live === 1)) {
    return <AgencyAppDashboard />
  }

  // Otherwise show wizard (for draft, rejected, or no app)
  return <AgencyAppWizard onComplete={() => {
  }} />
}


export default withPermission(AgencyAppPage, PERMISSIONS.DEVELOPER_APP.MANAGE);