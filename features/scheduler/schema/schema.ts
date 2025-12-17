import { z } from "zod";

export const mediaItemSchema = z.object({
  id: z.union([z.string(), z.number()]),
  url: z.string().min(1),
  type: z.enum(["image", "video"]),
  altText: z.string(),
});

export const schedulerFormSchema = z.object({
  media: z.array(mediaItemSchema).max(10),
  selectedAccounts: z.array(z.string()),
  perAccountCaptions: z.record(z.string(), z.string()),
  separateCaptions: z.boolean(),
  globalCaption: z.string(),
  firstComment: z.string(),
  scheduledDate: z.string(),
  scheduledTime: z.string(),
  timezone: z.string(),
});

export type SchedulerFormValues = z.infer<typeof schedulerFormSchema>;
