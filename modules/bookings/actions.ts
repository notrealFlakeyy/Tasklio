"use server";

import { revalidatePath } from "next/cache";

import { requireDashboardContext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  bookingIdSchema,
  bookingNotesSchema,
} from "@/lib/validation/bookings";
import { formDataValue, nullableString } from "@/lib/utils";

async function setBookingStatus(bookingId: string, status: "cancelled" | "confirmed") {
  const { organization } = await requireDashboardContext();
  const supabase = await createClient();

  const payload =
    status === "confirmed"
      ? { confirmed_at: new Date().toISOString(), status }
      : { cancelled_at: new Date().toISOString(), status };

  const { error } = await supabase
    .from("bookings")
    .update(payload)
    .eq("id", bookingId)
    .eq("organization_id", organization.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/bookings");
}

export async function confirmBookingAction(formData: FormData) {
  const parsed = bookingIdSchema.safeParse({
    bookingId: formDataValue(formData.get("bookingId")),
  });

  if (!parsed.success) {
    throw new Error("Invalid booking id.");
  }

  await setBookingStatus(parsed.data.bookingId, "confirmed");
}

export async function cancelBookingAction(formData: FormData) {
  const parsed = bookingIdSchema.safeParse({
    bookingId: formDataValue(formData.get("bookingId")),
  });

  if (!parsed.success) {
    throw new Error("Invalid booking id.");
  }

  await setBookingStatus(parsed.data.bookingId, "cancelled");
}

export async function updateBookingNotesAction(formData: FormData) {
  const { organization } = await requireDashboardContext();
  const supabase = await createClient();

  const parsed = bookingNotesSchema.safeParse({
    bookingId: formDataValue(formData.get("bookingId")),
    internalNotes: nullableString(formDataValue(formData.get("internalNotes"))),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid booking notes.");
  }

  const { error } = await supabase
    .from("bookings")
    .update({
      internal_notes: parsed.data.internalNotes,
    })
    .eq("id", parsed.data.bookingId)
    .eq("organization_id", organization.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/bookings");
}
