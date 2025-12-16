
import { LinkedAccount, Platform } from "@/types/platform";


export interface LinkedAccountsResponse {
  developer_app_id: string;
  channels: Platform[];
  linked_accounts: LinkedAccount[];
}
