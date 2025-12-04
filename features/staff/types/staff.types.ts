export interface CreateStaffPayload {
  name: string;
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
