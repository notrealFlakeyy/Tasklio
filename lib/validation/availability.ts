import { z } from "zod";

const timeInputSchema = z.string().regex(/^\d{2}:\d{2}$/);

const weeklyRuleSchema = z
  .object({
    enabled: z.boolean(),
    endTime: timeInputSchema,
    startTime: timeInputSchema,
    weekday: z.number().int().min(0).max(6),
  })
  .refine((value) => !value.enabled || value.startTime < value.endTime, {
    message: "End time must be later than start time.",
    path: ["endTime"],
  });

export const weeklyAvailabilitySchema = z.object({
  days: z.array(weeklyRuleSchema).length(7),
});

export const blockedDateSchema = z.object({
  blockedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().max(240).nullable(),
});

export const deleteBlockedDateSchema = z.object({
  blockedDateId: z.string().uuid(),
});

export const timeOffSchema = z
  .object({
    endsAt: z.string().datetime({ offset: true }),
    reason: z.string().max(240).nullable(),
    startsAt: z.string().datetime({ offset: true }),
  })
  .refine((value) => value.startsAt < value.endsAt, {
    message: "Time off end must be later than start.",
    path: ["endsAt"],
  });

export const deleteTimeOffSchema = z.object({
  timeOffId: z.string().uuid(),
});
