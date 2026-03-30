import { NextResponse } from "next/server";

import type { Tables } from "@/lib/database.types";
import { createAdminClient } from "@/lib/supabase/admin";
import { slotQuerySchema } from "@/lib/validation/bookings";
import { getPublicAvailabilityContext } from "@/modules/bookings/queries";
import { getBookableSlots } from "@/modules/bookings/slots";
import { getPublicOrganizationBySlug } from "@/modules/organizations/queries";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const query = Object.fromEntries(new URL(request.url).searchParams.entries());
  const parsed = slotQuerySchema.safeParse({
    date: query.date,
    serviceId: query.serviceId,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid slot query." },
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

  const availability = await getPublicAvailabilityContext(
    organization.id,
    organization.timezone,
    parsed.data.date,
  );

  if (availability.blockedDate) {
    return NextResponse.json({ slots: [] });
  }

  const slots = getBookableSlots({
    date: parsed.data.date,
    existingBookings: availability.bookings,
    noticeHours: organization.booking_notice_hours,
    serviceBufferMinutes: service.buffer_minutes,
    serviceDurationMinutes: service.duration_minutes,
    slotIntervalMinutes: organization.slot_interval_minutes,
    timeOffPeriods: availability.timeOffPeriods,
    timezone: organization.timezone,
    workingHours: availability.rules,
  });

  return NextResponse.json({ slots });
}
