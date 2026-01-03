import { api } from "@/lib/api/client";
import { TAGS_ROUTES } from "@/utils/constants/api-routes";
import {
  Tag,
  CreateTagPayload,
  UpdateTagPayload,
  CreateTagResponse,
  UpdateTagResponse,
  TagsResponse
} from "../types";

import { LaravelPagination, PaginationParams } from "@/types/api";
import { buildApiUrl } from "@/lib/utils/api-url";

export async function createTag(payload: CreateTagPayload) {
  const res = await api.post<CreateTagResponse>(TAGS_ROUTES.CREATE_TAG, payload);
  return res.data;
}

export async function getTags(params?: PaginationParams) {
  console.log("Fetching tags with params:",TAGS_ROUTES.TAGS,  params);
  const res = await api.get<Array<Tag>>(TAGS_ROUTES.TAGS, { params });
  return res.data;
}

export async function updateTag(tagId: string, payload: UpdateTagPayload) {
  const url = buildApiUrl(TAGS_ROUTES.UPDATE_TAG, { tagId });
  const res = await api.put<UpdateTagResponse>(url, payload);
  return res.data;
}

export async function deleteTag(tagId: string) {
  const url = buildApiUrl(TAGS_ROUTES.DELETE_TAG, { tagId });
  const res = await api.delete(url);
  return res.data;
}

export async function activateTag(tagId: string) {
  const url = buildApiUrl(TAGS_ROUTES.ACTIVATE_TAG, { tagId });
  const res = await api.post(url);
  return res.data;
}

export async function deactivateTag(tagId: string) {
  const url = buildApiUrl(TAGS_ROUTES.DEACTIVATE_TAG, { tagId });
  const res = await api.post(url);
  return res.data;
}