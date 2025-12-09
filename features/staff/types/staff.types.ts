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

export enum UserStatus{
  active = "active",
  inactive = "inactive",
  pending = "pending"
}