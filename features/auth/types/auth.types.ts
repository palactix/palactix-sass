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
