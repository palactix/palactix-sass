export enum AppStatus {
  ACTIVE = 1,
  DRAFT = 2,
  REVIEW = 3,
  REJECT = 4,
}

export interface ChannelIcon {
  "logo-black-png"?: string;
  "logo-black-svg"?: string;
  "logo-white-png"?: string;
  "logo-white-svg"?: string;
  "logo-png"?: string;
  "logo-svg"?: string;
}

export interface Channel {
  id: number;
  name: string;
  slug: string;
  icon: ChannelIcon;
  api_url: string;
  version?: string | null;
  supports_refresh: number; // 0 or 1
}

export interface AgencyAppChannel {
  id: number;
  developer_app_id: string;
  channel_id: number;
  client_id: string | null;
  client_secret: string | null;
  created_at: string;
  updated_at: string;
}

export interface AgencyApp {
  id: string;
  user_id: number;
  oauth_client_id: string;
  name: string;
  icon: string | null;
  description: string;
  type: string;
  status: AppStatus; // DRAFT, REVIEW, ACTIVE, REJECT
  is_live: number; // 0 or 1
  updated_at: string;
  channels: AgencyAppChannel[];
}

export interface CreateAppPayload {
  name: string;
  description?: string;
}

export type CreateAppResponse = AgencyApp;

export interface UpdateAppNamePayload {
  name: string;
}

export type UpdateAppNameResponse = AgencyApp;

export interface UpdatePlatformsPayload {
  platform_ids: number[];
}

export interface UpdatePlatformsResponse {
  message: string;
  data: AgencyApp;
}

export interface PlatformCredential {
  platform_id: number;
  credentials: Record<string, string>;
}

export interface UpdateCredentialsPayload {
  credentials: PlatformCredential[];
}

export interface UpdateCredentialsResponse {
  message: string;
  data: AgencyApp;
}

export interface ActivateAppResponse {
  message: string;
  data: AgencyApp;
}

export interface ReviewAppResponse {
  message: string;
  data: AgencyApp;
}

export type ChannelListResponse = Channel[];

// User requested to remove .data wrapper
export type MyAgencyAppResponse = AgencyApp;
