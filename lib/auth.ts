import "server-only";

import { redirect } from "next/navigation";

import type { Tables } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";

export type DashboardContext = {
  membership: Tables<"organization_members">;
  organization: Tables<"organizations">;
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
};

export async function getDashboardContext(): Promise<DashboardContext | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  const userId = typeof claims?.sub === "string" ? claims.sub : null;

  if (!userId) {
    return null;
  }

  const { data: memberships, error: membershipError } = await supabase
    .from("organization_members")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .limit(1);

  if (membershipError || !memberships?.length) {
    return null;
  }

  const membership = memberships[0] as Tables<"organization_members">;

  const { data: organization, error: organizationError } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", membership.organization_id)
    .single();

  if (organizationError || !organization) {
    return null;
  }

  return {
    membership,
    organization: organization as Tables<"organizations">,
    supabase,
    userId,
  };
}

export async function requireDashboardContext() {
  const context = await getDashboardContext();

  if (!context) {
    redirect("/auth/sign-in");
  }

  return context;
}
