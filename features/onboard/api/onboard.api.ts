import { api } from "@/lib/api/client";
import { AGENCY_ROUTES } from "@/utils/constants/api-routes";
import { OnboardInfoResponse } from "../types/onboard.types";
import { buildApiUrl } from "@/lib/utils/api-url";

export async function getOnboardInfo(orgId: string) {
  const url = buildApiUrl(AGENCY_ROUTES.ONBOARD_INFO, { orgId });
  const res = await api.get<OnboardInfoResponse>(url);
  return res.data;
}
