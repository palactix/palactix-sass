"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetPosts } from "@/features/posts/hooks/usePosts";
import { Post } from "../types";
import { PostRow } from "./PostRow";

interface PostsTableContainerProps {
  selectedRows: string[];
  onSelectRow: (postId: string) => void;
  onSelectAll: () => void;
  onViewDetails: (post: Post) => void;
}

export function PostsTableContainer({
  selectedRows,
  onSelectRow,
  onSelectAll,
  onViewDetails,
}: PostsTableContainerProps) {
  const searchParams = useSearchParams();

  // Build query params from URL
  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = {};
    
    // Pagination
    const page = searchParams.get("page");
    const pageSize = searchParams.get("pageSize");
    params.page = page ? parseInt(page, 10) : 1;
    params.per_page = pageSize ? parseInt(pageSize, 10) : 20;

    // Filters
    const filterKeys = ["status", "client_id", "platform", "created_by", "approval"];
    filterKeys.forEach((key) => {
      const value = searchParams.get(key);
      if (value) params[key] = value;
    });

    // Date filters
    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;

    // Tab-specific filters
    const tab = searchParams.get("tab") || "all";
    if (tab !== "all") {
      switch (tab) {
        case "my_drafts":
          params.status = "draft";
          params.created_by = "me";
          break;
        case "needs_approval":
          params.status = "pending_approval";
          break;
        case "scheduled":
          params.status = "scheduled";
          break;
        case "published":
          params.status = "published";
          break;
        case "failed":
          params.status = "failed";
          break;
      }
    }

    return params;
  }, [searchParams]);

  const { data, isLoading } = useGetPosts(queryParams);
  const postsData = useMemo(() => data?.data || [], [data]);

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedRows.length === postsData.length && postsData.length > 0}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead className="min-w-[300px]">Post</TableHead>
            <TableHead className="min-w-[150px]">Client</TableHead>
            <TableHead>Platforms</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Approval</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead className="w-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">
                Loading...
              </TableCell>
            </TableRow>
          ) : postsData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                No posts found
              </TableCell>
            </TableRow>
          ) : (
            postsData.map((post) => (
              <PostRow
                key={post.id}
                post={post}
                isSelected={selectedRows.includes(post.id)}
                onSelect={onSelectRow}
                onViewDetails={onViewDetails}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
