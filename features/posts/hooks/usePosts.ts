import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPosts, getPost, deletePost, exportPosts, GetPostsParams } from "../api/posts.api";
import { PostFilters } from "../types";
import { useOrganizationStore } from "@/features/organization/stores/organization.store";
import { toast } from "sonner";

export const useGetPosts = (params?: GetPostsParams) => {
  const { currentOrganization } = useOrganizationStore();
  const orgId = currentOrganization?.id;

  return useQuery({
    queryKey: ["posts", orgId, params],
    queryFn: () => getPosts(params),
    enabled: !!orgId,
  });
};

export const useGetPost = (postId: string) => {
  const { currentOrganization } = useOrganizationStore();
  const orgId = currentOrganization?.id;

  return useQuery({
    queryKey: ["post", orgId, postId],
    queryFn: () => getPost(String(orgId), postId),
    enabled: !!orgId && !!postId,
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const { currentOrganization } = useOrganizationStore();
  const orgId = currentOrganization?.id;

  return useMutation({
    mutationFn: (postId: string) => deletePost(String(orgId), postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", orgId] });
      toast.success("Post deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete post");
    },
  });
};

export const useExportPosts = () => {

  return useMutation({
    mutationFn: (filters?: PostFilters) => exportPosts(filters),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `posts-export-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Posts exported successfully");
    },
    onError: () => {
      toast.error("Failed to export posts");
    },
  });
};
