"use client";

import { Bell, Check, Trash2, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { 
  useNotifications, 
  useMarkAsReadMutation, 
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation 
} from "@/features/notifications/api/notifications.queries";
import { formatDistanceToNow } from "date-fns";
import { Notification } from "@/features/notifications/types/notification.types";
import Link from "next/link";

export function NotificationDropdown() {
  const { data, isLoading } = useNotifications();
  const markAsReadMutation = useMarkAsReadMutation();
  const markAllAsReadMutation = useMarkAllAsReadMutation();
  const deleteNotificationMutation = useDeleteNotificationMutation();

  const notifications = data?.data || [];
  const unreadCount = data?.unread_count || 0;

  const handleMarkAsRead = (notificationId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsReadMutation.mutate(notificationId);
  };

  const handleDelete = (notificationId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotificationMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      markAllAsReadMutation.mutate();
    }
  };

  const getNotificationIcon = (type: string) => {
    // You can customize icons based on notification type
    switch (type) {
      case "info":
        return "ℹ️";
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "🔔";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <>
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-primary hover:text-primary/80"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
            >
              <CheckCheck className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                  getIcon={getNotificationIcon}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number, e: React.MouseEvent) => void;
  onDelete: (id: number, e: React.MouseEvent) => void;
  getIcon: (type: string) => string;
}

function NotificationItem({ 
  notification, 
  onMarkAsRead, 
  onDelete, 
  getIcon 
}: NotificationItemProps) {
  const isUnread = !notification.read_at;

  return (
    <div
      className={cn(
        "group relative px-4 py-3 transition-colors hover:bg-muted/50",
        isUnread && "bg-primary/5"
      )}
    >
      {/* Unread Indicator */}
      {isUnread && (
        <div className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary" />
      )}

      <div className={cn("flex gap-3", isUnread && "ml-2")}>
        {/* Icon */}
        <div className="shrink-0 text-2xl">
          {getIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1 min-w-0">
          {notification.data?.action?.link ? (
            <Link href={notification.data.action.link} onClick={(e) => onMarkAsRead(notification.id, e)}>
              <p className="text-sm font-medium leading-none hover:underline">
                {notification.data.message}
              </p>
            </Link>
          ) : (
            <p className="text-sm font-medium leading-none">
              {notification.data.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.created_at), { 
              addSuffix: true 
            })}
          </p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isUnread && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => onMarkAsRead(notification.id, e)}
              title="Mark as read"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={(e) => onDelete(notification.id, e)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
