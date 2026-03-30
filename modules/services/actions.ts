"use server";

import { revalidatePath } from "next/cache";

import { requireDashboardContext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  deleteServiceSchema,
  serviceFormSchema,
} from "@/lib/validation/services";
import { formDataValue, nullableString } from "@/lib/utils";

export async function upsertServiceAction(formData: FormData) {
  const { organization } = await requireDashboardContext();
  const supabase = await createClient();

  const candidate = {
    bufferMinutes: Number(formDataValue(formData.get("bufferMinutes"), "0")),
    currency: formDataValue(formData.get("currency"), "EUR").toUpperCase(),
    description: nullableString(formDataValue(formData.get("description"))),
    durationMinutes: Number(formDataValue(formData.get("durationMinutes"), "30")),
    id: nullableString(formDataValue(formData.get("id"))) ?? undefined,
    isActive: formData.get("isActive") === "on",
    name: formDataValue(formData.get("name")).trim(),
    priceAmount: Number(formDataValue(formData.get("priceAmount"), "0")),
  };

  const parsed = serviceFormSchema.safeParse(candidate);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid service.");
  }

  const payload = {
    buffer_minutes: parsed.data.bufferMinutes,
    currency: parsed.data.currency,
    description: parsed.data.description,
    duration_minutes: parsed.data.durationMinutes,
    is_active: parsed.data.isActive,
    name: parsed.data.name,
    organization_id: organization.id,
    price_amount: parsed.data.priceAmount,
  };

  const query = parsed.data.id
    ? supabase
        .from("services")
        .update(payload)
        .eq("id", parsed.data.id)
        .eq("organization_id", organization.id)
    : supabase.from("services").insert(payload);

  const { error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/services");
  revalidatePath(`/book/${organization.slug}`);
}

export async function deleteServiceAction(formData: FormData) {
  const { organization } = await requireDashboardContext();
  const supabase = await createClient();
  const parsed = deleteServiceSchema.safeParse({
    serviceId: formDataValue(formData.get("serviceId")),
  });

  if (!parsed.success) {
    throw new Error("Invalid service id.");
  }

  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", parsed.data.serviceId)
    .eq("organization_id", organization.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/services");
  revalidatePath(`/book/${organization.slug}`);
}
