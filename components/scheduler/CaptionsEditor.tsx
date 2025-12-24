import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useFormContext, useWatch } from "react-hook-form";
import { LinkedAccount, Platform } from "@/types/platform";
import { useChannelLogo } from "@/hooks/use-channel-logo";

interface CaptionsEditorProps {
  accountsMap: Map<string, LinkedAccount>;
  channelMap: Map<string, Platform>;
}

export function CaptionsEditor({ accountsMap, channelMap }: CaptionsEditorProps) {
  const { control, setValue } = useFormContext();
  const selectedAccountIds = useWatch({ control, name: "selected_accounts" }) as string[];
  const separateCaptions = useWatch({ control, name: "separate_captions" }) as boolean;
  const globalCaption = useWatch({ control, name: "global_caption" }) as string;
  const perAccountCaptions = useWatch({ control, name: "per_account_captions" }) as Record<string, string>;
  const platformLogo = useChannelLogo();

  return (
    <Card className="p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Caption</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Write your post caption</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="gap-2">
            AI Generate
          </Button>
          <div className="flex items-center gap-2">
            <Label htmlFor="separate-captions" className="text-sm cursor-pointer">
              Separate captions
            </Label>
            <Switch
              id="separate-captions"
              checked={separateCaptions}
              onCheckedChange={(value) => setValue("separate_captions", value, { shouldDirty: true })}
            />
          </div>
        </div>
      </div>

      {!separateCaptions ? (
        <div>
          <Textarea
            placeholder="Write your caption here... Use #hashtags and @mentions"
            value={globalCaption}
            onChange={(e) => setValue("global_caption", e.target.value, { shouldDirty: true })}
            className="min-h-32 resize-none"
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">{globalCaption.length} characters</p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                Add Emoji
              </Button>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                Add Hashtags
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {selectedAccountIds.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Select accounts first to write separate captions</p>
            </div>
          ) : (
            selectedAccountIds.map((accountId) => {
              const account = accountsMap.get(String(accountId));
              if (!account) return null;
              const platform = channelMap.get(String(account.channel_id));
              const value = perAccountCaptions[accountId] ?? "";
              const handleUseGlobal = () => setValue("per_account_captions", { ...perAccountCaptions, [accountId]: globalCaption }, { shouldDirty: true });

              return (
                <Card key={accountId} className="p-3 border-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <div className="w-7 h-7 rounded-full overflow-hidden border">
                          <Image src={account.avatar} alt={account.username} width={28} height={28} className="object-cover" />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background bg-background flex items-center justify-center">
                          <Image
                            src={platformLogo(platform?.icon || {})}
                            alt={platform?.name || ""}
                            width={10}
                            height={10}
                            className="w-2 h-2 object-contain"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-xs">{account.username}</p>
                        <p className="text-[10px] text-muted-foreground">{platform?.name || account.channel_slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] text-muted-foreground">{value.length} characters</p>
                      <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2" onClick={handleUseGlobal}>
                        Use Global
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    placeholder={`Caption for ${account.username}...`}
                    value={value}
                    onChange={(e) => setValue("per_account_captions", { ...perAccountCaptions, [accountId]: e.target.value }, { shouldDirty: true })}
                    className="min-h-16 resize-none text-xs"
                  />
                </Card>
              );
            })
          )}
        </div>
      )}
    </Card>
  );
}
