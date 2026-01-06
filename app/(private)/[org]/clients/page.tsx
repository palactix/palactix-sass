"use client";
import { ClientListing } from "@/components/clients/ClientListing";
import { withPermission } from "@/components/shared/withPermission";
import { PERMISSIONS } from "@/utils/constants/permissions";

export function ClientPage() {
  return <div className="container py-10"><ClientListing /></div>;
}

export default withPermission(ClientPage, PERMISSIONS.CLIENTS.VIEW);