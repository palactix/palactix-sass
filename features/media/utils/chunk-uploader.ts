import { initUpload, uploadChunk, completeUpload, cancelUpload } from "../api/media.api";
import {
  UploadStatus,
  MediaUploadProgress,
  UploadConfig,
} from "../types/media.types";

const DEFAULT_CHUNK_SIZE = 1024 * 1024; // 1MB
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1 second

export class ChunkUploader {
  private file: File;
  private config: Required<UploadConfig>;
  private uploadId: string | null = null;
  private isPaused = false;
  private isCancelled = false;
  private currentChunkIndex = 0;
  private totalChunks = 0;
  private caption?: string;

  constructor(file: File, config: UploadConfig = {}, caption?: string) {
    this.file = file;
    this.caption = caption;
    this.config = {
      chunkSize: config.chunkSize || DEFAULT_CHUNK_SIZE,
      maxRetries: config.maxRetries || DEFAULT_MAX_RETRIES,
      retryDelay: config.retryDelay || DEFAULT_RETRY_DELAY,
      onProgress: config.onProgress || (() => {}),
      onError: config.onError || (() => {}),
      onComplete: config.onComplete || (() => {}),
    };
    this.totalChunks = Math.ceil(this.file.size / this.config.chunkSize);
  }

  /**
   * Start the upload process
   */
  async start(): Promise<string> {
    try {
      this.isCancelled = false;
      this.isPaused = false;

      // Initialize upload
      const initResponse = await initUpload({
        filename: this.file.name,
        filesize: this.file.size,
        mime_type: this.file.type,
        total_chunks: this.totalChunks,
        caption: this.caption,
      });

      this.uploadId = initResponse.upload_id;

      this.notifyProgress(0, UploadStatus.UPLOADING);

      // Upload chunks
      for (let i = this.currentChunkIndex; i < this.totalChunks; i++) {
        if (this.isCancelled) {
          throw new Error("Upload cancelled");
        }

        if (this.isPaused) {
          this.notifyProgress(
            (this.currentChunkIndex / this.totalChunks) * 100,
            UploadStatus.PAUSED
          );
          return "paused";
        }

        await this.uploadChunkWithRetry(i);
        this.currentChunkIndex = i + 1;

        const progress = ((i + 1) / this.totalChunks) * 100;
        this.notifyProgress(progress, UploadStatus.UPLOADING);
      }

      // Complete upload
      const completeResponse = await completeUpload({
        upload_id: this.uploadId,
      });

      this.notifyProgress(100, UploadStatus.COMPLETED);
      this.config.onComplete(completeResponse.media.url);

      return completeResponse.media.url;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Upload failed";
      this.notifyProgress(
        (this.currentChunkIndex / this.totalChunks) * 100,
        UploadStatus.ERROR,
        errorMessage
      );
      this.config.onError(error as Error);
      throw error;
    }
  }

  /**
   * Upload a single chunk with retry logic
   */
  private async uploadChunkWithRetry(chunkIndex: number): Promise<void> {
    const chunk = this.getChunk(chunkIndex);
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      try {
        if (!this.uploadId) {
          throw new Error("Upload ID is not set");
        }

        await uploadChunk(this.uploadId, chunk, chunkIndex);
        return; // Success
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on cancellation
        if (this.isCancelled) {
          throw lastError;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < this.config.maxRetries - 1) {
          await this.sleep(this.config.retryDelay * Math.pow(2, attempt));
        }
      }
    }

    // All retries failed
    throw lastError || new Error(`Failed to upload chunk ${chunkIndex}`);
  }

  /**
   * Get a chunk from the file
   */
  private getChunk(chunkIndex: number): Blob {
    const start = chunkIndex * this.config.chunkSize;
    const end = Math.min(start + this.config.chunkSize, this.file.size);
    return this.file.slice(start, end);
  }

  /**
   * Pause the upload
   */
  pause(): void {
    this.isPaused = true;
  }

  /**
   * Resume the upload
   */
  async resume(): Promise<string> {
    if (!this.isPaused) {
      throw new Error("Upload is not paused");
    }
    this.isPaused = false;
    return this.start();
  }

  /**
   * Cancel the upload
   */
  async cancel(): Promise<void> {
    this.isCancelled = true;
    this.isPaused = false;

    if (this.uploadId) {
      try {
        await cancelUpload({ upload_id: this.uploadId });
      } catch (error) {
        console.error("Failed to cancel upload on server:", error);
      }
    }

    this.notifyProgress(
      (this.currentChunkIndex / this.totalChunks) * 100,
      UploadStatus.CANCELLED
    );
  }

  /**
   * Notify progress callback
   */
  private notifyProgress(
    progress: number,
    status: UploadStatus,
    error?: string
  ): void {
    this.config.onProgress({
      uploadId: this.uploadId || "",
      progress: Math.round(progress),
      uploadedChunks: this.currentChunkIndex,
      totalChunks: this.totalChunks,
      status,
      error,
    });
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get current upload progress
   */
  getProgress(): MediaUploadProgress {
    return {
      uploadId: this.uploadId || "",
      progress: Math.round((this.currentChunkIndex / this.totalChunks) * 100),
      uploadedChunks: this.currentChunkIndex,
      totalChunks: this.totalChunks,
      status: this.isPaused
        ? UploadStatus.PAUSED
        : this.isCancelled
        ? UploadStatus.CANCELLED
        : UploadStatus.UPLOADING,
    };
  }
}

/**
 * Convenience function to upload a file with chunks
 */
export async function uploadFileInChunks(
  file: File,
  config?: UploadConfig
): Promise<string> {
  const uploader = new ChunkUploader(file, config);
  return uploader.start();
}
