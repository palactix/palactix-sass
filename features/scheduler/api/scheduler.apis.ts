import { api } from "@/lib/api/client";
import { SCHEDULER_ROUTES } from "@/utils/constants/api-routes";
import { buildApiUrl } from "@/lib/utils/api-url";
import { SchedulePostPayload, SchedulePostResponse } from "../types";

export async function schedulePost(clientId: string, payload: SchedulePostPayload) {
  const url = buildApiUrl(SCHEDULER_ROUTES.SCHEDULE_POST, { clientId });
  const res = await api.post<SchedulePostResponse>(url, payload);
  return res.data;
}