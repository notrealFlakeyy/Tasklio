"use server";

import { revalidatePath } from "next/cache";

import { requireDashboardContext } from "@/lib/auth";
import {
  createErrorActionState,
  createSuccessActionState,
  getFieldErrorsFromZodError,
  type FormActionState,
} from "@/lib/form-action-state";
import { createClient } from "@/lib/supabase/server";
import { organizationSettingsSchema } from "@/lib/validation/organizations";
import { formDataValue, nullableString } from "@/lib/utils";

export async function updateOrganizationSettingsAction(
  _state: FormActionState,
  formData: FormData,
) {
  const { organization } = await requireDashboardContext();
  const supabase = await createClient();

  const candidate = {
    brandAccentColor: formDataValue(formData.get("brandAccentColor"), "#786452").trim(),
    brandAltColor: formDataValue(formData.get("brandAltColor"), "#e6fdff").trim(),
    brandLogoUrl: nullableString(formDataValue(formData.get("brandLogoUrl"))),
    brandPrimaryColor: formDataValue(formData.get("brandPrimaryColor"), "#443730").trim(),
    brandSurfaceColor: formDataValue(formData.get("brandSurfaceColor"), "#eaf7cf").trim(),
    bookingNoticeHours: Number(formDataValue(formData.get("bookingNoticeHours"), "0")),
    contactEmail: nullableString(formDataValue(formData.get("contactEmail"))),
    contactPhone: nullableString(formDataValue(formData.get("contactPhone"))),
    name: formDataValue(formData.get("name")).trim(),
    publicDescription: nullableString(formDataValue(formData.get("publicDescription"))),
    publicHeadline: nullableString(formDataValue(formData.get("publicHeadline"))),
    publicTagline: nullableString(formDataValue(formData.get("publicTagline"))),
    slug: formDataValue(formData.get("slug")).trim().toLowerCase(),
    slotIntervalMinutes: Number(formDataValue(formData.get("slotIntervalMinutes"), "15")),
    timezone: formDataValue(formData.get("timezone")).trim(),
  };

  const parsed = organizationSettingsSchema.safeParse(candidate);

  if (!parsed.success) {
    return createErrorActionState(
      parsed.error.issues[0]?.message ?? "Invalid organization settings.",
      getFieldErrorsFromZodError(parsed.error),
    );
  }

  const { error } = await supabase
    .from("organizations")
    .update({
      brand_accent_color: parsed.data.brandAccentColor,
      brand_alt_color: parsed.data.brandAltColor,
      brand_logo_url: parsed.data.brandLogoUrl,
      brand_primary_color: parsed.data.brandPrimaryColor,
      brand_surface_color: parsed.data.brandSurfaceColor,
      booking_notice_hours: parsed.data.bookingNoticeHours,
      contact_email: parsed.data.contactEmail,
      contact_phone: parsed.data.contactPhone,
      name: parsed.data.name,
      public_description: parsed.data.publicDescription,
      public_headline: parsed.data.publicHeadline,
      public_tagline: parsed.data.publicTagline,
      slug: parsed.data.slug,
      slot_interval_minutes: parsed.data.slotIntervalMinutes,
      timezone: parsed.data.timezone,
    })
    .eq("id", organization.id);

  if (error) {
    return createErrorActionState(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath(`/book/${organization.slug}`);
  revalidatePath(`/book/${parsed.data.slug}`);

  return createSuccessActionState("Organization settings saved.");
}
