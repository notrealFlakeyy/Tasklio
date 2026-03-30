"use server";

import { redirect } from "next/navigation";

import type { ActionState } from "@/lib/action-state";
import { getServerEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { signInSchema, signUpSchema } from "@/lib/validation/auth";
import { formDataValue, slugify } from "@/lib/utils";

export async function signInAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const candidate = {
    email: formDataValue(formData.get("email")).trim().toLowerCase(),
    password: formDataValue(formData.get("password")),
  };

  const parsed = signInSchema.safeParse(candidate);

  if (!parsed.success) {
    return {
      message: parsed.error.issues[0]?.message ?? "Invalid sign-in details.",
      status: "error",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      message: error.message,
      status: "error",
    };
  }

  const nextPath = formDataValue(formData.get("next"), "/dashboard");

  redirect(nextPath.startsWith("/") ? nextPath : "/dashboard");
}

export async function signUpOwnerAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
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
    return {
      message: parsed.error.issues[0]?.message ?? "Invalid sign-up details.",
      status: "error",
    };
  }

  const admin = createAdminClient();
  const { data: existingOrganization } = await admin
    .from("organizations")
    .select("id")
    .eq("slug", parsed.data.organizationSlug)
    .maybeSingle();

  if (existingOrganization) {
    return {
      message: "That business URL is already taken.",
      status: "error",
    };
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
    return {
      message: error.message,
      status: "error",
    };
  }

  const userId = data.user?.id;

  if (!userId) {
    return {
      message:
        "Account created, but Supabase did not return a user id. Please try signing in.",
      status: "success",
    };
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
    return {
      message:
        organizationError?.message ??
        "Account created, but business setup failed. Check the database logs before continuing.",
      status: "error",
    };
  }

  const { error: membershipError } = await admin.from("organization_members").insert({
    organization_id: organization.id,
    role: "owner",
    user_id: userId,
  });

  if (membershipError) {
    return {
      message:
        "Business created, but owner membership setup failed. Fix the membership row before continuing.",
      status: "error",
    };
  }

  const { error: subscriptionError } = await admin
    .from("organization_subscriptions")
    .insert({
      organization_id: organization.id,
      plan_id: "starter_free",
      status: "trialing",
    });

  if (subscriptionError) {
    return {
      message:
        "Owner account created, but the starter subscription stub failed. Review the billing tables before launch.",
      status: "error",
    };
  }

  if (data.session) {
    redirect("/dashboard");
  }

  return {
    message: "Account created. Check your inbox to verify your email, then sign in.",
    status: "success",
  };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/sign-in");
}
