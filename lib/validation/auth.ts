import { z } from "zod";

const organizationSlugSchema = z
  .string()
  .min(3)
  .max(48)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const signUpSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2).max(120),
  organizationName: z.string().min(2).max(120),
  organizationSlug: organizationSlugSchema,
  password: z.string().min(8).max(128),
  timezone: z.string().min(2).max(100),
});
