"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, Plus } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useModal } from "@/components/providers/ModalProvider";
import { AvailableChannelsToLink } from "@/components/AvailableChannelsToLink";

import { LinkedAccount } from "@/types/platform";
import { useLinkedAccounts } from "@/features/clients/api/clients.queries";

interface ConnectedAccountsCardProps {
  clientId: number;
}

export function ConnectedAccountsCard({ clientId }: ConnectedAccountsCardProps) {
  const { openModal } = useModal();
  const { data, isLoading } = useLinkedAccounts(clientId);

  // Assume the API returns both linkedAccounts and availableChannels
  const linkedAccounts: LinkedAccount[] = data?.linked_accounts || [];
  const availableChannels = data?.channels || [];

  // Helper to get platform logo from slug
  const getPlatformLogo = (slug: string) => {
    return `/images/channels/${slug}.svg`;
  };

  return (
    <Card className="shadow-sm">
      <div className="p-6 border-b bg-muted/50">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Connected Accounts</h2>
          <Button
            variant="default"
            size="sm"
            className="gap-2"
            onClick={() => {
              openModal({
                title: "Connect New Account",
                description: "Select a platform to link with this client",
                size: "lg",
                content: (
                  <AvailableChannelsToLink
                    clientId={clientId}
                    availableChannels={availableChannels}
                  />
                ),
              });
            }}
          >
            <Plus className="h-4 w-4" />
            Connect New Account
          </Button>
        </div>
      </div>
      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">Loading accounts...</p>
          </div>
        ) : linkedAccounts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No connected accounts yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {linkedAccounts.map((account: any) => (
              <Card key={account.id} className="hover:shadow-md transition-shadow border-2">
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl border-2 bg-background flex items-center justify-center shrink-0 shadow-sm">
                      <Image
                        src={(account.avatar)}
                        alt={account.platform}
                        width={28}
                        height={28}
                        className="w-7 h-7 object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm mb-0.5">{account.platform}</p>
                      <p className="text-xs text-muted-foreground truncate mb-2">{account.username}</p>
                      <div className="flex items-center gap-1.5">
                        {account.status === "connected" ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-500" />
                        ) : (
                          <AlertTriangle className="h-3.5 w-3.5 text-orange-600 dark:text-orange-500" />
                        )}
                        <span className={`text-xs font-medium ${account.status === "connected" ? "text-green-600 dark:text-green-500" : "text-orange-600 dark:text-orange-500"}`}>
                          {account.statusText}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}