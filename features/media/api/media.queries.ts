"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  initUpload,
  uploadChunk,
  completeUpload,
  cancelUpload,
  getUploadStatus,
} from "./media.api";
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

export const mediaKeys = {
  all: ["media"] as const,
  uploadStatus: (uploadId: string) => ["media", "upload-status", uploadId] as const,
};

export function useInitUploadMutation() {
  return useMutation<InitUploadResponse, Error, InitUploadPayload>({
    mutationFn: initUpload,
  });
}

export function useUploadChunkMutation() {
  return useMutation<
    UploadChunkResponse,
    Error,
    { uploadId: string; chunk: Blob; chunkIndex: number }
  >({
    mutationFn: ({ uploadId, chunk, chunkIndex }) =>
      uploadChunk(uploadId, chunk, chunkIndex),
  });
}

export function useCompleteUploadMutation() {
  return useMutation<CompleteUploadResponse, Error, CompleteUploadPayload>({
    mutationFn: completeUpload,
  });
}

export function useCancelUploadMutation() {
  return useMutation<CancelUploadResponse, Error, CancelUploadPayload>({
    mutationFn: cancelUpload,
  });
}

export function useUploadStatus(uploadId: string, enabled: boolean = false) {
  return useQuery<UploadStatusResponse, Error>({
    queryKey: mediaKeys.uploadStatus(uploadId),
    queryFn: () => getUploadStatus(uploadId),
    enabled,
    refetchInterval: 2000, // Poll every 2 seconds when enabled
  });
}
