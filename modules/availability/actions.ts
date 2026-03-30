"use server";

import { revalidatePath } from "next/cache";

import { requireDashboardContext } from "@/lib/auth";
import { DAYS_OF_WEEK } from "@/lib/constants";
import {
  businessLocalDateTimeToUtc,
  parseTimeInputToMinutes,
} from "@/lib/date-utils";
import { createClient } from "@/lib/supabase/server";
import {
  blockedDateSchema,
  deleteBlockedDateSchema,
  deleteTimeOffSchema,
  timeOffSchema,
  weeklyAvailabilitySchema,
} from "@/lib/validation/availability";
import { formDataValue, nullableString } from "@/lib/utils";

export async function saveWeeklyAvailabilityAction(formData: FormData) {
  const { organization } = await requireDashboardContext();
  const supabase = await createClient();

  const days = DAYS_OF_WEEK.map((day) => ({
    enabled: formData.get(`enabled-${day.value}`) === "on",
    endTime: formDataValue(formData.get(`end-${day.value}`), "17:00"),
    startTime: formDataValue(formData.get(`start-${day.value}`), "09:00"),
    weekday: day.value,
  }));

  const parsed = weeklyAvailabilitySchema.safeParse({ days });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid weekly hours.");
  }

  const activeRules = parsed.data.days
    .filter((day) => day.enabled)
    .map((day) => ({
      end_minute: parseTimeInputToMinutes(day.endTime),
      organization_id: organization.id,
      start_minute: parseTimeInputToMinutes(day.startTime),
      weekday: day.weekday,
    }));

  const { error: deleteError } = await supabase
    .from("availability_rules")
    .delete()
    .eq("organization_id", organization.id);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (activeRules.length > 0) {
    const { error: insertError } = await supabase
      .from("availability_rules")
      .insert(activeRules);

    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  revalidatePath("/dashboard/availability");
}

export async function addBlockedDateAction(formData: FormData) {
  const { organization } = await requireDashboardContext();
  const supabase = await createClient();
  const parsed = blockedDateSchema.safeParse({
    blockedOn: formDataValue(formData.get("blockedOn")),
    reason: nullableString(formDataValue(formData.get("reason"))),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid blocked date.");
  }

  const { error } = await supabase.from("blocked_dates").insert({
    blocked_on: parsed.data.blockedOn,
    organization_id: organization.id,
    reason: parsed.data.reason,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/availability");
}

export async function removeBlockedDateAction(formData: FormData) {
  const { organization } = await requireDashboardContext();
  const supabase = await createClient();
  const parsed = deleteBlockedDateSchema.safeParse({
    blockedDateId: formDataValue(formData.get("blockedDateId")),
  });

  if (!parsed.success) {
    throw new Error("Invalid blocked date id.");
  }

  const { error } = await supabase
    .from("blocked_dates")
    .delete()
    .eq("id", parsed.data.blockedDateId)
    .eq("organization_id", organization.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/availability");
}

export async function addTimeOffAction(formData: FormData) {
  const { organization } = await requireDashboardContext();
  const supabase = await createClient();
  const startsAtLocal = formDataValue(formData.get("startsAtLocal"));
  const endsAtLocal = formDataValue(formData.get("endsAtLocal"));

  const parsed = timeOffSchema.safeParse({
    endsAt: businessLocalDateTimeToUtc(endsAtLocal, organization.timezone),
    reason: nullableString(formDataValue(formData.get("reason"))),
    startsAt: businessLocalDateTimeToUtc(startsAtLocal, organization.timezone),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid time off.");
  }

  const { error } = await supabase.from("time_off_periods").insert({
    ends_at: parsed.data.endsAt,
    organization_id: organization.id,
    reason: parsed.data.reason,
    starts_at: parsed.data.startsAt,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/availability");
}

export async function removeTimeOffAction(formData: FormData) {
  const { organization } = await requireDashboardContext();
  const supabase = await createClient();
  const parsed = deleteTimeOffSchema.safeParse({
    timeOffId: formDataValue(formData.get("timeOffId")),
  });

  if (!parsed.success) {
    throw new Error("Invalid time-off id.");
  }

  const { error } = await supabase
    .from("time_off_periods")
    .delete()
    .eq("id", parsed.data.timeOffId)
    .eq("organization_id", organization.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/availability");
}
