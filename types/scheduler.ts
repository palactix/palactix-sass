export type MediaType = "image" | "video";

export type MediaItem = {
  id: string | number;
  url: string;
  type: MediaType;
  altText: string;
};

export type CaptionMap = Record<string, string>;
