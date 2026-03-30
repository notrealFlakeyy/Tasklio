import "server-only";

import type { Tables } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";

export async function getAvailabilitySettings(organizationId: string): Promise<{
  blockedDates: Tables<"blocked_dates">[];
  rules: Tables<"availability_rules">[];
  timeOffPeriods: Tables<"time_off_periods">[];
}> {
  const supabase = await createClient();
  const [rulesResult, blockedDatesResult, timeOffResult] = await Promise.all([
    supabase
      .from("availability_rules")
      .select("*")
      .eq("organization_id", organizationId)
      .order("weekday", { ascending: true })
      .order("start_minute", { ascending: true }),
    supabase
      .from("blocked_dates")
      .select("*")
      .eq("organization_id", organizationId)
      .order("blocked_on", { ascending: true }),
    supabase
      .from("time_off_periods")
      .select("*")
      .eq("organization_id", organizationId)
      .order("starts_at", { ascending: true }),
  ]);

  return {
    blockedDates: (blockedDatesResult.data ?? []) as Tables<"blocked_dates">[],
    rules: (rulesResult.data ?? []) as Tables<"availability_rules">[],
    timeOffPeriods: (timeOffResult.data ?? []) as Tables<"time_off_periods">[],
  };
}
