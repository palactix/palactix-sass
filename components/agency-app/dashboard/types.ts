import { Platform } from "./types";

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

export type Platform = {
  id: string;
  name: string;
  icon: any; // Using any for now to match existing structure, ideally should be specific type
  color: string;
  connected: boolean;
  lastUsed?: string;
  appId?: string;
  optional?: boolean;
  disabled?: boolean;
  badge?: string;
  channelId: number;
};
