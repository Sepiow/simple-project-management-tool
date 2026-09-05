import { z } from "zod";

export const loginSchema = z.object({
  user_id: z.string().min(2, "User ID must be at least 2 characters long").max(100, "User ID must be less than 100 characters long"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  user_id: z.string().min(2, "User ID must be at least 2 characters long").max(100, "User ID must be less than 100 characters long"),
  email: z.string().email("Use a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});