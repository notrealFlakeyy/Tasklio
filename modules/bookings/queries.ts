import "server-only";

import type { Tables } from "@/lib/database.types";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { businessDateBoundsToUtc, weekdayFromDate } from "@/lib/date-utils";

export type DashboardBookingItem = Tables<"bookings"> & {
  customers:
    | Pick<Tables<"customers">, "email" | "full_name" | "phone" | "public_id">
    | null;
  services:
    | Pick<
        Tables<"services">,
        "currency" | "duration_minutes" | "name" | "price_amount"
      >
    | null;
};

export async function listBookingsForDashboard(
  organizationId: string,
): Promise<DashboardBookingItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
        *,
        services(name, duration_minutes, currency, price_amount),
        customers(full_name, email, phone, public_id)
      `,
    )
    .eq("organization_id", organizationId)
    .order("starts_at", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []) as DashboardBookingItem[];
}

export async function getPublicAvailabilityContext(
  organizationId: string,
  timezone: string,
  date: string,
): Promise<{
  blockedDate: { id: string } | null;
  bookings: Pick<
    Tables<"bookings">,
    "buffer_minutes" | "ends_at" | "starts_at" | "status"
  >[];
  rules: Pick<Tables<"availability_rules">, "end_minute" | "start_minute">[];
  timeOffPeriods: Pick<Tables<"time_off_periods">, "ends_at" | "starts_at">[];
}> {
  const supabase = createAdminClient();
  const weekday = weekdayFromDate(date);
  const { nextDay, start } = businessDateBoundsToUtc(date, timezone);

  const [rulesResult, blockedDateResult, timeOffResult, bookingsResult] =
    await Promise.all([
      supabase
        .from("availability_rules")
        .select("start_minute, end_minute")
        .eq("organization_id", organizationId)
        .eq("weekday", weekday)
        .eq("is_active", true)
        .order("start_minute", { ascending: true }),
      supabase
        .from("blocked_dates")
        .select("id")
        .eq("organization_id", organizationId)
        .eq("blocked_on", date)
        .maybeSingle(),
      supabase
        .from("time_off_periods")
        .select("starts_at, ends_at")
        .eq("organization_id", organizationId)
        .lt("starts_at", nextDay.toISOString())
        .gt("ends_at", start.toISOString()),
      supabase
        .from("bookings")
        .select("starts_at, ends_at, buffer_minutes, status")
        .eq("organization_id", organizationId)
        .lt("starts_at", nextDay.toISOString())
        .gt("ends_at", start.toISOString())
        .in("status", ["pending", "confirmed"]),
    ]);

  return {
    blockedDate: blockedDateResult.data,
    bookings: (bookingsResult.data ?? []) as Pick<
      Tables<"bookings">,
      "buffer_minutes" | "ends_at" | "starts_at" | "status"
    >[],
    rules: (rulesResult.data ?? []) as Pick<
      Tables<"availability_rules">,
      "end_minute" | "start_minute"
    >[],
    timeOffPeriods: (timeOffResult.data ?? []) as Pick<
      Tables<"time_off_periods">,
      "ends_at" | "starts_at"
    >[],
  };
}
