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
export const ROLES_LIST = "v1/roles";

export const AGENCY_APP_API_ROUTES = {
  CREATE_APP: "/organizations/{orgId}/developer-apps",
  MY_AGENCY_APP: "/organizations/{orgId}/developer-apps/my-agency-app",
  UPDATE_APP_NAME: "/organizations/{orgId}/developer-apps/{app}/update-name",
  CREATE_APP_PLATFORMS: "/organizations/{orgId}/developer-apps/{app}/platforms",
  CREATE_APP_PLATFORMS_CREDENTIALS: "/organizations/{orgId}/developer-apps/{app}/platform-credentials",
  SEND_TO_REVIEW: "/organizations/{orgId}/developer-apps/{app}/send-to-review",
  ACTIVATE_APP: "/organizations/{orgId}/developer-apps/{app}/activate",
  DEACTIVATE_APP: "/organizations/{orgId}/developer-apps/{app}/deactivate",
} as const;


export const AGENCY_ROUTES = {
  CREATE_STAFF: "/organizations/{orgId}/staff",
  STAFFS: "/organizations/{orgId}/staff",
  ACTIVE: "/organizations/{orgId}/staff/{userId}/activate",
  DEACTIVE: "/organizations/{orgId}/staff/{userId}/deactivate",
  DELETE: "/organizations/{orgId}/staff/{userId}",
  EXPORT_STAFF: "/organizations/{orgId}/staff/export",
  RESEND_INVITE: "/organizations/{orgId}/staff/{userId}/resend-invite",
  CANCEL_INVITE: "/organizations/{orgId}/staff/{userId}/cancel-invite",
  CREATE_PASSWORD: "/invitations/set-password",
  SEARCH_STAFF: "/organizations/{orgId}/staff/search",
  ASSIGN_CLIENTS: "/organizations/{orgId}/staff/{userId}/assign-clients",
};

export const CLIENT_ROUTES = {
  CREATE_CLIENT: "/organizations/{orgId}/clients",
  CLIENTS: "/organizations/{orgId}/clients",
  ACTIVATE: "/organizations/{orgId}/clients/{userId}/activate",
  DEACTIVATE: "/organizations/{orgId}/clients/{userId}/deactivate",
  DELETE: "/organizations/{orgId}/clients/{userId}",
  EXPORT_CLIENTS: "/organizations/{orgId}/clients/export",
  RESEND_INVITE: "/organizations/{orgId}/clients/{userId}/resend-invite",
  CANCEL_INVITE: "/organizations/{orgId}/clients/{userId}/cancel-invite",
  ASSIGN_STAFF: "/organizations/{orgId}/clients/{userId}/assign-staff",
  SEARCH_CLIENTS: "/organizations/{orgId}/clients/search",
};

export const NOTIFICATION_ROUTES = {
  LIST: "/notifications",
  MARK_AS_READ: "/notifications/{notificationId}/read",
  MARK_ALL_AS_READ: "/notifications/read-all",
  DELETE: "/notifications/{notificationId}",
  UNREAD_COUNT: "/notifications/unread-count",
};