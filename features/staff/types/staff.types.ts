export interface CreateStaffPayload {
  name?: string;
  email: string;
  password?: string;
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
  role: string;
  status: string;
  created_at: string;
  avatar?: string;
}
