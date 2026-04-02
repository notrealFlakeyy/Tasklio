import { z } from "zod";

const organizationSlugSchema = z
  .string()
  .min(3)
  .max(48)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const organizationSettingsSchema = z.object({
  brandAccentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  brandAltColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  brandLogoUrl: z.string().url().nullable(),
  brandPrimaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  brandSurfaceColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  bookingNoticeHours: z.number().int().min(0).max(720),
  contactEmail: z.string().email().nullable(),
  contactPhone: z.string().max(40).nullable(),
  name: z.string().min(2).max(120),
  publicDescription: z.string().max(560).nullable(),
  publicHeadline: z.string().max(180).nullable(),
  publicTagline: z.string().max(80).nullable(),
  slug: organizationSlugSchema,
  slotIntervalMinutes: z.number().int().min(5).max(120),
  timezone: z.string().min(2).max(100),
});
