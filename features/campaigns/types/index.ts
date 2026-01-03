import { User } from "@/types/user"

export type Campaign = {
  id: string,
  organization_id: string,
  user_id: string,
  name: string,
  description: string,
  start_date: string,
  end_date: string,
  status: "active" | "paused" | "completed" | "archived",
  goal: string,
  budget: number,
  color: string,
  posts_count: number,
  created_at: string,
  updated_at: string,
  user?: User
}

export interface CreateCampaignPayload {
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  goal?: string;
  budget?: number;
  color?: string;
}

export interface UpdateCampaignPayload extends Partial<CreateCampaignPayload> {
  status?: "active" | "paused" | "completed" | "archived";
}

export interface CreateCampaignResponse {
  message: string;
  campaign: Campaign;
}

export interface UpdateCampaignResponse {
  message: string;
  campaign: Campaign;
}

export interface CampaignsResponse {
  campaigns: Campaign[];
  total: number;
}