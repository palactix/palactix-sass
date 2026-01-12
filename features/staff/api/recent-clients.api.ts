import { api } from "@/lib/api/client";
import { AGENCY_ROUTES } from "@/utils/constants/api-routes";
import { RecentClient, TrackClientAccessPayload } from "../types/recent-clients.types";

export async function getRecentClients() {
  const res = await api.get<RecentClient[]>(AGENCY_ROUTES.RECENT_CLIENTS);
  return res.data;
}

export async function trackClientAccess(payload: TrackClientAccessPayload) {
  const res = await api.post(AGENCY_ROUTES.TRACK_RECENT_CLIENT, payload);
  return res.data;
}
