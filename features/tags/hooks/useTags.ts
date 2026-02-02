import { useMutation, useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";
import {
  createTag,
  getTags,
  updateTag,
  deleteTag,
  activateTag,
  deactivateTag
} from "../api/tags.api";
import { CreateTagPayload, CreateTagResponse, UpdateTagPayload, UpdateTagResponse } from "../types";
import { PaginationParams } from "@/types/api";
import { toast } from "sonner";
import { useOrganizationStore } from "@/features/organization/stores/organization.store";

export const tagsKeys = {
  all: ["tags"] as const,
  tags: (orgId: string, params?: PaginationParams) => [...tagsKeys.all, "tags", orgId, params] as const,
};

export function useCreateTagMutation() {
  const queryClient = useQueryClient();
  const currentOrgId = useOrganizationStore((state) => state.currentOrganization?.id);

  return useMutation<CreateTagResponse, Error, CreateTagPayload>({
    mutationFn: createTag,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: tagsKeys.all });
      toast.success(res.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create tag");
    },
  });
}

export function useTags() {
  const currentOrgId = useOrganizationStore((state) => state.currentOrganization?.id);

  return useQuery({
    queryKey: tagsKeys.tags(currentOrgId?.toString() || ""),
    queryFn: async () => {
      const response = await getTags();
      return response;
    },
    enabled: !!currentOrgId,
    staleTime: 5 * 60 * 1000, // 5 minutes - cache tags
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache
  });
}

export function useUpdateTagMutation() {
  const queryClient = useQueryClient();

  return useMutation<UpdateTagResponse, Error, { tagId: string; payload: UpdateTagPayload }>({
    mutationFn: ({ tagId, payload }) => updateTag(tagId, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: tagsKeys.all });
      toast.success(res.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update tag");
    },
  });
}

export function useDeleteTagMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagsKeys.all });
      toast.success("Tag deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete tag");
    },
  });
}

export function useActivateTagMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activateTag,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: tagsKeys.all });
      toast.success(res.message || "Tag activated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to activate tag");
    },
  });
}

export function useDeactivateTagMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateTag,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: tagsKeys.all });
      toast.success(res.message || "Tag deactivated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to deactivate tag");
    },
  });
}

export function useTagsListing(params?: PaginationParams) {
  const currentOrgId = useOrganizationStore((state) => state.currentOrganization?.id);

  return useQuery({
    queryKey: tagsKeys.tags(currentOrgId?.toString() || "", params),
    queryFn: () => getTags(params),
    enabled: !!currentOrgId,
    placeholderData: (prev) => prev,
  });
}