"use client";

import { memo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, XCircle, Edit, X } from "lucide-react";
import { Post } from "../types";
import { ApprovalBadge } from "./ApprovalBadge";
import { format } from "date-fns";

export interface PostDetailsDrawerProps {
  post: Post | null;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onApprove?: (postId: string) => void;
  onReject?: (postId: string, reason: string) => void;
  onEdit?: (postId: string) => void;
}

export const PostDetailsDrawer = memo(function PostDetailsDrawer({
  post,
  isOpen,
  isLoading = false,
  onClose,
  onApprove,
  onReject,
  onEdit,
}: PostDetailsDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Update URL when drawer opens with a post
  useEffect(() => {
    if (isOpen && post) {
      const currentPostId = searchParams.get("postId");
      // Only update URL if it doesn't already have the correct postId
      if (currentPostId !== post.id) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("postId", post.id);
        router.push(`?${params.toString()}`, { scroll: false });
      }
    }
  }, [isOpen, post]);

  // Show loading state if drawer is open and data is loading
  if (isOpen && isLoading) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading post details...</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  if (!post) return null;

  const getStatusBadge = () => {
    const statusConfig = {
      draft: { variant: "secondary" as const, label: "Draft" },
      pending_approval: { variant: "secondary" as const, label: "Pending Approval" },
      approved: { variant: "default" as const, label: "Approved" },
      scheduled: { variant: "default" as const, label: "Scheduled" },
      published: { variant: "default" as const, label: "Published" },
      failed: { variant: "destructive" as const, label: "Failed" },
      rejected: { variant: "destructive" as const, label: "Rejected" },
    };
    const config = statusConfig[post.status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
        <SheetHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between pr-8">
            <SheetTitle>Post Details</SheetTitle>
            {getStatusBadge()}
          </div>
          <SheetDescription>
            Created {format(new Date(post.created_at), "MMM dd, yyyy 'at' hh:mm a")}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-6 pb-24">
          {/* Media Section */}
          {post.media && post.media.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Media ({post.media.length})</h3>
              <div className="grid grid-cols-2 gap-2">
                {post.media.map((media, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={media.thumbnail_url || media.url}
                      alt={`Media ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {media.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M6 4l6 4-6 4V4z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Captions Section */}
          <div>
            <h3 className="font-medium mb-3">Caption</h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{post.caption}</p>
            </div>
            
            {post.platform_captions && Object.keys(post.platform_captions).length > 0 && (
              <div className="mt-4 space-y-3">
                <h4 className="text-sm font-medium">Platform-Specific Captions</h4>
                {Object.entries(post.platform_captions).map(([platform, caption]) => (
                  <div key={platform} className="bg-muted p-3 rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground mb-1 uppercase">
                      {platform}
                    </p>
                    <p className="text-sm">{caption}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Platform & Account */}
          <div>
            <h3 className="font-medium mb-3">Platform & Account</h3>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.channel.icon?.["logo-png"]} />
                <AvatarFallback>{post.channel.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.channel.name}</p>
                <p className="text-sm text-muted-foreground">@{post.channel.slug}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <>
              <div>
                <h3 className="font-medium mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Campaign */}
          {post.campaign && (
            <>
              <div>
                <h3 className="font-medium mb-3">Campaign</h3>
                <Badge variant="outline">{post.campaign.name}</Badge>
              </div>
              <Separator />
            </>
          )}

          {/* Approval Info */}
          {/* {post.approval.required && (
            <>
              <div>
                <h3 className="font-medium mb-3">Approval Status</h3>
                <ApprovalBadge approval={post.approval} />
                {post.approval.rejection_reason && (
                  <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm font-medium text-destructive mb-1">Rejection Reason:</p>
                    <p className="text-sm">{post.approval.rejection_reason}</p>
                  </div>
                )}
              </div>
              <Separator />
            </>
          )} */}

          {/* Schedule Info */}
          <div>
            <h3 className="font-medium mb-3">Schedule</h3>
            {post.status === "published" && post.published_at ? (
              <p className="text-sm">
                Published on {format(new Date(post.published_at), "MMM dd, yyyy 'at' hh:mm a")}
              </p>
            ) : post.scheduled_at ? (
              <p className="text-sm">
                Scheduled for {format(new Date(post.scheduled_at), "MMM dd, yyyy 'at' hh:mm a")}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Not scheduled</p>
            )}
          </div>

          <Separator />

          {/* Created By */}
          <div>
            <h3 className="font-medium mb-3">Created By</h3>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.user.avatar} />
                <AvatarFallback>{post.user.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{post.user.name}</p>
                <p className="text-xs text-muted-foreground">{post.user.email}</p>
              </div>
            </div>
          </div>

          {/* Failure Reason */}
          {post.status === "failed" && post.failure_reason && (
            <>
              <Separator />
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <h3 className="font-medium text-destructive mb-2">Failure Reason</h3>
                <p className="text-sm">{post.failure_reason}</p>
              </div>
            </>
          )}
        </div>

        {/* Actions Footer */}
        <div className="sticky bottom-0 bg-background border-t pt-4 px-6 pb-6 flex gap-2">
          {/* {post.approval.required && post.approval.status === "pending" && onApprove && (
            <Button onClick={() => onApprove(post.id)} className="flex-1">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve
            </Button>
          )} */}
          {/* {post.approval.required && post.approval.status === "pending" && onReject && (
            <Button
              variant="destructive"
              onClick={() => onReject(post.id, "")}
              className="flex-1"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
          )} */}
          {post.status !== "published" && onEdit && (
            <Button variant="outline" onClick={() => onEdit(post.id)} className="flex-1">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
});
