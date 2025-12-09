import { z } from "zod";

export const inviteClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
});

export type InviteClientSchema = z.infer<typeof inviteClientSchema>;
