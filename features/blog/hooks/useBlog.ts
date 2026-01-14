"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBlogBySlug, fetchSuggestedBlogs, fetchAdjacentBlogs } from "../api/blog.api";

export function useBlog(slug: string) {
  return useQuery({
    queryKey: ["blogs", "detail", slug],
    queryFn: () => fetchBlogBySlug(slug),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSuggestedBlogs(currentSlug: string, tags: string[]) {
  return useQuery({
    queryKey: ["blogs", "suggested", currentSlug, tags],
    queryFn: () => fetchSuggestedBlogs(currentSlug, tags),
    enabled: tags.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdjacentBlogs(currentSlug: string) {
  return useQuery({
    queryKey: ["blogs", "adjacent", currentSlug],
    queryFn: () => fetchAdjacentBlogs(currentSlug),
    staleTime: 1000 * 60 * 5,
  });
}
