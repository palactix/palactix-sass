import { api } from "@/lib/api/client";
import { NOTIFICATION_ROUTES } from "@/utils/constants/api-routes";
import { buildApiUrl } from "@/lib/utils/api-url";
import { 
  NotificationListResponse, 
  UnreadCountResponse 
} from "../types/notification.types";

export async function getNotifications() {
  const res = await api.get<NotificationListResponse>(NOTIFICATION_ROUTES.LIST);
  return res.data;
}

export async function getUnreadCount() {
  const res = await api.get<UnreadCountResponse>(NOTIFICATION_ROUTES.UNREAD_COUNT);
  return res.data;
}

export async function markAsRead(notificationId: number) {
  const url = buildApiUrl(NOTIFICATION_ROUTES.MARK_AS_READ, { notificationId });
  const res = await api.post(url);
  return res.data;
}

export async function markAllAsRead() {
  const res = await api.post(NOTIFICATION_ROUTES.MARK_ALL_AS_READ);
  return res.data;
}

export async function deleteNotification(notificationId: number) {
  const url = buildApiUrl(NOTIFICATION_ROUTES.DELETE, { notificationId });
  const res = await api.delete(url);
  return res.data;
}
