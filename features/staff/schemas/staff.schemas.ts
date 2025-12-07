import { z } from "zod";

export const inviteStaffSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
});

export type InviteStaffSchema = z.infer<typeof inviteStaffSchema>;
