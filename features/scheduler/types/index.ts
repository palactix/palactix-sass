export interface ChannelPost {
  user_channel_account_id: string;
  content?: string;
  media_ids?: string[];
  first_comment?: string;
  scheduled_at?: string;
  timezone?: string;
  tag_ids?: string[];
}

export interface SchedulePostPayload {
  channel_posts: ChannelPost[];
  campaign_id?: string;
}

export interface SchedulePostResponse {
  message: string;
  post_id: number;
  campaign_id?: number;
  channel_posts: ChannelPost[];
}