import { api } from "@/lib/api/client";
import { AGENCY_APP_API_ROUTES, CHANNEL_LIST } from "@/utils/constants/api-routes";
import type {
  CreateAppPayload,
  CreateAppResponse,
  UpdatePlatformsPayload,
  UpdatePlatformsResponse,
  UpdateCredentialsPayload,
  UpdateCredentialsResponse,
  ActivateAppResponse,
  ReviewAppResponse,
  ChannelListResponse,
  MyAgencyAppResponse,
} from "../types/agency-app.types";

// Helper to replace {app} in routes
const getRoute = (route: string, appId: string) => route.replace("{app}", appId);

export async function getChannels() {
  const res = await api.get<ChannelListResponse>(CHANNEL_LIST);
  return res.data;
}

export async function getMyAgencyApp() {
  const res = await api.get<MyAgencyAppResponse>(AGENCY_APP_API_ROUTES.MY_AGENCY_APP);
  return res.data;
}

export async function createApp(payload: CreateAppPayload) {
  const res = await api.post<CreateAppResponse>(AGENCY_APP_API_ROUTES.CREATE_APP, payload);
  return res.data;
}

export async function updateAppPlatforms(appId: string, payload: UpdatePlatformsPayload) {
  const url = getRoute(AGENCY_APP_API_ROUTES.CREATE_APP_PLATFORMS, appId);
  const res = await api.post<UpdatePlatformsResponse>(url, payload);
  return res.data;
}

export async function updateAppCredentials(appId: string, payload: UpdateCredentialsPayload) {
  const url = getRoute(AGENCY_APP_API_ROUTES.CREATE_APP_PLATFORMS_CREDENTIALS, appId);
  const res = await api.post<UpdateCredentialsResponse>(url, payload);
  return res.data;
}

export async function activateApp(appId: string) {
  const url = getRoute(AGENCY_APP_API_ROUTES.ACTIVATE_APP, appId);
  const res = await api.post<ActivateAppResponse>(url);
  return res.data;
}

export async function sendAppToReview(appId: string) {
  const url = getRoute(AGENCY_APP_API_ROUTES.SEND_TO_REVIEW, appId);
  const res = await api.post<ReviewAppResponse>(url);
  return res.data;
}
