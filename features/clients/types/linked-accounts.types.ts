import { Channel } from "@/features/agency-app/types/agency-app.types";

export interface LinkedAccount {
  id: number;
  name: string;
  avatar: string;
  username: string;
  channel?: Channel;
}

export interface LinkedAccountsResponse {
  developer_app_id: string;
  channels: Channel[];
  linked_accounts: LinkedAccount[];
}
