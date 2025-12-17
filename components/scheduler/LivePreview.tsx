import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useChannelLogo } from "@/hooks/use-channel-logo";
import { LinkedAccount, Platform } from "@/types/platform";
import { MediaItem } from "@/types/scheduler";

interface LivePreviewProps {
  selectedAccountIds: string[];
  accountsMap: Map<string, LinkedAccount>;
  channelMap: Map<string, Platform>;
  media: MediaItem[];
  caption: string;
  perAccountCaptions: Record<string, string>;
}

export function LivePreview({
  selectedAccountIds,
  accountsMap,
  channelMap,
  media,
  caption,
  perAccountCaptions,
}: LivePreviewProps) {
  const platformLogo = useChannelLogo();

  const effectiveCaption = selectedAccountIds.length === 1
    ? perAccountCaptions[selectedAccountIds[0]] || caption
    : caption;

  return (
    <Card className="p-4 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden border">
            <Image src="/images/placeholder-avatar.png" alt="avatar" width={48} height={48} className="object-cover" />
          </div>
          {selectedAccountIds[0] && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background bg-background flex items-center justify-center">
              {(() => {
                const account = accountsMap.get(String(selectedAccountIds[0]));
                const platform = channelMap.get(String(account?.channel_id));
                return (
                  <Image
                    src={platformLogo(platform?.icon || {})}
                    alt={platform?.name || ""}
                    width={14}
                    height={14}
                    className="object-contain"
                  />
                );
              })()}
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold text-sm">
            {selectedAccountIds[0] ? accountsMap.get(String(selectedAccountIds[0]))?.username : "Your brand"}
          </p>
          <p className="text-xs text-muted-foreground">
            {selectedAccountIds[0]
              ? channelMap.get(String(accountsMap.get(String(selectedAccountIds[0]))?.channel_id))?.name
              : "Platform preview"}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm whitespace-pre-wrap leading-relaxed break-words">{effectiveCaption || "Your caption preview"}</p>
        {media.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {media.map((item) => (
              <div key={item.id} className="relative rounded-md overflow-hidden border bg-muted/30">
                <Image src={item.url} alt={item.altText || "Media"} width={320} height={320} className="object-cover w-full h-32" />
                <Badge className="absolute top-1 right-1 text-[10px] px-1.5 py-0.5 capitalize">
                  {item.type}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed rounded-md p-6 text-center text-xs text-muted-foreground">
            Media preview will appear here
          </div>
        )}
      </div>

      <Separator />

      {selectedAccountIds.length > 1 ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground">Per-account preview</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {selectedAccountIds.map((id) => {
              const account = accountsMap.get(String(id));
              const platform = channelMap.get(String(account?.channel_id));
              return (
                <Card key={id} className="p-3 border">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full overflow-hidden border">
                        <Image src={account?.avatar || "/images/placeholder-avatar.png"} alt={account?.username || ""} width={32} height={32} className="object-cover" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background bg-background flex items-center justify-center">
                        <Image
                          src={platformLogo(platform?.icon || {})}
                          alt={platform?.name || ""}
                          width={10}
                          height={10}
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{account?.username}</p>
                      <p className="text-[10px] text-muted-foreground">{platform?.name || account?.channel_slug}</p>
                    </div>
                  </div>
                  <p className="text-xs whitespace-pre-wrap leading-relaxed break-words">
                    {perAccountCaptions[id] || effectiveCaption || "No caption yet"}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Your post will look similar on the selected platform. Adjust media or caption to see live changes.
        </p>
      )}
    </Card>
  );
}
