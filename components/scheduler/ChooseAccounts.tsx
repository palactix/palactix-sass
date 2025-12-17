import { Card } from "../ui/card";
import { User } from "@/types/user";
import { AccountLoader } from "../shared/LinkedAccounts/AccountLoader";
import { AccountsBadge } from "../shared/LinkedAccounts/AccountsBadge";
import { useLinkedAccounts } from "@/features/clients/api/clients.queries";
import { LinkedAccountsResponse } from "@/features/clients/types/linked-accounts.types";

export interface ChooseAccountsProps {
  client: User;
  selectedAccountIds: string[];
  onChange: (selected: string[]) => void;
  linkedAccountsData?: LinkedAccountsResponse;
  isLoadingOverride?: boolean;
}

export const ChooseAccounts = ({
  client,
  selectedAccountIds,
  onChange,
  linkedAccountsData,
  isLoadingOverride,
}: ChooseAccountsProps) => {
  const shouldFetch = !linkedAccountsData;
  const { data, isLoading } = useLinkedAccounts(shouldFetch ? client.id : null);
  const resolvedData = linkedAccountsData || data;
  const resolvedLoading = isLoadingOverride ?? isLoading;

  console.log("Rendering ChooseAccounts with:", {
    selectedAccountIds,
    resolvedData,
    resolvedLoading,
  });
  return (
    <Card className="p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Choose Accounts</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Select which accounts to post to</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {resolvedLoading && <AccountLoader />}
        {resolvedData && (
          <AccountsBadge
            {...resolvedData}
            selectedAccountIds={selectedAccountIds}
            onChange={onChange}
          />
        )}
      </div>
    </Card>
  );
}
