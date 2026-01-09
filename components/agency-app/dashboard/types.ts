import { Platform } from "@/types/platform";

export type DashboardHeaderProps = {
  appName: string;
  status: number;
  platforms: Platform[];
};

export type ConnectedPlatformsProps = {
  platforms: Platform[];
};

export type AppDetailsProps = {
  description: string;
  appName: string;
  platforms: Platform[];
};

export interface ConnectedPlatform extends Platform{
  color: string;
  connected: boolean;
  lastUsed?: string;
  appId?: string;
  optional?: boolean;
  disabled?: boolean;
  badge?: string;
  channelId: string;
  is_verified: boolean;
};
