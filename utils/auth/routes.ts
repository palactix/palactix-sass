export const AUTH_ROUTES = {
  ROOT: "/auth",
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
} as const;

export const AUTH_API_ROUTES = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  SIGNUP: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  RESEND_VERIFICATION: "/auth/resend-verification-email",
} as const;