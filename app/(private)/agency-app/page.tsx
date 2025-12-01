"use client"

import { useState } from "react"
import { AgencyAppWizard } from "@/components/agency-app/wizard"
import { AgencyAppDashboard } from "@/components/agency-app/dashboard"

export default function AgencyAppPage() {
  // In a real app, this would be fetched from the backend
  const [isConfigured, setIsConfigured] = useState(false)

  if (isConfigured) {
    return <AgencyAppDashboard />
  }

  return <AgencyAppWizard onComplete={() => setIsConfigured(true)} />
}
