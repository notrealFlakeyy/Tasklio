"use server";

import { revalidatePath } from "next/cache";

import { requireDashboardContext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { updateCustomerSchema } from "@/lib/validation/customers";
import {
  formDataValue,
  nullableString,
  parseTagInput,
} from "@/lib/utils";

export async function updateCustomerProfileAction(formData: FormData) {
  const { organization } = await requireDashboardContext();
  const supabase = await createClient();

  const parsed = updateCustomerSchema.safeParse({
    customerId: formDataValue(formData.get("customerId")),
    email: nullableString(formDataValue(formData.get("email"))),
    fullName: formDataValue(formData.get("fullName")).trim(),
    internalNotes: nullableString(formDataValue(formData.get("internalNotes"))),
    notes: nullableString(formDataValue(formData.get("notes"))),
    phone: nullableString(formDataValue(formData.get("phone"))),
    status: formDataValue(formData.get("status"), "active"),
    tags: parseTagInput(formDataValue(formData.get("tags"))),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid customer profile.");
  }

  const { error } = await supabase
    .from("customers")
    .update({
      email: parsed.data.email,
      full_name: parsed.data.fullName,
      internal_notes: parsed.data.internalNotes,
      notes: parsed.data.notes,
      phone: parsed.data.phone,
      status: parsed.data.status,
      tags: parsed.data.tags,
    })
    .eq("organization_id", organization.id)
    .eq("id", parsed.data.customerId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/customers");
  revalidatePath(`/dashboard/customers/${parsed.data.customerId}`);
}
