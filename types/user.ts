export interface User {
  id: number;
  name: string;
  email: string;
  role?: Role;
  status: string;
  created_at: string;
  avatar?: string;
}

export interface Role {
  id: number;
  name: string;
}

export enum UserStatus {
  active = "active",
  inactive = "inactive",
  pending = "pending"
}