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

export type ForgotPasswordPayload = {
  email: string;
};

export type ForgotPasswordResponse = {
  message: string;
};

export type ResetPasswordPayload = {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type ResetPasswordResponse = {
  message: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
};

export type UserResponse = User | null;
