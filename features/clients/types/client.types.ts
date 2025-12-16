import { User } from "@/types/user";

export interface CreateClientPayload {
  name: string;
  email: string;
  password?: string;
}

export interface CreateClientResponse {
  message: string;
  user: User;
}

export type Client = User
