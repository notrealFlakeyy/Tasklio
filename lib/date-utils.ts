import {
  addDays,
  addMinutes,
  format,
  isBefore,
  setMilliseconds,
  setSeconds,
} from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

export function parseTimeInputToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);

  return hours * 60 + minutes;
}

export function minutesToTimeInput(value: number) {
  const hours = Math.floor(value / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (value % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function businessLocalDateTimeToUtc(
  localDateTime: string,
  timezone: string,
) {
  return fromZonedTime(localDateTime, timezone).toISOString();
}

export function businessDateBoundsToUtc(date: string, timezone: string) {
  const start = fromZonedTime(`${date}T00:00:00`, timezone);
  const nextDay = addDays(start, 1);
  const end = addMinutes(nextDay, -1);

  return { start, end, nextDay };
}

export function weekdayFromDate(date: string) {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}

export function formatUtcInTimeZone(
  utcIso: string,
  timezone: string,
  pattern = "EEE d MMM, HH:mm",
) {
  return formatInTimeZone(utcIso, timezone, pattern);
}

export function todayInTimeZone(timezone: string) {
  return formatInTimeZone(new Date(), timezone, "yyyy-MM-dd");
}

export function ceilToSlot(date: Date, slotIntervalMinutes: number) {
  const withoutSeconds = setMilliseconds(setSeconds(date, 0), 0);
  const totalMinutes = withoutSeconds.getUTCMinutes();
  const remainder = totalMinutes % slotIntervalMinutes;

  if (remainder === 0) {
    return withoutSeconds;
  }

  return addMinutes(withoutSeconds, slotIntervalMinutes - remainder);
}

export function overlaps(
  rangeAStart: Date,
  rangeAEnd: Date,
  rangeBStart: Date,
  rangeBEnd: Date,
) {
  return rangeAStart < rangeBEnd && rangeBStart < rangeAEnd;
}

export function isPast(date: Date) {
  return isBefore(date, new Date());
}

export function formatDateTimeLocalValue(utcIso: string, timezone: string) {
  return formatInTimeZone(utcIso, timezone, "yyyy-MM-dd'T'HH:mm");
}

export function formatDateOnly(date: string) {
  return format(new Date(`${date}T00:00:00Z`), "PPP");
}
