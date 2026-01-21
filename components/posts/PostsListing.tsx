"use client";

import React, { useMemo, useCallback, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableBreadcrumb, TablePagination } from "@/components/shared/table";
import { Trash2, Edit, Eye, ChevronDown, Calendar, CheckCircle2 } from "lucide-react";
import { confirm } from "@/features/confirm";
import { useGetPosts, useDeletePost } from "@/features/posts/hooks/usePosts";
import { Post, PostStatus } from "@/features/posts/types";
import { buildOrgUrl } from "@/lib/utils/org-urls";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { PostsFilters } from "@/features/posts/components/PostsFilters";
import { PostsTabs } from "@/features/posts/components/PostsTabs";
import { PostThumbnail } from "@/features/posts/components/PostThumbnail";
import { PlatformIcons } from "@/features/posts/components/PlatformIcons";
import { ApprovalBadge } from "@/features/posts/components/ApprovalBadge";
import { PostDetailsDrawer } from "@/features/posts/components/PostDetailsDrawer";
import { EmptyStates, FailedPostAlert } from "@/features/posts/components/EmptyStates";

export function PostsListing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  // Initialize state from URL params
  const [activeTab, setActiveTab] = useState(() => searchParams.get("tab") || "all");
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get("page");
    return page ? parseInt(page, 10) : 1;
  });
  const [pageSize, setPageSize] = useState(() => {
    const size = searchParams.get("pageSize");
    return size ? parseInt(size, 10) : 20;
  });
  const [filters, setFilters] = useState<Record<string, string | Date | undefined>>(() => {
    const initialFilters: Record<string, string | Date | undefined> = {};
    // Read all filter params from URL
    const filterKeys = ["status", "client_id", "platform", "created_by", "approval"];
    filterKeys.forEach((key) => {
      const value = searchParams.get(key);
      if (value) initialFilters[key] = value;
    });
    // Parse date filters
    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");
    if (dateFrom) initialFilters.date_from = new Date(dateFrom);
    if (dateTo) initialFilters.date_to = new Date(dateTo);
    return initialFilters;
  });

  const deleteMutation = useDeletePost();

  // Sync state to URL whenever filters, tab, or pagination change
  useEffect(() => {
    const params = new URLSearchParams();
    
    // Keep postId if it exists in current URL
    const postId = searchParams.get("postId");
    if (postId) {
      params.set("postId", postId);
    }
    
    // Set tab
    if (activeTab !== "all") {
      params.set("tab", activeTab);
    }
    
    // Set pagination
    if (currentPage !== 1) {
      params.set("page", currentPage.toString());
    }
    
    if (pageSize !== 20) {
      params.set("pageSize", pageSize.toString());
    }
    
    // Set filters
    const filterKeys = ["status", "client_id", "platform", "created_by", "approval"];
    filterKeys.forEach((key) => {
      if (filters[key]) {
        params.set(key, filters[key] as string);
      }
    });
    
    // Set date filters
    if (filters.date_from instanceof Date) {
      params.set("date_from", filters.date_from.toISOString());
    }
    
    if (filters.date_to instanceof Date) {
      params.set("date_to", filters.date_to.toISOString());
    }
    
    // Only update URL if it actually changed
    const newParamsString = params.toString();
    const currentParamsString = searchParams.toString();
    
    if (newParamsString !== currentParamsString) {
      const newUrl = newParamsString ? `?${newParamsString}` : window.location.pathname;
      router.push(newUrl, { scroll: false });
    }
  }, [activeTab, currentPage, pageSize, filters]);

  // Build query params based on tab and filters
  const queryParams = useMemo(() => {
    const params: Record<string, string | number | undefined> = {
      page: currentPage,
      per_page: pageSize,
    };

    // Convert dates to strings and add other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value instanceof Date) {
        params[key] = value.toISOString();
      } else if (value !== undefined) {
        params[key] = value as string | number;
      }
    });

    // Apply tab-specific filters
    if (activeTab !== "all") {
      switch (activeTab) {
        case "my_drafts":
          params.status = "draft";
          params.created_by = "me"; // Backend should handle "me" as current user
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
  }, [activeTab, currentPage, pageSize, filters]);

  const { data, isLoading } = useGetPosts(queryParams);

  const postsData = useMemo(() => data?.data || [], [data]);
  const totalPages = data?.last_page || 1;
  const totalItems = data?.total || 0;
  const failedPosts = useMemo(() => postsData.filter((p) => p.status === "failed"), [postsData]);

  // Get post ID from URL
  const postIdFromUrl = searchParams.get("postId");

  // Find the post to display in drawer based on URL
  const postToDisplay = useMemo(() => {
    if (postIdFromUrl && postsData.length > 0) {
      return postsData.find((p) => p.id === postIdFromUrl) || selectedPost;
    }
    return selectedPost;
  }, [postIdFromUrl, postsData, selectedPost]);

  const handleFilterChange = useCallback((key: string, value: string | Date | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  }, []);

  const handleRowClick = useCallback((post: Post) => {
    setSelectedPost(post);
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedRows.length === postsData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(postsData.map((p) => p.id));
    }
  }, [postsData, selectedRows.length]);

  const handleSelectRow = useCallback((postId: string) => {
    setSelectedRows((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  }, []);

  const handleDelete = useCallback(
    async (post: Post) => {
      const confirmed = await confirm({
        title: "Delete post?",
        description: `Are you sure you want to delete this post? This action cannot be undone.`,
        variant: "destructive",
        icon: <Trash2 className="h-6 w-6" />,
      });

      if (confirmed) {
        deleteMutation.mutate(post.id);
      }
    },
    [deleteMutation]
  );

  const handleBulkAction = useCallback(
    async (action: string) => {
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
            // Implement bulk delete
          }
          break;
        case "approve":
          toast.info("Bulk approve not implemented yet");
          break;
        case "schedule":
          toast.info("Bulk schedule not implemented yet");
          break;
      }
    },
    [selectedRows]
  );

  const getStatusBadge = useCallback((status: PostStatus) => {
    const statusConfig = {
      draft: { variant: "secondary" as const, label: "Draft", className: "" },
      pending_approval: { variant: "secondary" as const, label: "Pending Approval", className: "border-amber-500 text-amber-700" },
      approved: { variant: "default" as const, label: "Approved", className: "bg-blue-600" },
      scheduled: { variant: "default" as const, label: "Scheduled", className: "bg-blue-600" },
      published: { variant: "default" as const, label: "Published", className: "bg-green-600" },
      failed: { variant: "destructive" as const, label: "Failed", className: "" },
      rejected: { variant: "destructive" as const, label: "Rejected", className: "" },
    };
    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  }, []);

  const breadcrumbItems = useMemo(
    () => [
      { label: "Dashboard", href: buildOrgUrl("/dashboard") },
      { label: "Posts" },
    ],
    []
  );

  // Show empty state
  if (!isLoading && postsData.length === 0) {
    if (Object.keys(filters).length > 0 || activeTab !== "all") {
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
          <PostsTabs activeTab={activeTab} onTabChange={handleTabChange} />
          <PostsFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
          <EmptyStates type="no_results" onAction={handleResetFilters} />
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
        activeTab={activeTab}
        onTabChange={handleTabChange}
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
      <PostsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Failed Posts Alert */}
      {failedPosts.length > 0 && activeTab === "all" && (
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
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRows.length === postsData.length && postsData.length > 0}
                  onCheckedChange={handleSelectAll}
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
            ) : (
              postsData.map((post) => (
                <TableRow
                  key={post.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(post)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedRows.includes(post.id)}
                      onCheckedChange={() => handleSelectRow(post.id)}
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
                  <TableCell>{getStatusBadge(post.status)}</TableCell>
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
                        <DropdownMenuItem onClick={() => setSelectedPost(post)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {post.status !== "published" && (
                          <DropdownMenuItem
                            onClick={() => router.push(buildOrgUrl(`/posts/${post.id}/edit`))}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDelete(post)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Post Details Drawer */}
      <PostDetailsDrawer
        post={postToDisplay}
        isOpen={!!postToDisplay || !!postIdFromUrl}
        onClose={() => {
          setSelectedPost(null);
          // Clear URL param
          const params = new URLSearchParams(searchParams.toString());
          params.delete("postId");
          const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
          router.push(newUrl, { scroll: false });
        }}
        onApprove={() => toast.info("Approve not implemented yet")}
        onReject={() => toast.info("Reject not implemented yet")}
        onEdit={(id) => router.push(buildOrgUrl(`/posts/${id}/edit`))}
      />
    </div>
  );
}
