"use client";

import { useMyAgencyApp, useChannels } from "@/features/agency-app/api/agency-app.queries";
import { AppStatus } from "@/features/agency-app/types/agency-app.types";
import { Loader2 } from "lucide-react";
import { DashboardHeader } from "./DashboardHeader";
import { ReviewStatusAlert } from "./ReviewStatusAlert";
import { ConnectedPlatforms } from "./ConnectedPlatforms";
import { AppDetails } from "./AppDetails";
import { useMemo } from "react";
import { ConnectedPlatform } from "./types";


export function AgencyAppDashboard() {
  const { data: myApp, isLoading: isAppLoading } = useMyAgencyApp();
  const { data: allChannels, isLoading: isChannelsLoading } = useChannels();

  const platforms: ConnectedPlatform[] = useMemo(() => {
    if (!myApp || !allChannels) return [];
    
    return allChannels.map(channel => {
      const appChannel = myApp.channels?.find(c => c.channel_id === channel.id);
      const isConnected = !!(appChannel && (appChannel.client_id || appChannel.client_secret));
      return {
        ...channel,
        color: "",
        channelId: channel.id,
        connected: isConnected,
        lastUsed: isConnected ? "Active" : undefined,
        appId: appChannel?.client_id || undefined,
        is_verified: appChannel?.is_verified || false,
      }
    });
  }, [myApp, allChannels]);

  if (isAppLoading || isChannelsLoading || !myApp) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 space-y-10">
      <DashboardHeader 
        appId={myApp.id}
        appName={myApp.name || "My Agency App"} 
        status={myApp.status} 
        platforms={platforms} 
      />
      
      {myApp.status === AppStatus.REVIEW && <ReviewStatusAlert />}
      
      <ConnectedPlatforms platforms={platforms} appId={myApp.id} />
      
      <AppDetails />
    </div>
  );
}
