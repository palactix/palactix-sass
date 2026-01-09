"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMyAgencyApp, useChannels } from "@/features/agency-app/api/agency-app.queries";
import { useLinkedAccounts } from "@/features/clients/api/clients.queries";
import { useUser } from "@/features/auth/api/auth.queries";
import { Plus, Check, AlertCircle, Edit, Trash2, Info } from "lucide-react";
import Image from "next/image";
import { useChannelLogo } from "@/hooks/use-channel-logo";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { buildOrgUrl } from "@/lib/utils/org-urls";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ConnectedChannels() {
  const router = useRouter();
  const { data: myApp, isLoading: isLoadingApp } = useMyAgencyApp();
  const { data: allChannels, isLoading: isLoadingChannels } = useChannels();
  const { data: user } = useUser();
  const { data: linkedAccountsData } = useLinkedAccounts(user?.id || null);
  const getChannelLogo = useChannelLogo();
  
  const [deleteChannelId, setDeleteChannelId] = useState<string | null>(null);

  // Build channel info with verification status and linked accounts
  const channelData = useMemo(() => {
    if (!myApp || !allChannels) return [];
    
    return allChannels.map(channel => {
      const appChannel = myApp.channels?.find(c => c.channel_id === channel.id);
      const hasCredentials = !!(appChannel && (appChannel.client_id || appChannel.client_secret));
      const isVerified = appChannel?.is_verified || false;
      
      // Count linked accounts for this channel
      const linkedAccounts = linkedAccountsData?.linked_accounts?.filter(
        acc => acc.channel_id === channel.id
      ) || [];
      
      return {
        ...channel,
        hasCredentials,
        isVerified,
        linkedAccountsCount: linkedAccounts.length,
        linkedAccounts,
        appChannelId: appChannel?.id,
      };
    });
  }, [myApp, allChannels, linkedAccountsData]);

  // Filter only channels with credentials added
  const connectedChannels = channelData.filter(c => c.hasCredentials);
  const verifiedChannels = connectedChannels.filter(c => c.isVerified);

  const handleAddChannel = () => {
    router.push(buildOrgUrl("/agency-app/credentials"));
  };

  const handleEditCredentials = (channelId: string) => {
    router.push(buildOrgUrl("/agency-app/credentials"));
  };

  const handleVerifyChannel = (channelId: string) => {
    router.push(buildOrgUrl("/agency-app/credentials"));
  };

  const handleDeleteChannel = (channelId: string) => {
    setDeleteChannelId(channelId);
  };

  const confirmDelete = () => {
    // TODO: Implement delete API call
    // For now, just close the dialog
    setDeleteChannelId(null);
  };

  if (isLoadingApp || isLoadingChannels) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Connected Channels</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="col-span-4">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle>Connected Channels</CardTitle>
              <CardDescription>
                Manage your platform credentials and view linked accounts
              </CardDescription>
            </div>
            <Button onClick={handleAddChannel} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Channel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Info Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Only verified channels are visible to clients when linking accounts.
            </AlertDescription>
          </Alert>

          {/* Channel List */}
          {connectedChannels.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium text-muted-foreground mb-1">No channels connected</p>
              <p className="text-xs text-muted-foreground mb-4">
                Add your platform credentials to start connecting client accounts
              </p>
              <Button onClick={handleAddChannel} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Channel
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {connectedChannels.map((channel) => (
                <div
                  key={channel.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                    channel.isVerified
                      ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50"
                      : "bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/50"
                  }`}
                >
                  {/* Channel Icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-background border-2 flex items-center justify-center p-2">
                    <Image
                      src={getChannelLogo(channel.icon)}
                      alt={channel.name}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>

                  {/* Channel Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold">{channel.name}</h4>
                      <Badge
                        variant={channel.isVerified ? "default" : "secondary"}
                        className={
                          channel.isVerified
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-orange-500 hover:bg-orange-600 text-white"
                        }
                      >
                        {channel.isVerified ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Activated
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Not Verified
                          </>
                        )}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {channel.linkedAccountsCount === 0 ? (
                        "No client accounts linked"
                      ) : (
                        <>
                          <span className="font-medium text-foreground">
                            {channel.linkedAccountsCount}
                          </span>{" "}
                          client {channel.linkedAccountsCount === 1 ? "account" : "accounts"} linked
                        </>
                      )}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!channel.isVerified && (
                      <Button
                        onClick={() => handleVerifyChannel(channel.id)}
                        size="sm"
                        variant="outline"
                        className="text-orange-600 border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/40"
                      >
                        Verify
                      </Button>
                    )}
                    <Button
                      onClick={() => handleEditCredentials(channel.id)}
                      size="sm"
                      variant="ghost"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteChannel(channel.id)}
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary Info */}
          {connectedChannels.length > 0 && (
            <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground border-t">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-600" />
                <span>{verifiedChannels.length} Verified</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span>{connectedChannels.length - verifiedChannels.length} Pending Verification</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteChannelId} onOpenChange={() => setDeleteChannelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Channel Credentials?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove your platform credentials for this channel. All linked client accounts will be
              disconnected and clients will need to reconnect their accounts after you add new credentials.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}