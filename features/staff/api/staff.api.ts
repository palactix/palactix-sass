import { api } from "@/lib/api/client";
import { AGENCY_ROUTES } from "@/utils/constants/api-routes";
import { CreateStaffPayload, CreateStaffResponse, Staff } from "../types/staff.types";
import { LaravelPagination, PaginationParams } from "@/types/api";

export async function createStaff(payload: CreateStaffPayload) {
  const res = await api.post<CreateStaffResponse>(AGENCY_ROUTES.CREATE_STAFF, payload);
  return res.data;
}

export async function getStaffList(params: PaginationParams) {
  const res = await api.get<LaravelPagination<Staff>>(AGENCY_ROUTES.STAFFS, { params });
  return res.data;
}

export async function activateStaff(userId: number) {
  const res = await api.post(AGENCY_ROUTES.ACTIVE.replace("{userId}", userId.toString()));
  return res.data;
}

export async function deactivateStaff(userId: number) {
  const res = await api.post(AGENCY_ROUTES.DEACTIVE.replace("{userId}", userId.toString()));
  return res.data;
}

export async function deleteStaff(userId: number) {
  const res = await api.delete(AGENCY_ROUTES.DELETE.replace("{userId}", userId.toString()));
  return res.data;
}

export async function exportStaff() {
  const res = await api.get(AGENCY_ROUTES.EXPORT, { responseType: 'blob' });
  return res.data;
}

export async function resendInvite(userId: number) {
  const res = await api.post(AGENCY_ROUTES.RESEND_INVITE.replace("{userId}", userId.toString()));
  return res.data;
}

export async function cancelInvite(userId: number) {
  const res = await api.post(AGENCY_ROUTES.CANCEL_INVITE.replace("{userId}", userId.toString()));
  return res.data;
}
