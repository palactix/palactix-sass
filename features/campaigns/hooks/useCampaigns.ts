import { useMutation, useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";
import {
  createCampaign,
  getCampaigns,
  updateCampaign,
  deleteCampaign,
  activateCampaign,
  deactivateCampaign
} from "../api/campaigns.api";
import { CreateCampaignPayload, CreateCampaignResponse, UpdateCampaignPayload, UpdateCampaignResponse } from "../types";
import { PaginationParams } from "@/types/api";
import { toast } from "sonner";
import { useOrganizationStore } from "@/features/organization/stores/organization.store";

export const campaignsKeys = {
  all: ["campaigns"] as const,
  campaigns: (orgId: string, params?: PaginationParams) => [...campaignsKeys.all, "campaigns", orgId, params] as const,
};

export function useCreateCampaignMutation() {
  const queryClient = useQueryClient();
  const currentOrgId = useOrganizationStore((state) => state.currentOrganization?.id);

  return useMutation<CreateCampaignResponse, Error, CreateCampaignPayload>({
    mutationFn: createCampaign,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: campaignsKeys.all });
      toast.success(res.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create campaign");
    },
  });
}

export function useCampaigns() {
  const currentOrgId = useOrganizationStore((state) => state.currentOrganization?.id);

  return useQuery({
    queryKey: campaignsKeys.campaigns(currentOrgId?.toString() || ""),
    queryFn: async () => {
      const response = await getCampaigns();
      return response.data;
    },
    enabled: !!currentOrgId,
    staleTime: 5 * 60 * 1000, // 5 minutes - cache campaigns
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache
  });
}

export function useUpdateCampaignMutation() {
  const queryClient = useQueryClient();

  return useMutation<UpdateCampaignResponse, Error, { campaignId: string; payload: UpdateCampaignPayload }>({
    mutationFn: ({ campaignId, payload }) => updateCampaign(campaignId, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: campaignsKeys.all });
      toast.success(res.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update campaign");
    },
  });
}

export function useDeleteCampaignMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignsKeys.all });
      toast.success("Campaign deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete campaign");
    },
  });
}

export function useActivateCampaignMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activateCampaign,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: campaignsKeys.all });
      toast.success(res.message || "Campaign activated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to activate campaign");
    },
  });
}

export function useDeactivateCampaignMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateCampaign,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: campaignsKeys.all });
      toast.success(res.message || "Campaign deactivated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to deactivate campaign");
    },
  });
}