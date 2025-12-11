import { api } from "@/lib/api/client";
import { AGENCY_ROUTES } from "@/utils/constants/api-routes";
import { buildApiUrl } from "@/lib/utils/api-url";
import { OrganizationPermissions } from "../types/permissions.types";

export async function getOrganizationPermissions(orgSlug: string) {
  const url = buildApiUrl(AGENCY_ROUTES.PERMISSIONS, { orgSlug });
  const res = await api.get<OrganizationPermissions>(url);
  return res.data;
}
