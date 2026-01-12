import { User } from "@/types/user";

export interface RecentClient {
  organization_id: number;
  staff_user_id: number;
  client_id: number;
  page_module: string;
  access_count: number;
  first_accessed_at: string;
  last_accessed_at: string;
  client: User;
}

export interface TrackClientAccessPayload {
  client_id: number;
  page_module: string;
}
