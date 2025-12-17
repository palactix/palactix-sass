import { Card } from "@/components/ui/card";
import { LinkedAccountsResponse } from "@/features/clients/types/linked-accounts.types";
import { useChannelLogo } from "@/hooks/use-channel-logo";
import { LinkedAccount, Platform } from "@/types/platform";
import { Check } from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo } from "react";

export const AccountsBadge = ({
  channels,
  linked_accounts,
  selectedAccountIds,
  onChange,
}: LinkedAccountsResponse & {
  selectedAccountIds: string[];
  onChange?: (ids: string[]) => void;
}) => {
  const channelMap = useMemo(() => {
    const map = new Map<string, Platform>();
    channels.forEach((c) => map.set(String(c.id), c));
    return map;
  }, [channels]);

  const handleToggle = useCallback(
    (accountId: string) => {
      if (!onChange) return;
      const next = selectedAccountIds.includes(accountId)
        ? selectedAccountIds.filter((id) => id !== accountId)
        : [...selectedAccountIds, accountId];
      onChange(next);
    },
    [onChange, selectedAccountIds]
  );

  return linked_accounts.map((account) => (
    <AccountBadge
      key={account.id}
      account={account}
      selectedAccounts={selectedAccountIds}
      toggleAccount={handleToggle}
      platform={channelMap.get(String(account.channel_id))}
    />
  ));
};

export const AccountBadge = ({
  account,
  selectedAccounts,
  platform,
  toggleAccount,
}: {
  account: LinkedAccount;
  selectedAccounts: string[];
  platform?: Platform;
  toggleAccount: (accountId: string) => void;
}) => {
  const platformLogo = useChannelLogo();
  const isSelected = selectedAccounts.includes(`${account.id}`);

  return (
    <Card
      key={account.id}
      className={`p-4 cursor-pointer transition-all border-2 ${
        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
      }`}
      onClick={() => toggleAccount(`${account.id}`)}
      style={{ userSelect: "none" }}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border">
            <Image src={account.avatar} alt={account.username} width={40} height={40} className="object-cover" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background bg-background flex items-center justify-center">
            <Image
              src={platformLogo(platform?.icon || {})}
              alt={platform?.name || ""}
              width={14}
              height={14}
              className="w-3 h-3 object-contain"
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{account.username}</p>
          <p className="text-xs text-muted-foreground">{platform?.name || ""}</p>
        </div>
        {isSelected && (
          <div className="shrink-0">
            <div className="rounded-full bg-primary p-1">
              <Check className="h-3 w-3 text-primary-foreground" />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};