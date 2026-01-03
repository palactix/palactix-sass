"use client";

import { useCallback, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MediaItem } from "@/types/scheduler";
import { 
  Upload, 
  X, 
  Pause, 
  Play, 
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2 
} from "lucide-react";
import Image from "next/image";
import { ChunkUploader } from "@/features/media/utils/chunk-uploader";
import { UploadStatus } from "@/features/media/types/media.types";
import { toast } from "sonner";

interface MediaUploaderProps {
  maxItems?: number;
}

export function MediaUploader({ maxItems = 10 }: MediaUploaderProps) {
  const { setValue, control } = useFormContext();
  const media = useWatch({ control, name: "media" }) as MediaItem[];
  const uploadersRef = useRef<Map<string | number, ChunkUploader>>(new Map());

  const updateMediaItem = useCallback((id: string | number, updates: Partial<MediaItem>) => {
    setValue("media", (media || []).map((item) => 
      item.id === id ? { ...item, ...updates } : item
    ), { shouldDirty: true });
  }, [media, setValue]);

  const startUpload = useCallback((item: MediaItem) => {
    if (!item.file) return;

    const uploader = new ChunkUploader(item.file, {
      onProgress: (progress) => {
        updateMediaItem(item.id, {
          progress: progress.progress,
          status: progress.status,
          uploadId: progress.uploadId,
          error: progress.error,
        });
      },
      onComplete: (url) => {
        const oldUrl = item.url;
        updateMediaItem(item.id, {
          url,
          status: UploadStatus.COMPLETED,
          progress: 100,
          file: undefined, // Clear file reference
        });
        toast.success(`${item.filename} uploaded successfully`);
        
        // Revoke the blob URL after a delay to ensure new image loads
        if (oldUrl.startsWith("blob:")) {
          setTimeout(() => {
            URL.revokeObjectURL(oldUrl);
          }, 1000);
        }
      },
      onError: (error) => {
        updateMediaItem(item.id, {
          status: UploadStatus.ERROR,
          error: error.message,
        });
        toast.error(`Failed to upload ${item.filename}`);
      },
    }, item.altText);

    uploadersRef.current.set(item.id, uploader);
    
    // Update status to uploading
    updateMediaItem(item.id, { status: UploadStatus.UPLOADING });
    
    // Start the upload
    uploader.start().catch(console.error);
  }, [updateMediaItem]);

  const handleAdd = useCallback(async (files: FileList) => {
    const current = media || [];
    const remaining = Math.max(0, maxItems - current.length);
    const filesToUpload = Array.from(files).slice(0, remaining);

    // Validate file size (50MB max)
    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    const validFiles = filesToUpload.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is too large. Max size is 50MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create media items with pending status
    const incoming: MediaItem[] = validFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
      altText: "",
      file,
      filename: file.name,
      filesize: file.size,
      status: UploadStatus.PENDING,
      progress: 0,
    }));

    setValue("media", [...current, ...incoming], { shouldDirty: true });

    // Don't start uploading automatically - wait for user to click upload
  }, [media, maxItems, setValue]);

  const handleRemove = useCallback((id: string | number) => {
    const item = (media || []).find((m) => m.id === id);
    
    // Cancel upload if in progress
    const uploader = uploadersRef.current.get(id);
    if (uploader) {
      uploader.cancel().catch(console.error);
      uploadersRef.current.delete(id);
    }

    // Revoke blob URL if exists
    if (item?.url.startsWith("blob:")) {
      URL.revokeObjectURL(item.url);
    }

    const next = (media || []).filter((item) => item.id !== id);
    setValue("media", next, { shouldDirty: true });
  }, [media, setValue]);

  const handlePause = useCallback((id: string | number) => {
    const uploader = uploadersRef.current.get(id);
    if (uploader) {
      uploader.pause();
      updateMediaItem(id, { status: UploadStatus.PAUSED });
    }
  }, [updateMediaItem]);

  const handleResume = useCallback((id: string | number) => {
    const uploader = uploadersRef.current.get(id);
    if (uploader) {
      updateMediaItem(id, { status: UploadStatus.UPLOADING });
      uploader.resume().catch(console.error);
    }
  }, [updateMediaItem]);

  const handleCancel = useCallback((id: string | number) => {
    const uploader = uploadersRef.current.get(id);
    if (uploader) {
      uploader.cancel().catch(console.error);
      uploadersRef.current.delete(id);
    }
    updateMediaItem(id, { 
      status: UploadStatus.PENDING, 
      progress: 0,
      error: undefined 
    });
  }, [updateMediaItem]);

  const handleRetry = useCallback((id: string | number) => {
    const item = (media || []).find((m) => m.id === id);
    if (item) {
      // Remove old uploader
      uploadersRef.current.delete(id);
      
      // Reset status
      updateMediaItem(id, {
        status: UploadStatus.PENDING,
        progress: 0,
        error: undefined,
      });
      
      // Start new upload
      setTimeout(() => startUpload(item), 100);
    }
  }, [media, updateMediaItem, startUpload]);

  const handleAlt = useCallback((id: string | number, alt: string) => {
    const next = (media || []).map((item) => item.id === id ? { ...item, altText: alt } : item);
    setValue("media", next, { shouldDirty: true });
  }, [media, setValue]);

  return (
    <TooltipProvider>
      <Card className="p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Media Upload</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Upload up to {maxItems} images or videos (Max 50MB each)</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {media.length} / {maxItems}
          </Badge>
        </div>

        <div className="space-y-4">
          {media.length < maxItems && (
            <label
              className="cursor-pointer"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer?.files?.length) {
                  handleAdd(e.dataTransfer.files);
                }
              }}
            >
              <div className="border-2 border-dashed rounded-lg p-8 hover:border-primary/50 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Click or drag & drop media</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, GIF, MP4, MOV up to 50MB
                    </p>
                  </div>
                </div>
              </div>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => e.target.files && handleAdd(e.target.files)}
                className="hidden"
              />
            </label>
          )}

          {media.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.map((item) => (
                <Card key={item.id} className="p-3 space-y-3 border-2 hover:border-primary/50 transition-colors">
                  {/* Preview with Overlay Controls */}
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                    {item.type === "video" ? (
                      <video src={item.url} className="w-full h-full object-cover" />
                    ) : (
                      <Image src={item.url} alt="" fill className="object-cover" />
                    )}
                    
                    {/* Status Badge - Top Left */}
                    {item.status && (
                      <div className="absolute top-2 left-2">
                        <Badge variant={
                          item.status === UploadStatus.COMPLETED ? "default" :
                          item.status === UploadStatus.ERROR ? "destructive" :
                          item.status === UploadStatus.UPLOADING ? "secondary" :
                          "outline"
                        } className="text-[10px] flex items-center gap-1 bg-black/70 text-white border-0">
                          {item.status === UploadStatus.COMPLETED && <CheckCircle2 className="h-3 w-3" />}
                          {item.status === UploadStatus.ERROR && <AlertCircle className="h-3 w-3" />}
                          {item.status === UploadStatus.UPLOADING && <Loader2 className="h-3 w-3 animate-spin" />}
                          {item.status}
                        </Badge>
                      </div>
                    )}

                    {/* Action Buttons - Top Right */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.status === UploadStatus.PENDING && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="secondary"
                              onClick={() => startUpload(item)}
                              className="h-7 w-7 bg-black/70 hover:bg-black/80 text-white border-0"
                            >
                              <Upload className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Start upload</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {item.status === UploadStatus.UPLOADING && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="secondary"
                              onClick={() => handlePause(item.id)}
                              className="h-7 w-7 bg-black/70 hover:bg-black/80 text-white border-0"
                            >
                              <Pause className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Pause upload</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {item.status === UploadStatus.PAUSED && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="secondary"
                              onClick={() => handleResume(item.id)}
                              className="h-7 w-7 bg-black/70 hover:bg-black/80 text-white border-0"
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Resume upload</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {item.status === UploadStatus.ERROR && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="secondary"
                              onClick={() => handleRetry(item.id)}
                              className="h-7 w-7 bg-black/70 hover:bg-black/80 text-white border-0"
                            >
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Retry upload</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {(item.status === UploadStatus.UPLOADING || item.status === UploadStatus.PAUSED) && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="secondary"
                              onClick={() => handleCancel(item.id)}
                              className="h-7 w-7 bg-black/70 hover:bg-black/80 text-white border-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Cancel upload</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleRemove(item.id)}
                            className="h-7 w-7"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove from list</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    {/* Progress Overlay */}
                    {(item.status === UploadStatus.UPLOADING || item.status === UploadStatus.PAUSED) && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                        <Progress value={item.progress || 0} className="h-1.5 mb-1" />
                        <p className="text-xs text-white text-center">{item.progress || 0}%</p>
                      </div>
                    )}

                    {/* Error Overlay */}
                    {item.status === UploadStatus.ERROR && item.error && (
                      <div className="absolute bottom-0 left-0 right-0 bg-red-500/90 p-2">
                        <p className="text-xs text-white text-center truncate">{item.error}</p>
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium truncate">{item.filename || "Media file"}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.filesize ? `${(item.filesize / (1024 * 1024)).toFixed(2)} MB` : ""}
                    </p>
                  </div>

                  {/* Alt Text Input */}
                  <div>
                    <Label className="text-xs mb-1.5">Caption / Alt Text</Label>
                    <Input
                      placeholder="Describe this media..."
                      value={item.altText}
                      onChange={(e) => handleAlt(item.id, e.target.value)}
                      className="h-8 text-xs"
                      disabled={item.status === UploadStatus.UPLOADING}
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>
    </TooltipProvider>
  );
}
