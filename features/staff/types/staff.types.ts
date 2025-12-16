
import { User, UserStatus as StaffUserStatus } from "@/types/user";

export interface CreateStaffPayload {
  name?: string;
  email: string;
  role_id: number;
}

export interface CreateStaffResponse {
  message: string;
  user: User;
}

export type Staff = User

export interface AssignedClient {
  id: number;
  name: string;
  email: string;
  status: string;
  assigned_at: string;
  platforms: {
    id: number;
    name: string;
    username: string;
    avtar: string;
    channel: {
      name: string;
      slug: string;
      icon: {
        "logo-black-png": string;
        "logo-white-png": string;
        "logo-svg": string;
      };
    };
  }[];
  last_post_at: string | null;
}