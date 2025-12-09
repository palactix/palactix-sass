import { api } from "@/lib/api/client";
import { AGENCY_APP_API_ROUTES, CHANNEL_LIST } from "@/utils/constants/api-routes";
import { buildApiUrl } from "@/lib/utils/api-url";
import type {
  CreateAppPayload,
  CreateAppResponse,
  UpdateAppNamePayload,
  UpdateAppNameResponse,
  UpdatePlatformsPayload,
  UpdatePlatformsResponse,
  UpdateCredentialsPayload,
  UpdateCredentialsResponse,
  ActivateAppResponse,
  ReviewAppResponse,
  ChannelListResponse,
  MyAgencyAppResponse,
} from "../types/agency-app.types";

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

export async function updateAppName(appId: string, payload: UpdateAppNamePayload) {
  const url = buildApiUrl(AGENCY_APP_API_ROUTES.UPDATE_APP_NAME, { app: appId });
  const res = await api.post<UpdateAppNameResponse>(url, payload);
  return res.data;
}

export async function updateAppPlatforms(appId: string, payload: UpdatePlatformsPayload) {
  const url = buildApiUrl(AGENCY_APP_API_ROUTES.CREATE_APP_PLATFORMS, { app: appId });
  const res = await api.post<UpdatePlatformsResponse>(url, payload);
  return res.data;
}

export async function updateAppCredentials(appId: string, payload: UpdateCredentialsPayload) {
  const url = buildApiUrl(AGENCY_APP_API_ROUTES.CREATE_APP_PLATFORMS_CREDENTIALS, { app: appId });
  const res = await api.post<UpdateCredentialsResponse>(url, payload);
  return res.data;
}

export async function activateApp(appId: string) {
  const url = buildApiUrl(AGENCY_APP_API_ROUTES.ACTIVATE_APP, { app: appId });
  const res = await api.post<ActivateAppResponse>(url);
  return res.data;
}

export async function sendAppToReview(appId: string) {
  const url = buildApiUrl(AGENCY_APP_API_ROUTES.SEND_TO_REVIEW, { app: appId });
  const res = await api.post<ReviewAppResponse>(url);
  return res.data;
}
