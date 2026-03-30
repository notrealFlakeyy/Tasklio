import { addHours, addMinutes, isBefore, max } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

import { ceilToSlot, minutesToTimeInput, overlaps } from "@/lib/date-utils";
import type { Tables } from "@/lib/database.types";

type SlotInput = {
  date: string;
  existingBookings: Pick<
    Tables<"bookings">,
    "buffer_minutes" | "ends_at" | "starts_at" | "status"
  >[];
  noticeHours: number;
  now?: Date;
  serviceBufferMinutes: number;
  serviceDurationMinutes: number;
  slotIntervalMinutes: number;
  timeOffPeriods: Pick<Tables<"time_off_periods">, "ends_at" | "starts_at">[];
  timezone: string;
  workingHours: Pick<Tables<"availability_rules">, "end_minute" | "start_minute">[];
};

export type GeneratedSlot = {
  endsAt: string;
  label: string;
  startsAt: string;
};

export function getBookableSlots(input: SlotInput): GeneratedSlot[] {
  const now = input.now ?? new Date();
  const noticeCutoff = addHours(now, input.noticeHours);
  const slots: GeneratedSlot[] = [];

  for (const window of input.workingHours) {
    const windowStart = fromZonedTime(
      `${input.date}T${minutesToTimeInput(window.start_minute)}:00`,
      input.timezone,
    );
    const windowEnd = fromZonedTime(
      `${input.date}T${minutesToTimeInput(window.end_minute)}:00`,
      input.timezone,
    );

    let current = max([windowStart, ceilToSlot(noticeCutoff, input.slotIntervalMinutes)]);

    while (
      addMinutes(
        current,
        input.serviceDurationMinutes + input.serviceBufferMinutes,
      ) <= windowEnd
    ) {
      const serviceEnd = addMinutes(current, input.serviceDurationMinutes);
      const occupiedEnd = addMinutes(serviceEnd, input.serviceBufferMinutes);

      const overlapsTimeOff = input.timeOffPeriods.some((period) =>
        overlaps(
          current,
          occupiedEnd,
          new Date(period.starts_at),
          new Date(period.ends_at),
        ),
      );

      const overlapsBooking = input.existingBookings.some((booking) => {
        if (booking.status !== "pending" && booking.status !== "confirmed") {
          return false;
        }

        return overlaps(
          current,
          occupiedEnd,
          new Date(booking.starts_at),
          addMinutes(new Date(booking.ends_at), booking.buffer_minutes),
        );
      });

      if (!overlapsTimeOff && !overlapsBooking && !isBefore(current, noticeCutoff)) {
        slots.push({
          endsAt: serviceEnd.toISOString(),
          label: formatInTimeZone(current, input.timezone, "HH:mm"),
          startsAt: current.toISOString(),
        });
      }

      current = addMinutes(current, input.slotIntervalMinutes);
    }
  }

  return slots;
}
