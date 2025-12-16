import { useLinkedAccounts } from "@/features/clients/api/clients.queries";
import { Card } from "../ui/card"
import { User } from "@/types/user";
import { AccountLoader } from "../shared/LinkedAccounts/AccountLoader";
import { AccountsBadge } from "../shared/LinkedAccounts/AccountsBadge";



export interface ChooseAccountProps {
  client: User
}

export const ChooseAccounts = ({
  client
}: ChooseAccountProps) => {
  const { data, isLoading } = useLinkedAccounts(15);

  
  return (
    <Card className="p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Choose Accounts</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Select which accounts to post to</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        { isLoading && <AccountLoader /> }
        { data && <AccountsBadge {...data} /> }
      </div>
    </Card>
  )
}
