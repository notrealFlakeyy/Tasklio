import { z } from "zod";

export const slotQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a valid date."),
  serviceId: z.string().uuid("Please choose a valid service."),
});

export const calendarQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Please choose a valid month."),
  serviceId: z.string().uuid("Please choose a valid service."),
});

export const createPublicBookingSchema = z.object({
  customerEmail: z.string().email("Please enter a valid email address."),
  customerName: z
    .string()
    .min(2, "Please enter your name.")
    .max(120, "Please use a shorter name."),
  customerNotes: z.string().max(1_000, "Notes are too long.").nullable(),
  customerPhone: z.string().max(40, "Phone number is too long.").nullable(),
  organizationSlug: z.string().min(3).max(48),
  serviceId: z.string().uuid("Please choose a valid service."),
  startsAt: z.string().datetime({ offset: true, message: "Please choose a valid time." }),
});

export const bookingIdSchema = z.object({
  bookingId: z.string().uuid(),
});

export const bookingNotesSchema = z.object({
  bookingId: z.string().uuid(),
  internalNotes: z.string().max(2_000).nullable(),
});
