export const AUTH_API_ROUTES = {
  SIGNUP: "/auth/signup",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  CHECK_AUTH: "/oauth/me",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  RESEND_VERIFICATION: "/auth/resend-verification",
} as const;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";