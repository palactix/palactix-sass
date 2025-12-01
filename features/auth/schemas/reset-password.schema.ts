import { z } from "zod";

export const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: "Reset token is required" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Enter a valid email" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  password_confirmation: z.string().min(1, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
