import Image from "next/image";
import { useFormContext, useWatch } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChannelLogo } from "@/hooks/use-channel-logo";
import { LinkedAccount, Platform } from "@/types/platform";
import { MediaItem } from "@/types/scheduler";

interface AccountPreviewRailProps {
  accountsMap: Map<string, LinkedAccount>;
  channelMap: Map<string, Platform>;
}

const getPlatformBadgeColor = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "instagram":
      return "bg-gradient-to-br from-purple-500 to-pink-500 text-white";
    case "linkedin":
      return "bg-blue-600 text-white";
    case "x":
      return "bg-black dark:bg-white text-white dark:text-black";
    case "facebook":
      return "bg-blue-500 text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function AccountPreviewRail({ accountsMap, channelMap }: AccountPreviewRailProps) {
  const { control } = useFormContext();
  const selectedAccountIds = useWatch({ control, name: "selectedAccounts" }) as string[];
  const media = useWatch({ control, name: "media" }) as MediaItem[];
  const globalCaption = useWatch({ control, name: "globalCaption" }) as string;
  const perAccountCaptions = useWatch({ control, name: "perAccountCaptions" }) as Record<string, string>;
  const separateCaptions = useWatch({ control, name: "separateCaptions" }) as boolean;
  const platformLogo = useChannelLogo();

  if (selectedAccountIds.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="rounded-full bg-muted p-3 w-fit mx-auto mb-2">
          <AlertCircle className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-3">
        {selectedAccountIds.map((accountId) => {
          const account = accountsMap.get(String(accountId));
          if (!account) return null;
          const platform = channelMap.get(String(account.channel_id));
          const captionForAccount = separateCaptions
            ? perAccountCaptions[accountId] ?? globalCaption
            : globalCaption;

          return (
            <TooltipProvider key={accountId}>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <div className="relative cursor-pointer hover:scale-110 transition-transform">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border hover:border-primary">
                      <Image src={account.avatar} alt={account.username} width={48} height={48} className="object-cover" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-background bg-background flex items-center justify-center shadow-sm">
                      <Image
                        src={platformLogo(platform?.icon || {})}
                        alt={platform?.name || account.channel_slug}
                        width={16}
                        height={16}
                        className="w-4 h-4 object-contain"
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="p-0 w-80 border-2">
                  <div className="bg-background">
                    <div className="p-4 border-b">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border">
                          <Image src={account.avatar} alt={account.username} width={40} height={40} className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{account.username}</p>
                          <p className="text-xs text-muted-foreground">Just now</p>
                        </div>
                        <Badge className={`text-xs ${getPlatformBadgeColor(platform?.name || account.channel_slug || "")}`}>
                          {platform?.name || account.channel_slug}
                        </Badge>
                      </div>
                    </div>

                    {media.length > 0 && (
                      <div className="relative aspect-square bg-muted">
                        {media[0].type === "video" ? (
                          <video src={media[0].url} className="w-full h-full object-cover" controls />
                        ) : (
                          <Image src={media[0].url} alt={media[0].altText || ""} fill className="object-cover" />
                        )}
                        {media.length > 1 && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-black/70 text-white border-0">
                              1 / {media.length}
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-4">
                      <p className="text-sm whitespace-pre-wrap">
                        <span className="font-semibold">{account.username}</span>{" "}
                        {captionForAccount || "No caption yet..."}
                      </p>
                      {!captionForAccount && (
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          Add a caption to see the full preview
                        </p>
                      )}
                    </div>

                    <div className="px-4 pb-4 flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1.5 text-xs">
                        <div className="w-5 h-5 rounded-full border flex items-center justify-center">❤️</div>
                        <span>0</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <div className="w-5 h-5 rounded-full border flex items-center justify-center">💬</div>
                        <span>0</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <div className="w-5 h-5 rounded-full border flex items-center justify-center">↗️</div>
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </ScrollArea>
  );
}
