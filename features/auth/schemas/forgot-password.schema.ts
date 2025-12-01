import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Enter a valid email" }),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
