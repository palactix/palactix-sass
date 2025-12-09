export interface CreateClientPayload {
  name: string;
  email: string;
  password?: string;
}

export interface CreateClientResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface Client {
  id: number;
  name: string;
  email: string;
  status: string;
  created_at: string;
  avatar?: string;
}

export enum ClientStatus {
  active = "active",
  inactive = "inactive",
  pending = "pending"
}
