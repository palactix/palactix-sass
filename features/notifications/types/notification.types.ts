export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

type NotificationData = {
  message: string;
  action?: {
    link: string;
  }
  // Add other properties your notification data might have
};


export interface NotificationListResponse {
  data: Notification[];
  unread_count: number;
}

export interface UnreadCountResponse {
  unread_count: number;
}
