import { api } from "@/lib/api/client";
import { AGENCY_ROUTES } from "@/utils/constants/api-routes";
import { CreateStaffPayload, CreateStaffResponse, Staff, AssignedClient } from "../types/staff.types";
import { LaravelPagination, PaginationParams } from "@/types/api";
import { buildApiUrl } from "@/lib/utils/api-url";

export async function createStaff(payload: CreateStaffPayload) {
  const res = await api.post<CreateStaffResponse>(AGENCY_ROUTES.CREATE_STAFF, payload);
  return res.data;
}

export async function getStaffList(params: PaginationParams) {
  const res = await api.get<LaravelPagination<Staff>>(AGENCY_ROUTES.STAFFS, { params });
  return res.data;
}

export async function activateStaff(userId: number) {
  const url = buildApiUrl(AGENCY_ROUTES.ACTIVE, { userId });
  const res = await api.post(url);
  return res.data;
}

export async function deactivateStaff(userId: number) {
  const url = buildApiUrl(AGENCY_ROUTES.DEACTIVE, { userId });
  const res = await api.post(url);
  return res.data;
}

export async function deleteStaff(userId: number) {
  const url = buildApiUrl(AGENCY_ROUTES.DELETE, { userId });
  const res = await api.delete(url);
  return res.data;
}

export async function exportStaff(format: 'csv' | 'excel') {
  const res = await api.get(AGENCY_ROUTES.EXPORT_STAFF, {
    params: { format },
    responseType: 'blob'
  });
  return res.data;
}

export async function resendInvite(userId: number) {
  const url = buildApiUrl(AGENCY_ROUTES.RESEND_INVITE, { userId });
  const res = await api.post(url);
  return res.data;
}

export async function cancelInvite(userId: number) {
  const url = buildApiUrl(AGENCY_ROUTES.CANCEL_INVITE, { userId });
  const res = await api.post(url);
  return res.data;
}

export async function searchStaff(query: string) {
  const res = await api.get<Array<{ id: number; name: string }>>(AGENCY_ROUTES.SEARCH_STAFF, {
    params: { q: query }
  });
  return res.data;
}

export async function assignClientsToStaff(userId: number, clientIds: number[]) {
  const url = buildApiUrl(AGENCY_ROUTES.ASSIGN_CLIENTS, { userId });
  const res = await api.post(url, { client_ids: clientIds });
  return res.data;
}

export async function getAssignedClients(userId: number, params: PaginationParams) {
  const url = buildApiUrl(AGENCY_ROUTES.ASSIGNED_CLIENTS, { userId });
  const res = await api.get<LaravelPagination<AssignedClient>>(url, { params });
  return res.data;
}
