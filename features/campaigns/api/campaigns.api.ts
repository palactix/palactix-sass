import { api } from "@/lib/api/client";
import { CAMPAIGN_ROUTES } from "@/utils/constants/api-routes";
import {
  Campaign,
  CreateCampaignPayload,
  UpdateCampaignPayload,
  CreateCampaignResponse,
  UpdateCampaignResponse,
  CampaignsResponse
} from "../types";
import { LaravelPagination, PaginationParams } from "@/types/api";
import { buildApiUrl } from "@/lib/utils/api-url";

export async function createCampaign(payload: CreateCampaignPayload) {
  const res = await api.post<CreateCampaignResponse>(CAMPAIGN_ROUTES.CREATE_CAMPAIGN, payload);
  return res.data;
}

export async function getCampaigns(params?: PaginationParams) {
  const res = await api.get<LaravelPagination<Campaign>>(CAMPAIGN_ROUTES.CAMPAIGNS, { params });
  return res.data;
}

export async function updateCampaign(campaignId: string, payload: UpdateCampaignPayload) {
  const url = buildApiUrl(CAMPAIGN_ROUTES.UPDATE_CAMPAIGN, { campaignId });
  const res = await api.put<UpdateCampaignResponse>(url, payload);
  return res.data;
}

export async function deleteCampaign(campaignId: string) {
  const url = buildApiUrl(CAMPAIGN_ROUTES.DELETE_CAMPAIGN, { campaignId });
  const res = await api.delete(url);
  return res.data;
}

export async function activateCampaign(campaignId: string) {
  const url = buildApiUrl(CAMPAIGN_ROUTES.ACTIVATE_CAMPAIGN, { campaignId });
  const res = await api.post(url);
  return res.data;
}

export async function deactivateCampaign(campaignId: string) {
  const url = buildApiUrl(CAMPAIGN_ROUTES.DEACTIVATE_CAMPAIGN, { campaignId });
  const res = await api.post(url);
  return res.data;
}