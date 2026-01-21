import { Channel } from "@/features/agency-app/types/agency-app.types";
import { Campaign } from "@/features/campaigns/types";
import { Tag } from "@/features/tags/types";
import { User } from "@/types/user";

export interface PostMedia {
  id: string;
  url: string;
  thumbnail_url?: string;
  type: "image" | "video" | "carousel";
  width?: number;
  height?: number;
  duration?: number;
  order: number;
}

export interface PostChannel {
  id: string;
  name: string;
  platform: string;
  username: string;
  avatar?: string;
}

export type PostStatus = "draft" | "pending_approval" | "approved" | "scheduled" | "published" | "failed" | "rejected";

export type ApprovalStatus = "not_required" | "pending" | "approved" | "rejected";

export interface ApprovalInfo {
  required: boolean;
  status: ApprovalStatus;
  approver?: User;
  approved_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
  reasons?: string[];
}

export interface Post {
  id: string;
  caption: string;
  status: PostStatus;
  scheduled_at: string | null;
  published_at: string | null;
  media: PostMedia[];
  channel: Channel;
  user: User;
  tags: Tag[];
  campaign: Campaign | null;
  approval: ApprovalInfo;
  platform_captions?: Record<string, string>;
  failure_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface PostFilters {
  status?: PostStatus;
  channel_id?: string;
  campaign_id?: string;
  tag_ids?: string[];
  user_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface PostSortOption {
  field: "scheduled_at" | "published_at" | "created_at" | "updated_at";
  direction: "asc" | "desc";
}
