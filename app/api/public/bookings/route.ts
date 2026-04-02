import { NextResponse } from "next/server";

import type { Database, Tables } from "@/lib/database.types";
import { getFieldErrorsFromZodError } from "@/lib/form-action-state";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicBookingSchema } from "@/lib/validation/bookings";

export async function POST(request: Request) {
  const rawBody = (await request.json()) as Record<string, unknown>;
  const parsed = createPublicBookingSchema.safeParse({
    customerEmail:
      typeof rawBody.customerEmail === "string" ? rawBody.customerEmail : "",
    customerName: typeof rawBody.customerName === "string" ? rawBody.customerName : "",
    customerNotes:
      typeof rawBody.customerNotes === "string" && rawBody.customerNotes.length
        ? rawBody.customerNotes
        : null,
    customerPhone:
      typeof rawBody.customerPhone === "string" && rawBody.customerPhone.length
        ? rawBody.customerPhone
        : null,
    organizationSlug:
      typeof rawBody.organizationSlug === "string" ? rawBody.organizationSlug : "",
    serviceId: typeof rawBody.serviceId === "string" ? rawBody.serviceId : "",
    startsAt: typeof rawBody.startsAt === "string" ? rawBody.startsAt : "",
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        fieldErrors: getFieldErrorsFromZodError(parsed.error),
        message: parsed.error.issues[0]?.message ?? "Please check the booking details.",
      },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const rpcArgs: Database["public"]["Functions"]["create_public_booking"]["Args"] = {
    p_customer_email: parsed.data.customerEmail,
    p_customer_name: parsed.data.customerName,
    p_customer_notes: parsed.data.customerNotes,
    p_customer_phone: parsed.data.customerPhone,
    p_organization_slug: parsed.data.organizationSlug,
    p_service_id: parsed.data.serviceId,
    p_starts_at: parsed.data.startsAt,
  };
  const { data, error } = await (
    admin as unknown as {
      rpc: (
        fn: "create_public_booking",
        args: Database["public"]["Functions"]["create_public_booking"]["Args"],
      ) => Promise<{
        data: Tables<"bookings"> | null;
        error: { message: string } | null;
      }>;
    }
  ).rpc("create_public_booking", rpcArgs);

  if (error) {
    const status = error.message.toLowerCase().includes("slot") ? 409 : 400;
    const message =
      error.message === "Selected slot is no longer available"
        ? "That time was just booked by someone else. Please choose another time."
        : error.message || "Unable to create booking.";

    return NextResponse.json(
      { message },
      { status },
    );
  }

  return NextResponse.json({ booking: data }, { status: 201 });
}
