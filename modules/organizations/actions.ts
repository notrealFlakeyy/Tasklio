"use server";

import { revalidatePath } from "next/cache";

import { requireDashboardContext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { organizationSettingsSchema } from "@/lib/validation/organizations";
import { formDataValue, nullableString } from "@/lib/utils";

export async function updateOrganizationSettingsAction(formData: FormData) {
  const { organization } = await requireDashboardContext();
  const supabase = await createClient();

  const candidate = {
    bookingNoticeHours: Number(formDataValue(formData.get("bookingNoticeHours"), "0")),
    contactEmail: nullableString(formDataValue(formData.get("contactEmail"))),
    contactPhone: nullableString(formDataValue(formData.get("contactPhone"))),
    name: formDataValue(formData.get("name")).trim(),
    slug: formDataValue(formData.get("slug")).trim().toLowerCase(),
    slotIntervalMinutes: Number(formDataValue(formData.get("slotIntervalMinutes"), "15")),
    timezone: formDataValue(formData.get("timezone")).trim(),
  };

  const parsed = organizationSettingsSchema.safeParse(candidate);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid organization settings.");
  }

  const { error } = await supabase
    .from("organizations")
    .update({
      booking_notice_hours: parsed.data.bookingNoticeHours,
      contact_email: parsed.data.contactEmail,
      contact_phone: parsed.data.contactPhone,
      name: parsed.data.name,
      slug: parsed.data.slug,
      slot_interval_minutes: parsed.data.slotIntervalMinutes,
      timezone: parsed.data.timezone,
    })
    .eq("id", organization.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath(`/book/${organization.slug}`);
}
