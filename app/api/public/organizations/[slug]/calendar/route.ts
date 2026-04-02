import { addDays, endOfMonth, format, startOfMonth } from "date-fns";
import { NextResponse } from "next/server";

import type { Tables } from "@/lib/database.types";
import { todayInTimeZone } from "@/lib/date-utils";
import { createAdminClient } from "@/lib/supabase/admin";
import { calendarQuerySchema } from "@/lib/validation/bookings";
import { getPublicAvailabilityContext } from "@/modules/bookings/queries";
import { getCalendarSlots } from "@/modules/bookings/slots";
import { getPublicOrganizationBySlug } from "@/modules/organizations/queries";

type CalendarDayStatus = "available" | "closed" | "full" | "past";

type CalendarDayPayload = {
  availableCount: number;
  date: string;
  status: CalendarDayStatus;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const query = Object.fromEntries(new URL(request.url).searchParams.entries());
  const parsed = calendarQuerySchema.safeParse({
    month: query.month,
    serviceId: query.serviceId,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid calendar query." },
      { status: 400 },
    );
  }

  const organization = await getPublicOrganizationBySlug(slug);

  if (!organization) {
    return NextResponse.json({ message: "Business not found." }, { status: 404 });
  }

  const admin = createAdminClient();
  const { data: serviceData, error: serviceError } = await admin
    .from("services")
    .select("*")
    .eq("id", parsed.data.serviceId)
    .eq("organization_id", organization.id)
    .eq("is_active", true)
    .single();

  if (serviceError || !serviceData) {
    return NextResponse.json({ message: "Service not found." }, { status: 404 });
  }

  const service = serviceData as Tables<"services">;
  const monthStart = startOfMonth(new Date(`${parsed.data.month}-01T00:00:00`));
  const monthEnd = endOfMonth(monthStart);
  const today = todayInTimeZone(organization.timezone);
  const days: CalendarDayPayload[] = [];

  for (
    let current = monthStart;
    current <= monthEnd;
    current = addDays(current, 1)
  ) {
    const date = format(current, "yyyy-MM-dd");

    if (date < today) {
      days.push({ availableCount: 0, date, status: "past" });
      continue;
    }

    const availability = await getPublicAvailabilityContext(
      organization.id,
      organization.timezone,
      date,
    );

    if (availability.blockedDate || availability.rules.length === 0) {
      days.push({ availableCount: 0, date, status: "closed" });
      continue;
    }

    const slots = getCalendarSlots({
      date,
      existingBookings: availability.bookings,
      noticeHours: organization.booking_notice_hours,
      serviceBufferMinutes: service.buffer_minutes,
      serviceDurationMinutes: service.duration_minutes,
      slotIntervalMinutes: organization.slot_interval_minutes,
      timeOffPeriods: availability.timeOffPeriods,
      timezone: organization.timezone,
      workingHours: availability.rules,
    });

    const availableCount = slots.filter((slot) => slot.isAvailable).length;
    const status: CalendarDayStatus =
      availableCount > 0 ? "available" : slots.length > 0 ? "full" : "closed";

    days.push({ availableCount, date, status });
  }

  return NextResponse.json({ days });
}
