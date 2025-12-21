import { api } from "@/lib/api/client";
import { MEDIA_ROUTES } from "@/utils/constants/api-routes";
import { buildApiUrl } from "@/lib/utils/api-url";
import type {
  InitUploadPayload,
  InitUploadResponse,
  UploadChunkResponse,
  CompleteUploadPayload,
  CompleteUploadResponse,
  CancelUploadPayload,
  CancelUploadResponse,
  UploadStatusResponse,
} from "../types/media.types";

export async function initUpload(payload: InitUploadPayload) {
  const res = await api.post<InitUploadResponse>(MEDIA_ROUTES.INIT_UPLOAD, payload);
  return res.data;
}

export async function uploadChunk(
  uploadId: string,
  chunk: Blob,
  chunkIndex: number
) {
  const formData = new FormData();
  formData.append("upload_id", uploadId);
  formData.append("chunk_index", chunkIndex.toString());
  formData.append("chunk", chunk);

  const res = await api.post<UploadChunkResponse>(MEDIA_ROUTES.UPLOAD_CHUNK, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function completeUpload(payload: CompleteUploadPayload) {
  const res = await api.post<CompleteUploadResponse>(MEDIA_ROUTES.COMPLETE_UPLOAD, payload);
  return res.data;
}

export async function cancelUpload(payload: CancelUploadPayload) {
  const res = await api.post<CancelUploadResponse>(MEDIA_ROUTES.CANCEL_UPLOAD, payload);
  return res.data;
}

export async function getUploadStatus(uploadId: string) {
  const url = buildApiUrl(MEDIA_ROUTES.UPLOAD_STATUS, { uploadId });
  const res = await api.get<UploadStatusResponse>(url);
  return res.data;
}
