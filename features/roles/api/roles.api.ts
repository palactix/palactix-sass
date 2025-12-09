import { api } from "@/lib/api/client";
import { ROLES_LIST } from "@/utils/constants/api-routes";
import type { RolesListResponse } from "../types/role.types";

export async function getRoles() {
  const res = await api.get<RolesListResponse>(ROLES_LIST);
  return res.data;
}
