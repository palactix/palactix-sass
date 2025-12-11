import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createClient,
  getClientList,
  activateClient,
  deactivateClient,
  deleteClient,
  exportClients,
  resendClientInvite,
  cancelClientInvite,
  assignStaffToClient,
  searchClients,
  getLinkedAccounts
} from "./clients.api";
import type { CreateClientPayload } from "../types/client.types";
import type { PaginationParams } from "@/types/api";
import { toast } from "sonner";

export const clientKeys = {
  all: ["clients"] as const,
  lists: () => [...clientKeys.all, "list"] as const,
  list: (params: PaginationParams) => [...clientKeys.lists(), params] as const,
};

export function useClientList(params: PaginationParams) {
  return useQuery({
    queryKey: clientKeys.list(params),
    queryFn: () => getClientList(params),
    placeholderData: (prev) => prev,
  });
}

export function useCreateClientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClientPayload) => createClient(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
  });
}

export function useActivateClientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activateClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      toast.success("Client activated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to activate client");
    },
  });
}

export function useDeactivateClientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      toast.success("Client deactivated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to deactivate client");
    },
  });
}

export function useDeleteClientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      toast.success("Client deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete client");
    },
  });
}

export function useExportClientsMutation() {
  return useMutation({
    mutationFn: exportClients,
  });
}

export function useResendClientInviteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resendClientInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      toast.success("Invitation resent successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to resend invitation");
    },
  });
}

export function useCancelClientInviteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelClientInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      toast.success("Invitation cancelled successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to cancel invitation");
    },
  });
}

export function useAssignStaffMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, staffId }: { userId: number; staffId: number }) =>
      assignStaffToClient(userId, staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      toast.success("Staff assigned successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to assign staff");
    },
  });
}

export function useSearchClients(query: string) {
  return useQuery({
    queryKey: ['clients-search', query],
    queryFn: () => searchClients(query),
    enabled: query.length > 0,
    staleTime: 30000, // 30 seconds
  });
}

export function useLinkedAccounts(userId: number | null) {
  return useQuery({
    queryKey: ['client-linked-accounts', userId],
    queryFn: () => getLinkedAccounts(userId!),
    enabled: !!userId,
  });
}
