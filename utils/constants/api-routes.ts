export const AUTH_API_ROUTES = {
  SIGNUP: "/auth/register",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  CHECK_AUTH: "/oauth/me",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  RESEND_VERIFICATION: "/auth/resend-verification",
} as const;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const CHANNEL_LIST = "v1/channels";

export const AGENCY_APP_API_ROUTES = {
  CREATE_APP: "developer-apps",
  MY_AGENCY_APP: "developer-apps/my-agency-app",
  UPDATE_APP_NAME: "developer-apps/{app}/update-name",
  CREATE_APP_PLATFORMS: "developer-apps/{app}/platforms",
  CREATE_APP_PLATFORMS_CREDENTIALS: "developer-apps/{app}/platform-credentials",
  SEND_TO_REVIEW: "developer-apps/{app}/send-to-review",
  ACTIVATE_APP: "developer-apps/{app}/activate",
  DEACTIVATE_APP: "developer-apps/{app}/deactivate",
} as const;