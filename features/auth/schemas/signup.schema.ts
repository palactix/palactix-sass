import { z } from "zod";

// Zod v4 schema: prefer min(1) over nonempty and trim inputs
export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Company name is required" })
    .min(2, { message: "Company name is too short" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Enter a valid email" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export type SignupSchema = z.infer<typeof signupSchema>;
