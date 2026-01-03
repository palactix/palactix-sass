import { z } from "zod";

export const mediaItemSchema = z.object({
  id: z.union([z.string(), z.number()]),
  url: z.string().min(1),
  type: z.enum(["image", "video"]),
  altText: z.string(),
});

export const schedulerFormSchema = z.object({
  media: z.array(mediaItemSchema).max(10),
  selected_accounts: z.array(z.string()),
  per_account_captions: z.record(z.string(), z.string()),
  separate_captions: z.boolean(),
  global_caption: z.string(),
  first_comment: z.string(),
  scheduled_date: z.string(),
  scheduled_time: z.string(),
  timezone: z.string(),
  campaign_id: z.string().optional(),
  tag_ids: z.array(z.string()).optional(),
});

export type SchedulerFormValues = z.infer<typeof schedulerFormSchema>;
