import { api } from "@/lib/api/client";
import { AGENCY_ROUTES } from "@/utils/constants/api-routes";
import { CreateStaffPayload, CreateStaffResponse } from "../types/staff.types";

export async function createStaff(payload: CreateStaffPayload) {
  const res = await api.post<CreateStaffResponse>(AGENCY_ROUTES.CREATE_STAFF, payload);
  return res.data;
}
