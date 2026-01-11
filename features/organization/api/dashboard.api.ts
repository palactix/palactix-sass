import { api } from "@/lib/api/client";
import { AGENCY_ROUTES } from "@/utils/constants/api-routes";
import { DashboardData } from "../types/dashboard.types";

export async function getDashboardData(orgSlug: string) {
  const url = AGENCY_ROUTES.DASHBOARD.replace('{orgId}', orgSlug);
  const res = await api.get<DashboardData>(url);
  return res.data;
}
