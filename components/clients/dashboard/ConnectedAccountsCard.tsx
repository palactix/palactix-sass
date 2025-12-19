"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useModal } from "@/components/providers/ModalProvider";
import { AvailableChannelsToLink } from "@/components/AvailableChannelsToLink";

import { LinkedAccount } from "@/types/platform";
import { useLinkedAccounts } from "@/features/clients/api/clients.queries";
import { AccountLoader } from "@/components/shared/LinkedAccounts/AccountLoader";
import { AccountsBadge } from "@/components/shared/LinkedAccounts/AccountsBadge";
import { Plus } from "lucide-react";

interface ConnectedAccountsCardProps {
  clientId: number;
}

export function ConnectedAccountsCard({ clientId }: ConnectedAccountsCardProps) {
  const { openModal } = useModal();
  const { data, isLoading } = useLinkedAccounts(clientId);

  // Assume the API returns both linkedAccounts and availableChannels
  const linkedAccounts: LinkedAccount[] = data?.linked_accounts || [];
  const availableChannels = data?.channels || [];

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
      <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-3">
        { isLoading && <AccountLoader /> }
        { linkedAccounts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No connected accounts yet</p>
            </div>
          ) 
        }
        { data && <AccountsBadge {...{...data, selectedAccountIds: []}}  /> }
      </div>
    </Card>
  );
}