"use client";

import AgencyDashboard from "@/components/dashboard/AgencyDashboard";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";
import { useUser } from "@/features/auth/api/auth.queries";
import { useOrganizationStore } from "@/features/organization/stores/organization.store";
import { ROLE } from "@/utils/constants/roles";


export default function DashboardPage() {
  const { data: user } = useUser();
  const { currentOrganization } = useOrganizationStore();
  
  const role = currentOrganization?.pivot.role_id;
  
  if(user == null || role == null){
    return <div>Loading...</div>;
  }

  if(role == ROLE.CLIENT){
    return <ClientDashboard clientId={user.id} />;  
  } else {
    return <AgencyDashboard />;
  }
  
}