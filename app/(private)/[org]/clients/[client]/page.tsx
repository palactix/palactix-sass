"use client";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";
import { useParams } from "next/navigation";
import { Suspense } from "react";

export default function ClientPage() {
  const params = useParams();
  const clientId = params?.client ? parseInt(params.client as string) : null;

  return (
    <Suspense fallback={<div>Loading client...</div>}>
      {clientId && <ClientDashboard clientId={clientId} />}
    </Suspense>
  )
}