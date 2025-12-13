import { Role } from "@/features/roles/types/role.types";

export interface CreateStaffPayload {
  name?: string;
  email: string;
  role_id: number;
}

export interface CreateStaffResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface Staff {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: string;
  created_at: string;
  avatar?: string;
}

export enum UserStatus {
  active = "active",
  inactive = "inactive",
  pending = "pending"
}

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