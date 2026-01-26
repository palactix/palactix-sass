import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo, useState, useEffect } from "react";
import { GetPostsParams } from "../api/posts.api";
import { PostStatus, PostSortOption } from "../types";
import { useGetPosts } from "./usePosts";

export interface PostsListingState {
  page: number;
  pageSize: number;
  search: string;
  sortBy: string;
  sortDirection: "asc" | "desc";
  status: PostStatus | "all" | string;
  channel_id?: string;
  campaign_id?: string;
  tag_ids?: string;
  user_id?: string;
  date_from?: string;
  date_to?: string;
  client_id?: string;
}

export const usePostsListing = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // --- Local State for UI only ---
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // --- URL State Management ---
  const params = useMemo(() => {
    return {
      page: parseInt(searchParams.get("page") || "1", 10),
      pageSize: parseInt(searchParams.get("pageSize") || "20", 10),
      search: searchParams.get("search") || "",
      sortBy: searchParams.get("sort_by") || "created_at",
      sortDirection: (searchParams.get("sort_direction") || "desc") as "asc" | "desc",
      status: searchParams.get("status") || "all",
      channel_id: searchParams.get("channel_id") || undefined,
      campaign_id: searchParams.get("campaign_id") || undefined,
      tag_ids: searchParams.get("tag_ids") || undefined,
      user_id: searchParams.get("user_id") || undefined,
      date_from: searchParams.get("date_from") || undefined,
      date_to: searchParams.get("date_to") || undefined,
      client_id: searchParams.get("client_id") || undefined,
    };
  }, [searchParams]);

  // Derived query params for API
  const apiParams: GetPostsParams = useMemo(() => {
    const apiP: GetPostsParams = {
      page: params.page,
      per_page: params.pageSize,
      sort_by: params.sortBy,
      sort_direction: params.sortDirection,
      search: params.search,
    };

    if (params.status && params.status !== "all") apiP.status = params.status;
    if (params.channel_id) apiP.channel_id = params.channel_id;
    if (params.campaign_id) apiP.campaign_id = params.campaign_id;
    if (params.tag_ids) apiP.tag_ids = params.tag_ids;
    if (params.user_id) apiP.user_id = params.user_id; // 'created_by' in UI
    if (params.date_from) apiP.date_from = params.date_from;
    if (params.date_to) apiP.date_to = params.date_to;
    // Note: client_id might need to be handled if the API supports filtering by client/org sub-entities
    if (params.client_id) {
      // Assuming API might take client_id if applicable, usually handled by tenant context
      // But user asked for "Clients" filter.
      (apiP as any).client_id = params.client_id;
    }

    return apiP;
  }, [params]);

  // Data Fetching
  const { data, isLoading, isFetching, refetch } = useGetPosts(apiParams);

  // --- Action Handlers ---

  const setParams = useCallback((newParams: Partial<PostsListingState>) => {
    const current = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "" || value === "all") {
        current.delete(key);
      } else {
        current.set(key, String(value));
      }
    });

    // Reset to page 1 if filters change (excluding page/pageSize/sort itself if we want, but usually safer to reset)
    // Here we must be careful.
    const isFilterChange = Object.keys(newParams).some(k => !["page", "pageSize", "sort_by", "sort_direction"].includes(k));
    if (isFilterChange) {
      current.set("page", "1");
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedRowIds(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedRowIds(ids);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRowIds([]);
  }, []);

  const openDrawer = useCallback((postId: string) => {
    setSelectedPostId(postId);
    setIsDrawerOpen(true);

    // Update URL without triggering navigation/suspense
    const url = new URL(window.location.href);
    url.searchParams.set("postId", postId);
    window.history.pushState({}, "", url);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    // Keep selectedPostId for exit animation

    // Update URL without triggering navigation/suspense
    const url = new URL(window.location.href);
    url.searchParams.delete("postId");
    window.history.pushState({}, "", url);
  }, []);

  // Initialize drawer from URL if present
  useEffect(() => {
    const startPostId = searchParams.get("postId");
    if (startPostId && !isDrawerOpen) {
      setSelectedPostId(startPostId);
      setIsDrawerOpen(true);
    }
  }, []); // Run once on mount (or when searchParams first available, but we want to avoid re-opening if user closed it)


  return {
    // State
    filters: params,
    posts: data?.data || [],
    pagination: {
      currentPage: data?.current_page || 1,
      lastPage: data?.last_page || 1,
      total: data?.total || 0,
      perPage: data?.per_page || 20,
    },
    isLoading: isLoading || isFetching,

    // Selection
    selectedRowIds,
    toggleSelection,
    selectAll,
    clearSelection,

    // Drawer
    isDrawerOpen,
    selectedPostId,
    openDrawer,
    closeDrawer,

    // Actions
    setParams,
    refetch,

    // Quick helpers
    resetFilters: () => router.push(pathname),
  };
};
