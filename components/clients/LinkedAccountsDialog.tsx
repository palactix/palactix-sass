"use client";

import { Loader2, Link2, ExternalLink } from "lucide-react";
import { useLinkedAccounts } from "@/features/clients/api/clients.queries";
import { useChannelConnect } from "@/hooks/use-channel-connect";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useChannelLogo } from "@/hooks/use-channel-logo";


interface LinkedAccountsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  client: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
}

export function LinkedAccountsDialog({
  isOpen,
  onClose,
  client,
}: LinkedAccountsDialogProps) {
  const { data, isLoading } = useLinkedAccounts(isOpen ? client.id : null);
  const { connectChannel, connectingChannel } = useChannelConnect({
    onSuccess: () => {
      // Refresh the linked accounts data or close dialog
      // The hook already shows success toast
    },
    onError: (error) => {
      console.error("Channel connection error:", error);
    },
  });

  const getChannelIcon = useChannelLogo();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={client.avatar} />
              <AvatarFallback>{client.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>{client.name}</DialogTitle>
              <DialogDescription className="text-xs">{client.email}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Linked Accounts Section */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                Linked Accounts
              </h4>
              
              {data?.linked_accounts && data.linked_accounts.length > 0 ? (
                <div className="space-y-2">
                  {data.linked_accounts.map((account) => (
                    <div 
                      key={account.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={account.avatar} />
                        <AvatarFallback>{account.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{account.name}</p>
                        <p className="text-xs text-muted-foreground truncate">@{account.username}</p>
                      </div>
                      {account.channel && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Image 
                                src={getChannelIcon(account.channel.icon)} 
                                alt={account.channel.name}
                                className="h-5 w-5 object-contain"
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{account.channel.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed">
                  <Link2 className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No accounts linked yet</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    Click a channel below to connect an account
                  </p>
                </div>
              )}
            </div>

            {/* Available Channels Section */}
            {data?.channels && data.channels.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Connect New Account
                </h4>
                
                <div className="flex flex-wrap gap-2">
                  <TooltipProvider>
                    {data.channels.map((channel) => (
                      <Tooltip key={channel.id}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => connectChannel(channel)}
                            disabled={!!connectingChannel}
                            className={`p-3 rounded-lg border bg-card hover:bg-accent hover:border-primary/50 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                              connectingChannel === channel.slug ? "opacity-50 cursor-wait" : ""
                            }`}
                          >
                            <Image 
                              src={getChannelIcon(channel.icon)} 
                              alt={channel.name}
                              width={50}
                              height={50}
                              className="h-7 w-7 object-contain"
                            />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p className="font-medium">{channel.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {connectingChannel === channel.slug ? "Connecting..." : "Click to connect"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
