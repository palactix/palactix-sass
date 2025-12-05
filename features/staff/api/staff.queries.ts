import { useMutation, useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { 
  createStaff, 
  getStaffList,
  activateStaff,
  deactivateStaff,
  deleteStaff,
  exportStaff,
  resendInvite,
  cancelInvite
} from "./staff.api";
import { CreateStaffPayload, CreateStaffResponse } from "../types/staff.types";
import { PaginationParams } from "@/types/api";

export function useCreateStaffMutation() {
  return useMutation<CreateStaffResponse, Error, CreateStaffPayload>({
    mutationFn: createStaff,
  });
}

export function useStaffList(params: PaginationParams) {
  return useQuery({
    queryKey: ['staff', params],
    queryFn: () => getStaffList(params),
    placeholderData: keepPreviousData,
  });
}

export function useActivateStaffMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: activateStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    }
  });
}

export function useDeactivateStaffMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivateStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    }
  });
}

export function useDeleteStaffMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
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
  });
}

export function useCancelInviteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    }
  });
}
