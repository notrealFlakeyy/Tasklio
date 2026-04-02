"use server";

import { redirect } from "next/navigation";

import { getServerEnv } from "@/lib/env";
import { DEFAULT_WEEKLY_HOURS } from "@/lib/constants";
import {
  createErrorActionState,
  createSuccessActionState,
  getFieldErrorsFromZodError,
  type FormActionState,
} from "@/lib/form-action-state";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { signInSchema, signUpSchema } from "@/lib/validation/auth";
import { parseTimeInputToMinutes } from "@/lib/date-utils";
import { formDataValue, slugify } from "@/lib/utils";

export async function signInAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const candidate = {
    email: formDataValue(formData.get("email")).trim().toLowerCase(),
    password: formDataValue(formData.get("password")),
  };

  const parsed = signInSchema.safeParse(candidate);

  if (!parsed.success) {
    return createErrorActionState(
      parsed.error.issues[0]?.message ?? "Invalid sign-in details.",
      getFieldErrorsFromZodError(parsed.error),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return createErrorActionState(error.message, {
      email: error.message,
      password: error.message,
    });
  }

  const nextPath = formDataValue(formData.get("next"), "/dashboard");

  redirect(nextPath.startsWith("/") ? nextPath : "/dashboard");
}

export async function signUpOwnerAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const organizationSlug = slugify(
    formDataValue(formData.get("organizationSlug")) ||
      formDataValue(formData.get("organizationName")),
  );

  const candidate = {
    email: formDataValue(formData.get("email")).trim().toLowerCase(),
    fullName: formDataValue(formData.get("fullName")).trim(),
    organizationName: formDataValue(formData.get("organizationName")).trim(),
    organizationSlug,
    password: formDataValue(formData.get("password")),
    timezone: formDataValue(formData.get("timezone")).trim(),
  };

  const parsed = signUpSchema.safeParse(candidate);

  if (!parsed.success) {
    return createErrorActionState(
      parsed.error.issues[0]?.message ?? "Invalid sign-up details.",
      getFieldErrorsFromZodError(parsed.error),
    );
  }

  const admin = createAdminClient();
  const { data: existingOrganization } = await admin
    .from("organizations")
    .select("id")
    .eq("slug", parsed.data.organizationSlug)
    .maybeSingle();

  if (existingOrganization) {
    return createErrorActionState("That ClientFlow URL is already taken.", {
      organizationSlug: "That ClientFlow URL is already taken.",
    });
  }

  const supabase = await createClient();
  const env = getServerEnv();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    options: {
      data: {
        full_name: parsed.data.fullName,
      },
      emailRedirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
    password: parsed.data.password,
  });

  if (error) {
    return createErrorActionState(error.message, {
      email: error.message,
    });
  }

  const userId = data.user?.id;

  if (!userId) {
    return createSuccessActionState(
      "Account created, but Supabase did not return a user id. Please try signing in.",
    );
  }

  const { data: organization, error: organizationError } = await admin
    .from("organizations")
    .insert({
      created_by: userId,
      name: parsed.data.organizationName,
      slug: parsed.data.organizationSlug,
      status: "trialing",
      timezone: parsed.data.timezone,
    })
    .select("id")
    .single();

  if (organizationError || !organization) {
    return createErrorActionState(
      organizationError?.message ??
        "Account created, but business setup failed. Check the database logs before continuing.",
    );
  }

  const { error: membershipError } = await admin.from("organization_members").insert({
    organization_id: organization.id,
    role: "owner",
    user_id: userId,
  });

  if (membershipError) {
    return createErrorActionState(
      "Business created, but owner membership setup failed. Fix the membership row before continuing.",
    );
  }

  const defaultAvailabilityRules = DEFAULT_WEEKLY_HOURS.filter((day) => day.enabled).map(
    (day) => ({
      end_minute: parseTimeInputToMinutes(day.endTime),
      organization_id: organization.id,
      start_minute: parseTimeInputToMinutes(day.startTime),
      weekday: day.weekday,
    }),
  );

  if (defaultAvailabilityRules.length > 0) {
    const { error: availabilityError } = await admin
      .from("availability_rules")
      .insert(defaultAvailabilityRules);

    if (availabilityError) {
      return createErrorActionState(
        "Owner account created, but default working hours could not be created.",
      );
    }
  }

  const { error: subscriptionError } = await admin
    .from("organization_subscriptions")
    .insert({
      organization_id: organization.id,
      plan_id: "starter_free",
      status: "trialing",
    });

  if (subscriptionError) {
    return createErrorActionState(
      "Owner account created, but the starter subscription stub failed. Review the billing tables before launch.",
    );
  }

  if (data.session) {
    redirect("/dashboard");
  }

  return createSuccessActionState(
    "Account created. Check your inbox to verify your email, then sign in to ClientFlow.",
  );
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/sign-in");
}
