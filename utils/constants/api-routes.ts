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


const BLOG_URLS = {
  FETCH_POSTS: "/blog/posts",
  FETCH_POST_BY_SLUG: "/blog/posts/{slug}"
} as const;


export const AGENCY_APP_API_ROUTES = {
  CREATE_APP: "/organizations/{orgId}/developer-apps",
  MY_AGENCY_APP: "/organizations/{orgId}/developer-apps/my-agency-app",
  UPDATE_APP_NAME: "/organizations/{orgId}/developer-apps/{app}/update-name",
  CREATE_APP_PLATFORMS: "/organizations/{orgId}/developer-apps/{app}/platforms",
  DELETE_APP_PLATFORM: "/organizations/{orgId}/developer-apps/{app}/platforms/{platform}",
  CREATE_APP_PLATFORMS_CREDENTIALS: "/organizations/{orgId}/developer-apps/{app}/platform-credentials",
  UPDATE_APP_PLATFORMS_CREDENTIALS: "/organizations/{orgId}/developer-apps/{app}/platform-credentials/{platform}",
  VERIFY_APP_PLATFORM_CREDENTIALS: "/v1/channels/verify-credentials",
  SEND_TO_REVIEW: "/organizations/{orgId}/developer-apps/{app}/send-to-review",
  ACTIVATE_APP: "/organizations/{orgId}/developer-apps/{app}/activate",
  DEACTIVATE_APP: "/organizations/{orgId}/developer-apps/{app}/deactivate",
} as const;


export const AGENCY_ROUTES = {
  DASHBOARD: "/organizations/{orgId}/dashboard",
  PERMISSIONS: "/organizations/{orgId}/permissions",
  ONBOARD_INFO: "/organizations/{orgId}/onboard-info",
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
  ASSIGNED_CLIENTS: "/organizations/{orgId}/staff/{userId}/assigned-clients",

  RECENT_CLIENTS: "/organizations/{orgId}/staff/recent-clients",
  TRACK_RECENT_CLIENT: "/organizations/{orgId}/staff/track-client-access",

  START_BILLING: "/organizations/{orgId}/billing/start-checkout/{price}",

  POSTS: "/organizations/{orgId}/posts",
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
  ASSIGNED_CLIENTS: "/organizations/{orgId}/clients/{userId}/assigned-clients",
  LINKED_ACCOUNTS: "/organizations/{orgId}/clients/{userId}/accounts",
};

export const NOTIFICATION_ROUTES = {
  LIST: "/notifications",
  MARK_AS_READ: "/notifications/{notificationId}/read",
  MARK_ALL_AS_READ: "/notifications/read-all",
  DELETE: "/notifications/{notificationId}",
  UNREAD_COUNT: "/notifications/unread-count",
};

export const CHANNEL_ROUTES = {
  CONNECT: "v1/channels/{channel}/connect",
}
  
export const MEDIA_ROUTES = {
  UPLOAD: "/organizations/{orgId}/media/upload",
  INIT_UPLOAD: "/organizations/{orgId}/media/upload/init",
  UPLOAD_CHUNK: "/organizations/{orgId}/media/upload/chunk",
  COMPLETE_UPLOAD: "/organizations/{orgId}/media/upload/complete",
  CANCEL_UPLOAD: "/organizations/{orgId}/media/upload/cancel",
  UPLOAD_STATUS: "/organizations/{orgId}/media/upload/{uploadId}/status",
};

export const TAGS_ROUTES = {
  TAGS: "/organizations/{orgId}/tags",
  CREATE_TAG: "/organizations/{orgId}/tags",
  UPDATE_TAG: "/organizations/{orgId}/tags/{tagId}",
  DELETE_TAG: "/organizations/{orgId}/tags/{tagId}",
  ACTIVATE_TAG: "/organizations/{orgId}/tags/{tagId}/activate",
  DEACTIVATE_TAG: "/organizations/{orgId}/tags/{tagId}/deactivate",
};

export const CAMPAIGN_ROUTES = {
  CREATE_CAMPAIGN: "/organizations/{orgId}/campaigns",
  CAMPAIGNS: "/organizations/{orgId}/campaigns",
  UPDATE_CAMPAIGN: "/organizations/{orgId}/campaigns/{campaignId}",
  DELETE_CAMPAIGN: "/organizations/{orgId}/campaigns/{campaignId}",
  ACTIVATE_CAMPAIGN: "/organizations/{orgId}/campaigns/{campaignId}/activate",
  DEACTIVATE_CAMPAIGN: "/organizations/{orgId}/campaigns/{campaignId}/deactivate",
};


export const SCHEDULER_ROUTES = {
  SCHEDULE_POST: "/organizations/{orgId}/clients/{clientId}/publish",
  SCHEDULED_POSTS: "/organizations/{orgId}/clients/{clientId}/scheduled-posts",
  UPDATE_SCHEDULED_POST: "/organizations/{orgId}/clients/{clientId}/scheduled-posts/{postId}",
  DELETE_SCHEDULED_POST: "/organizations/{orgId}/clients/{clientId}/scheduled-posts/{postId}"
};