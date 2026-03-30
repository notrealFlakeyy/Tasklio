import { z } from "zod";

export const customerStatusSchema = z.enum([
  "lead",
  "active",
  "vip",
  "inactive",
]);

export const updateCustomerSchema = z.object({
  customerId: z.string().uuid(),
  email: z.string().email().nullable(),
  fullName: z.string().min(2).max(120),
  internalNotes: z.string().max(4_000).nullable(),
  notes: z.string().max(2_000).nullable(),
  phone: z.string().max(40).nullable(),
  status: customerStatusSchema,
  tags: z.array(z.string().min(1).max(40)).max(12),
});
