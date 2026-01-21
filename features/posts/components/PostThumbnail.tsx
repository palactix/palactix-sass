"use client";

import { memo } from "react";

export interface PostThumbnailProps {
  media?: Array<{
    url: string;
    thumbnail_url?: string;
    type: "image" | "video" | "carousel";
  }>;
  caption: string;
}

export const PostThumbnail = memo(function PostThumbnail({
  media,
  caption,
}: PostThumbnailProps) {
  if (!media || media.length === 0) {
    return (
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs shrink-0">
          No media
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm line-clamp-2">{caption || "No caption"}</p>
        </div>
      </div>
    );
  }

  const firstMedia = media[0];
  const hasMultiple = media.length > 1;

  return (
    <div className="flex items-start gap-3">
      <div className="relative w-16 h-16 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={firstMedia.thumbnail_url || firstMedia.url}
          alt="Post preview"
          className="w-full h-full object-cover rounded"
        />
        {hasMultiple && (
          <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
            +{media.length - 1}
          </div>
        )}
        {firstMedia.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M6 4l6 4-6 4V4z" />
              </svg>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm line-clamp-2">{caption || "No caption"}</p>
      </div>
    </div>
  );
});
