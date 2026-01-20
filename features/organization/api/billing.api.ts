
import { api } from "@/lib/api/client";
import { buildApiUrl } from "@/lib/utils/api-url";
import { AGENCY_ROUTES } from "@/utils/constants/api-routes";

export async function startBilling(orgSlug: string, price: string) {
  const url = buildApiUrl(AGENCY_ROUTES.START_BILLING, { orgSlug, price });
  const res = await api.get(url);
  return res.data;
}