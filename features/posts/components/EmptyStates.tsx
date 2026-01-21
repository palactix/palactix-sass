"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { FileText, AlertCircle, CheckCircle2 } from "lucide-react";

export interface EmptyStatesProps {
  type: "no_posts" | "no_results" | "no_approval" | "no_failed";
  onAction?: () => void;
}

export const EmptyStates = memo(function EmptyStates({
  type,
  onAction,
}: EmptyStatesProps) {
  const configs = {
    no_posts: {
      icon: <FileText className="h-12 w-12 text-muted-foreground" />,
      title: "No posts yet",
      description: "Create your first post to start publishing for clients.",
      actionLabel: "Create Post",
    },
    no_results: {
      icon: <FileText className="h-12 w-12 text-muted-foreground" />,
      title: "No posts found",
      description: "Try adjusting your filters or search query to find what you're looking for.",
      actionLabel: "Reset Filters",
    },
    no_approval: {
      icon: <CheckCircle2 className="h-12 w-12 text-green-600" />,
      title: "Nothing waiting for approval 🎉",
      description: "All posts have been reviewed and approved.",
      actionLabel: null,
    },
    no_failed: {
      icon: <CheckCircle2 className="h-12 w-12 text-green-600" />,
      title: "No failed posts",
      description: "All posts are publishing successfully.",
      actionLabel: null,
    },
  };

  const config = configs[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4">{config.icon}</div>
      <h3 className="text-lg font-semibold mb-2">{config.title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{config.description}</p>
      {config.actionLabel && onAction && (
        <Button onClick={onAction}>{config.actionLabel}</Button>
      )}
    </div>
  );
});

export interface FailedPostAlertProps {
  platform: string;
  reason: string;
  onRetry: () => void;
}

export const FailedPostAlert = memo(function FailedPostAlert({
  platform,
  reason,
  onRetry,
}: FailedPostAlertProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
      <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">
          Failed • {platform}
        </p>
        <p className="text-sm text-muted-foreground truncate">
          Reason: {reason}
        </p>
      </div>
      <Button size="sm" variant="outline" onClick={onRetry}>
        Fix & Retry
      </Button>
    </div>
  );
});
