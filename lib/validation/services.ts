import { z } from "zod";

export const serviceFormSchema = z.object({
  bufferMinutes: z.number().int().min(0).max(240),
  currency: z.string().length(3),
  description: z.string().max(500).nullable(),
  durationMinutes: z.number().int().min(5).max(480),
  id: z.string().uuid().optional(),
  isActive: z.boolean(),
  name: z.string().min(2).max(120),
  priceAmount: z.number().int().min(0).max(2_000_000),
});

export const deleteServiceSchema = z.object({
  serviceId: z.string().uuid(),
});
