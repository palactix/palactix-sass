"use client";

import { useLinkedAccounts } from "@/features/clients/api/clients.queries";
import { useChannelConnect } from "@/hooks/use-channel-connect";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useChannelLogo } from "@/hooks/use-channel-logo";
import Image from "next/image";
import { Loader2, Link as LinkIcon } from "lucide-react";
import { Platform } from "@/types/platform";

interface AvailableChannelsToLinkProps {
  clientId: number;
  availableChannels?: Platform[];
  onConnect?: (channelId: string, channelName: string) => void;
}

export function AvailableChannelsToLink({ 
  clientId, 
  availableChannels: propChannels,
  onConnect 
}: AvailableChannelsToLinkProps) {
  const getChannelLogo = useChannelLogo();
  const { data, isLoading, error } = useLinkedAccounts(clientId);
  
  const { connectChannel, connectingChannel } = useChannelConnect({
    onSuccess: (channel) => {
      // Call the parent's onConnect callback if provided
      if (onConnect && channel) {
        onConnect(channel.id, channel.name);
      }
    },
  });

  // Use prop channels if provided, otherwise use fetched data
  if (!propChannels && isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!propChannels && error) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-destructive">Failed to load available channels</p>
        <p className="text-xs text-muted-foreground mt-1">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  const availableChannels = data?.channels || [];

  if (availableChannels.length === 0) {
    return (
      <div className="text-center py-12 space-y-3">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <LinkIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">No channels available</p>
          <p className="text-xs text-muted-foreground mt-1">
            Please configure channels in your developer app first
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {availableChannels.map((channel) => (
          <Card 
            key={channel.id} 
            className="hover:shadow-md transition-all border-2 hover:border-primary/50"
          >
            <div className="p-5">
              <div className="flex items-start gap-4">
                {/* Channel Logo */}
                <div className="w-14 h-14 rounded-xl border-2 bg-background flex items-center justify-center shrink-0 shadow-sm">
                  <Image
                    src={getChannelLogo(channel.icon)}
                    alt={channel.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                </div>

                {/* Channel Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-sm mb-1">{channel.name}</h3>
                      
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="w-full mt-3 gap-2"
                    onClick={() => connectChannel(channel)}
                    disabled={!!connectingChannel}
                  >
                    <LinkIcon className="h-3.5 w-3.5" />
                    {connectingChannel === channel.slug ? "Connecting..." : `Connect`}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Info Footer */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
        <p className="text-xs text-muted-foreground text-center">
          💡 Showing {availableChannels.length} channel{availableChannels.length !== 1 ? 's' : ''} 
          {" "}configured in your agency
        </p>
      </div>
    </div>
  );
}
