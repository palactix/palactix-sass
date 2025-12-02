import { z } from "zod";

export const appDetailsSchema = z.object({
  name: z.string().min(3, "App name must be at least 3 characters"),
  description: z.string().optional(),
});

export type AppDetailsSchema = z.infer<typeof appDetailsSchema>;

export const platformSelectorSchema = z.object({
  platform_ids: z.array(z.number()).min(1, "Please select at least one platform"),
});

export type PlatformSelectorSchema = z.infer<typeof platformSelectorSchema>;

// Credentials schema is dynamic, so we'll handle it in the component or use a generic record
export const credentialsSchema = z.object({
  credentials: z.array(z.object({
    platform_id: z.string(),
    credentials: z.record(z.string(), z.string().min(1, "Required")),
  })),
});

export type CredentialsSchema = z.infer<typeof credentialsSchema>;
