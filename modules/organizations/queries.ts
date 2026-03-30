import "server-only";

import type { Tables } from "@/lib/database.types";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getPublicOrganizationBySlug(
  slug: string,
): Promise<Tables<"organizations"> | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("slug", slug)
    .in("status", ["active", "trialing"])
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function listPublicServices(
  organizationId: string,
): Promise<Tables<"services">[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("is_active", true)
    .order("price_amount", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []) as Tables<"services">[];
}
