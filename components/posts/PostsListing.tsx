"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableBreadcrumb, TablePagination } from "@/components/shared/table";
import { ChevronDown, Calendar, CheckCircle2, Trash2 } from "lucide-react";
import { useGetPosts, useGetPost } from "@/features/posts/hooks/usePosts";
import { Post } from "@/features/posts/types";
import { buildOrgUrl } from "@/lib/utils/org-urls";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { PostsFilters } from "@/features/posts/components/PostsFilters";
import { PostsTabs } from "@/features/posts/components/PostsTabs";
import { PostDetailsDrawer } from "@/features/posts/components/PostDetailsDrawer";
import { EmptyStates, FailedPostAlert } from "@/features/posts/components/EmptyStates";
import { PostsTableContainer } from "@/features/posts/components/PostsTableContainer";
import { confirm } from "@/features/confirm";

export function PostsListing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Only local state needed: selection and drawer
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Read URL params directly
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);
  const tab = searchParams.get("tab") || "all";
  const postIdFromUrl = searchParams.get("postId");

  // Build query params for data fetching
  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = {
      page,
      per_page: pageSize,
    };

    // Add filters from URL
    const filterKeys = ["status", "client_id", "platform", "created_by", "approval", "date_from", "date_to"];
    filterKeys.forEach((key) => {
      const value = searchParams.get(key);
      if (value) params[key] = value;
    });

    // Apply tab-specific filters
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
  }, [searchParams, page, pageSize, tab]);

  const { data, isLoading } = useGetPosts(queryParams);
  const postsData = useMemo(() => data?.data || [], [data]);
  const totalPages = data?.last_page || 1;
  const totalItems = data?.total || 0;
  const failedPosts = useMemo(() => postsData.filter((p) => p.status === "failed"), [postsData]);

  // Fetch single post if postId is in URL (for direct link/refresh)
  const { data: singlePostData, isLoading: isSinglePostLoading } = useGetPost(postIdFromUrl || "");

  // Find post to display in drawer
  const postToDisplay = useMemo(() => {
    // If we clicked a post from the table, use that
    if (selectedPost) {
      return selectedPost;
    }
    
    // If we have a postId in URL, try to find it in the list first
    if (postIdFromUrl) {
      const postFromList = postsData.find((p) => p.id === postIdFromUrl);
      if (postFromList) {
        return postFromList;
      }
      // If not in list but we fetched it directly, use that
      if (singlePostData) {
        return singlePostData;
      }
    }
    
    return null;
  }, [postIdFromUrl, postsData, selectedPost, singlePostData]);

  // Update URL params
  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.push(newUrl, { scroll: false });
  };

  const handleSelectAll = () => {
    if (selectedRows.length === postsData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(postsData.map((p) => p.id));
    }
  };

  const handleSelectRow = (postId: string) => {
    setSelectedRows((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleBulkAction = async (action: string) => {
    if (selectedRows.length === 0) {
      toast.error("Please select posts first");
      return;
    }

    switch (action) {
      case "delete":
        const confirmed = await confirm({
          title: `Delete ${selectedRows.length} posts?`,
          description: "This action cannot be undone.",
          variant: "destructive",
        });
        if (confirmed) {
          toast.info("Bulk delete not implemented yet");
        }
        break;
      case "approve":
        toast.info("Bulk approve not implemented yet");
        break;
      case "schedule":
        toast.info("Bulk schedule not implemented yet");
        break;
    }
  };

  const breadcrumbItems = useMemo(
    () => [
      { label: "Dashboard", href: buildOrgUrl("/dashboard") },
      { label: "Posts" },
    ],
    []
  );

  // Show empty state
  if (!isLoading && postsData.length === 0) {
    const hasFilters = Array.from(searchParams.keys()).some(key => 
      !["page", "pageSize", "postId"].includes(key)
    );
    
    if (hasFilters) {
      return (
        <div className="space-y-6">
          <TableBreadcrumb items={breadcrumbItems} />
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Posts</h1>
              <p className="text-muted-foreground">
                Manage all scheduled, published, draft, and approval-pending posts across clients.
              </p>
            </div>
            <Button onClick={() => router.push(buildOrgUrl("/scheduler"))}>
              + Create Post
            </Button>
          </div>
          <PostsTabs />
          <PostsFilters />
          <EmptyStates 
            type="no_results" 
            onAction={() => updateUrl({ tab: null, status: null, client_id: null, platform: null, created_by: null, approval: null, date_from: null, date_to: null })} 
          />
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <TableBreadcrumb items={breadcrumbItems} />
        <EmptyStates
          type="no_posts"
          onAction={() => router.push(buildOrgUrl("/scheduler"))}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TableBreadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground">
            Manage all scheduled, published, draft, and approval-pending posts across clients.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedRows.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Bulk Actions <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleBulkAction("approve")}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("schedule")}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleBulkAction("delete")}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button onClick={() => router.push(buildOrgUrl("/scheduler"))}>
            + Create Post
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <PostsTabs
        counts={{
          all: totalItems,
          my_drafts: 0,
          needs_approval: 0,
          scheduled: 0,
          published: 0,
          failed: 0,
        }}
      />

      {/* Filters */}
      <PostsFilters />

      {/* Failed Posts Alert */}
      {failedPosts.length > 0 && tab === "all" && (
        <div className="space-y-2">
          {failedPosts.slice(0, 3).map((post) => (
            <FailedPostAlert
              key={post.id}
              platform={post.channel.name}
              reason={post.failure_reason || "Unknown error"}
              onRetry={() => toast.info("Retry not implemented yet")}
            />
          ))}
        </div>
      )}

      {/* Table */}
      <PostsTableContainer
        selectedRows={selectedRows}
        onSelectRow={handleSelectRow}
        onSelectAll={handleSelectAll}
        onViewDetails={setSelectedPost}
      />

      {/* Pagination */}
      <TablePagination
        currentPage={page}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={(newPage) => updateUrl({ page: newPage.toString() })}
        onPageSizeChange={(newSize) => updateUrl({ pageSize: newSize.toString(), page: "1" })}
      />

      {/* Post Details Drawer */}
      <PostDetailsDrawer
        post={postToDisplay}
        isOpen={!!postToDisplay || !!postIdFromUrl}
        isLoading={!!postIdFromUrl && !postToDisplay && isSinglePostLoading}
        onClose={() => {
          setSelectedPost(null);
          updateUrl({ postId: null });
        }}
        onApprove={() => toast.info("Approve not implemented yet")}
        onReject={() => toast.info("Reject not implemented yet")}
        onEdit={(id) => router.push(buildOrgUrl(`/posts/${id}/edit`))}
      />
    </div>
  );
}
