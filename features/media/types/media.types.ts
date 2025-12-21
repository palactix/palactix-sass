export enum UploadStatus {
  PENDING = "pending",
  UPLOADING = "uploading",
  PAUSED = "paused",
  COMPLETED = "completed",
  ERROR = "error",
  CANCELLED = "cancelled",
}

export interface ChunkMetadata {
  index: number;
  size: number;
  totalChunks: number;
  start: number;
  end: number;
}

export interface InitUploadPayload {
  filename: string;
  filesize: number;
  mime_type: string;
  total_chunks: number;
  caption?: string;
}

export interface InitUploadResponse {
  upload_id: string;
  message?: string;
}

export interface UploadChunkPayload {
  upload_id: string;
  chunk: Blob;
  chunk_index: number;
}

export interface UploadChunkResponse {
  chunk_index: number;
  message?: string;
}

export interface CompleteUploadPayload {
  upload_id: string;
}

export interface CompleteUploadResponse {
  message: string;
  media: {
    id: number;
    name: string;
    path: string;
    type: string;
    size: string;
    url: string;
  };
}

export interface CancelUploadPayload {
  upload_id: string;
}

export interface CancelUploadResponse {
  message: string;
}

export interface UploadStatusResponse {
  upload_id: string;
  status: UploadStatus;
  progress: number;
  uploaded_chunks: number;
  total_chunks: number;
  message?: string;
}

export interface MediaUploadProgress {
  uploadId: string;
  progress: number;
  uploadedChunks: number;
  totalChunks: number;
  status: UploadStatus;
  error?: string;
}

export interface UploadConfig {
  chunkSize?: number;
  maxRetries?: number;
  retryDelay?: number;
  onProgress?: (progress: MediaUploadProgress) => void;
  onError?: (error: Error) => void;
  onComplete?: (url: string) => void;
}
