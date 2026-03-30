import { z } from "zod";

export const organizationSettingsSchema = z.object({
  bookingNoticeHours: z.number().int().min(0).max(720),
  contactEmail: z.string().email().nullable(),
  contactPhone: z.string().max(40).nullable(),
  name: z.string().min(2).max(120),
  slug: z
    .string()
    .min(3)
    .max(48)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  slotIntervalMinutes: z.number().int().min(5).max(120),
  timezone: z.string().min(2).max(100),
});
