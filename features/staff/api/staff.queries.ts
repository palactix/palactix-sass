import { useMutation, useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { 
  createStaff, 
  getStaffList,
  activateStaff,
  deactivateStaff,
  deleteStaff,
  exportStaff,
  resendInvite,
  cancelInvite,
  searchStaff,
  assignClientsToStaff
} from "./staff.api";
import { CreateStaffPayload, CreateStaffResponse } from "../types/staff.types";
import { PaginationParams } from "@/types/api";
import { toast } from "sonner";
import { useOrganizationStore } from "@/features/organization/stores/organization.store";

export function useCreateStaffMutation() {
  return useMutation<CreateStaffResponse, Error, CreateStaffPayload>({
    mutationFn: createStaff,
  });
}

export function useStaffList(params: PaginationParams) {
  const currentOrgId = useOrganizationStore((state) => state.currentOrganization?.id);
  
  return useQuery({
    queryKey: ['staff', currentOrgId, params],
    queryFn: () => getStaffList(params),
    placeholderData: keepPreviousData,
    enabled: !!currentOrgId,
  });
}

export function useActivateStaffMutation() {
  const queryClient = useQueryClient();
  const currentOrgId = useOrganizationStore((state) => state.currentOrganization?.id);
  
  return useMutation({
    mutationFn: activateStaff,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['staff', currentOrgId] });
      toast.success(res.message);
    }
  });
}

export function useDeactivateStaffMutation() {
  const queryClient = useQueryClient();
  const currentOrgId = useOrganizationStore((state) => state.currentOrganization?.id);
  
  return useMutation({
    mutationFn: deactivateStaff,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['staff', currentOrgId] });
      toast.success(res.message);
    }
  });
}

export function useDeleteStaffMutation() {
  const queryClient = useQueryClient();
  const currentOrgId = useOrganizationStore((state) => state.currentOrganization?.id);
  
  return useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', currentOrgId] });
    }
  });
}

export function useExportStaffMutation() {
  return useMutation({
    mutationFn: exportStaff,
  });
}

export function useResendInviteMutation() {
  return useMutation({
    mutationFn: resendInvite,
    onSuccess: (res) => {
      toast.success(res.message);
    }
  });
}

export function useCancelInviteMutation() {
  const queryClient = useQueryClient();
  const currentOrgId = useOrganizationStore((state) => state.currentOrganization?.id);
  
  return useMutation({
    mutationFn: cancelInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', currentOrgId] });
    }
  });
}

export function useSearchStaff(query: string) {
  const currentOrgId = useOrganizationStore((state) => state.currentOrganization?.id);
  
  return useQuery({
    queryKey: ['staff-search', currentOrgId, query],
    queryFn: () => searchStaff(query),
    enabled: !!currentOrgId && query.length > 0,
    staleTime: 30000, // 30 seconds
  });
}

export function useAssignClientsMutation() {
  const queryClient = useQueryClient();
  const currentOrgId = useOrganizationStore((state) => state.currentOrganization?.id);

  return useMutation({
    mutationFn: ({ userId, clientIds }: { userId: number; clientIds: number[] }) => 
      assignClientsToStaff(userId, clientIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', currentOrgId] });
      toast.success("Clients assigned successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to assign clients");
    },
  });
}
