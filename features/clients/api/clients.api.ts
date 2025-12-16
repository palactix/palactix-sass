import { api } from "@/lib/api/client";
import { CLIENT_ROUTES } from "@/utils/constants/api-routes";
import { CreateClientPayload, CreateClientResponse, Client } from "../types/client.types";
import { LaravelPagination, PaginationParams } from "@/types/api";
import { buildApiUrl } from "@/lib/utils/api-url";
import { LinkedAccountsResponse } from "../types/linked-accounts.types";

export async function createClient(payload: CreateClientPayload) {
  const res = await api.post<CreateClientResponse>(CLIENT_ROUTES.CREATE_CLIENT, payload);
  return res.data;
}

export async function getClientList(params: PaginationParams) {
  const res = await api.get<LaravelPagination<Client>>(CLIENT_ROUTES.CLIENTS, { params });
  return res.data;
}

export async function activateClient(userId: number) {
  const url = buildApiUrl(CLIENT_ROUTES.ACTIVATE, { userId });
  const res = await api.post(url);
  return res.data;
}

export async function deactivateClient(userId: number) {
  const url = buildApiUrl(CLIENT_ROUTES.DEACTIVATE, { userId });
  const res = await api.post(url);
  return res.data;
}

export async function deleteClient(userId: number) {
  const url = buildApiUrl(CLIENT_ROUTES.DELETE, { userId });
  const res = await api.delete(url);
  return res.data;
}

export async function exportClients(format: 'csv' | 'excel') {
  const res = await api.get(CLIENT_ROUTES.EXPORT_CLIENTS, {
    params: { format },
    responseType: 'blob'
  });
  return res.data;
}

export async function resendClientInvite(userId: number) {
  const url = buildApiUrl(CLIENT_ROUTES.RESEND_INVITE, { userId });
  const res = await api.post(url);
  return res.data;
}

export async function cancelClientInvite(userId: number) {
  const url = buildApiUrl(CLIENT_ROUTES.CANCEL_INVITE, { userId });
  const res = await api.post(url);
  return res.data;
}

export async function assignStaffToClient(userId: number, staffId: number) {
  const url = buildApiUrl(CLIENT_ROUTES.ASSIGN_STAFF, { userId });
  const res = await api.post(url, { staff_id: staffId });
  return res.data;
}

export async function searchClients(query: string) {
  const res = await api.get<Array<{ id: number; name: string }>>(CLIENT_ROUTES.SEARCH_CLIENTS, {
    params: { q: query }
  });
  return res.data;
}

export async function getLinkedAccounts(userId: number) {
  const url = buildApiUrl(CLIENT_ROUTES.LINKED_ACCOUNTS, { userId });
  const res = await api.get<LinkedAccountsResponse>(url);
  return res.data;
}
