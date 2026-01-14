"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBlogsWithPagination } from "../api/blog.api";

export function useBlogList(page: number) {
  return useQuery({
    queryKey: ["blogs", "list", page],
    queryFn: () => fetchBlogsWithPagination(page),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
