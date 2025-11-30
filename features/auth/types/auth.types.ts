export type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

export type SignupResponse = {
  message: string;
};

export type ResendVerificationPayload = {
  email: string;
};

export type ResendVerificationResponse = {
  message: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};
