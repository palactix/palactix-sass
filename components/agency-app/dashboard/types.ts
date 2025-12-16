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


