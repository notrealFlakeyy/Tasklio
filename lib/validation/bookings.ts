import { z } from "zod";

export const slotQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  serviceId: z.string().uuid(),
});

export const createPublicBookingSchema = z.object({
  customerEmail: z.string().email(),
  customerName: z.string().min(2).max(120),
  customerNotes: z.string().max(1_000).nullable(),
  customerPhone: z.string().max(40).nullable(),
  organizationSlug: z.string().min(3).max(48),
  serviceId: z.string().uuid(),
  startsAt: z.string().datetime({ offset: true }),
});

export const bookingIdSchema = z.object({
  bookingId: z.string().uuid(),
});

export const bookingNotesSchema = z.object({
  bookingId: z.string().uuid(),
  internalNotes: z.string().max(2_000).nullable(),
});
