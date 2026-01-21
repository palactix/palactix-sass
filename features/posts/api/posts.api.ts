import  { api } from "@/lib/api/client";
import { AGENCY_ROUTES } from "@/utils/constants/api-routes";
import { LaravelPagination, PaginationParams } from "@/types/api";
import { Post, PostFilters } from "../types";

export interface GetPostsParams extends PaginationParams {
  status?: string;
  channel_id?: string;
  campaign_id?: string;
  tag_ids?: string;
  user_id?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
  search?: string;
}

export const getPosts = async (
  params?: GetPostsParams
): Promise<LaravelPagination<Post>> => {
  const res = await api.get<LaravelPagination<Post>>(AGENCY_ROUTES.POSTS, { params });
  return res.data;
};

export const getPost = async (orgId: string, postId: string): Promise<Post> => {
  const res = await api.get<Post>(AGENCY_ROUTES.POSTS + `/${postId}`);
  return res.data;
};

export const deletePost = async (orgId: string, postId: string): Promise<void> => {
  const url = `${AGENCY_ROUTES.POSTS.replace("{orgId}", orgId)}/${postId}`;
  await api.delete(url);
};

export const exportPosts = async (filters?: PostFilters): Promise<Blob> => {
  const url = `${AGENCY_ROUTES.POSTS}/export`;
  const res = await api.get(url, {
    params: filters,
    responseType: "blob",
  });
  return res.data;
};
