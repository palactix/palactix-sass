export const AUTH_API_ROUTES = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  SIGNUP: "/auth/register",
  CHECK_AUTH: "/auth/me",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  RESEND_VERIFICATION: "/auth/resend-verification-email",
} as const;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";