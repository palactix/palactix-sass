import { UploadStatus } from "@/features/media/types/media.types";

export type MediaType = "image" | "video";

export type MediaItem = {
  id: string | number;
  url: string;
  type: MediaType;
  altText: string;
  // Upload metadata (optional, only present during upload)
  file?: File;
  uploadId?: string;
  progress?: number;
  status?: UploadStatus;
  error?: string;
  filename?: string;
  filesize?: number;
};

export type CaptionMap = Record<string, string>;
