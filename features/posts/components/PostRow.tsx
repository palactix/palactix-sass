"use client";

import { memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { Trash2, Edit, Eye } from "lucide-react";
import { confirm } from "@/features/confirm";
import { useDeletePost } from "@/features/posts/hooks/usePosts";
import { Post } from "../types";
import { PostThumbnail } from "./PostThumbnail";
import { PlatformIcons } from "./PlatformIcons";
import { buildOrgUrl } from "@/lib/utils/org-urls";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface PostRowProps {
  post: Post;
  isSelected: boolean;
  onSelect: (postId: string) => void;
  onViewDetails: (post: Post) => void;
}

export const PostRow = memo(function PostRow({
  post,
  isSelected,
  onSelect,
  onViewDetails,
}: PostRowProps) {
  const router = useRouter();
  const deleteMutation = useDeletePost();

  const handleDelete = useCallback(async () => {
    const confirmed = await confirm({
      title: "Delete post?",
      description: `Are you sure you want to delete this post? This action cannot be undone.`,
      variant: "destructive",
      icon: <Trash2 className="h-6 w-6" />,
    });

    if (confirmed) {
      deleteMutation.mutate(post.id);
    }
  }, [post.id, deleteMutation]);

  const handleEdit = useCallback(() => {
    router.push(buildOrgUrl(`/posts/${post.id}/edit`));
  }, [post.id, router]);

  const getStatusBadge = () => {
    const statusConfig = {
      draft: { variant: "secondary" as const, label: "Draft", className: "" },
      pending_approval: { variant: "secondary" as const, label: "Pending Approval", className: "border-amber-500 text-amber-700" },
      approved: { variant: "default" as const, label: "Approved", className: "bg-blue-600" },
      scheduled: { variant: "default" as const, label: "Scheduled", className: "bg-blue-600" },
      published: { variant: "default" as const, label: "Published", className: "bg-green-600" },
      failed: { variant: "destructive" as const, label: "Failed", className: "" },
      rejected: { variant: "destructive" as const, label: "Rejected", className: "" },
    };
    const config = statusConfig[post.status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => onViewDetails(post)}
    >
      <TableCell onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(post.id)}
        />
      </TableCell>
      <TableCell>
        <PostThumbnail media={post.media} caption={post.caption} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.user.avatar} />
            <AvatarFallback>{post.user.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{post.user.name}</p>
            <p className="text-xs text-muted-foreground">@{post.user.name.toLowerCase()}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <PlatformIcons platforms={[post.channel]} />
      </TableCell>
      <TableCell>{getStatusBadge()}</TableCell>
      <TableCell>
        {/* <ApprovalBadge approval={post.approval} /> */}
      </TableCell>
      <TableCell>
        {post.status === "published" && post.published_at ? (
          <div className="text-sm">
            <div>{format(new Date(post.published_at), "MMM dd, yyyy")}</div>
            <div className="text-xs text-muted-foreground">
              {format(new Date(post.published_at), "hh:mm a")}
            </div>
          </div>
        ) : post.scheduled_at ? (
          <div className="text-sm">
            <div>{format(new Date(post.scheduled_at), "MMM dd, yyyy")}</div>
            <div className="text-xs text-muted-foreground">
              {format(new Date(post.scheduled_at), "hh:mm a")}
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={post.user.avatar} />
            <AvatarFallback>{post.user.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{post.user.name}</span>
        </div>
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              •••
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(post)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {post.status !== "published" && (
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
});
