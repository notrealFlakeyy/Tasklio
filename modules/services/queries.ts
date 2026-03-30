import "server-only";

import type { Tables } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";

export async function listServicesForOrganization(
  organizationId: string,
): Promise<Tables<"services">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []) as Tables<"services">[];
}

export type ServicePerformanceSummary = {
  bookedRevenueAmount: number;
  completedRevenueAmount: number;
  serviceId: string;
  totalBookings: number;
};

export async function getServicePerformanceSummary(
  organizationId: string,
): Promise<ServicePerformanceSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("service_id, status, service_price_amount")
    .eq("organization_id", organizationId);

  if (error) {
    return [];
  }

  const summary = new Map<string, ServicePerformanceSummary>();

  for (const booking of (data ?? []) as Pick<
    Tables<"bookings">,
    "service_id" | "service_price_amount" | "status"
  >[]) {
    const current = summary.get(booking.service_id) ?? {
      bookedRevenueAmount: 0,
      completedRevenueAmount: 0,
      serviceId: booking.service_id,
      totalBookings: 0,
    };

    current.totalBookings += 1;

    if (
      booking.status === "pending" ||
      booking.status === "confirmed" ||
      booking.status === "completed"
    ) {
      current.bookedRevenueAmount += booking.service_price_amount;
    }

    if (booking.status === "completed") {
      current.completedRevenueAmount += booking.service_price_amount;
    }

    summary.set(booking.service_id, current);
  }

  return Array.from(summary.values());
}
