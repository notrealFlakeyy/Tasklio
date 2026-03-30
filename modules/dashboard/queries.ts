import "server-only";

import { startOfMonth } from "date-fns";

import type { Tables } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";

export type UpcomingDashboardItem = {
  customer_name: string;
  id: string;
  service_name_snapshot: string | null;
  starts_at: string;
  status: string;
};

export type RevenueByServiceItem = {
  bookedRevenueAmount: number;
  serviceId: string;
  serviceName: string;
  totalBookings: number;
};

export async function getDashboardSnapshot(organizationId: string): Promise<{
  activeServices: number;
  averageBookingValueAmount: number;
  bookedRevenueThisMonthAmount: number;
  customerStatusBreakdown: Record<string, number>;
  newCustomersThisMonth: number;
  pastBookings: number;
  pendingBookings: number;
  totalCustomers: number;
  upcomingBookings: number;
  upcomingItems: UpcomingDashboardItem[];
  topServices: RevenueByServiceItem[];
}> {
  const supabase = await createClient();
  const now = new Date();
  const nowIso = now.toISOString();
  const monthStartIso = startOfMonth(now).toISOString();

  const [
    servicesResult,
    upcomingCountResult,
    pastCountResult,
    pendingCountResult,
    customersCountResult,
    newCustomersCountResult,
    upcomingResult,
    customersResult,
    bookingsResult,
  ] = await Promise.all([
    supabase
      .from("services")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .eq("is_active", true),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .gte("starts_at", nowIso),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .lt("starts_at", nowIso),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .eq("status", "pending"),
    supabase
      .from("customers")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", organizationId),
    supabase
      .from("customers")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .gte("created_at", monthStartIso),
    supabase
      .from("bookings")
      .select(
        "id, status, starts_at, customer_name, service_name_snapshot",
      )
      .eq("organization_id", organizationId)
      .gte("starts_at", nowIso)
      .order("starts_at", { ascending: true })
      .limit(5),
    supabase
      .from("customers")
      .select("status")
      .eq("organization_id", organizationId),
    supabase
      .from("bookings")
      .select("service_id, service_name_snapshot, service_price_amount, status, starts_at")
      .eq("organization_id", organizationId),
  ]);

  const customers = (customersResult.data ?? []) as Pick<
    Tables<"customers">,
    "status"
  >[];
  const bookings = (bookingsResult.data ?? []) as Pick<
    Tables<"bookings">,
    "service_id" | "service_name_snapshot" | "service_price_amount" | "starts_at" | "status"
  >[];

  const customerStatusBreakdown = customers.reduce<Record<string, number>>(
    (accumulator, customer) => {
      accumulator[customer.status] = (accumulator[customer.status] ?? 0) + 1;
      return accumulator;
    },
    {},
  );

  let bookedRevenueThisMonthAmount = 0;
  let bookedValueAccumulator = 0;
  let bookedValueCount = 0;
  const topServicesMap = new Map<string, RevenueByServiceItem>();

  for (const booking of bookings) {
    const revenueEligible =
      booking.status === "pending" ||
      booking.status === "confirmed" ||
      booking.status === "completed";

    if (!revenueEligible) {
      continue;
    }

    bookedValueAccumulator += booking.service_price_amount;
    bookedValueCount += 1;

    if (booking.starts_at >= monthStartIso) {
      bookedRevenueThisMonthAmount += booking.service_price_amount;
    }

    const serviceId = booking.service_id;
    const current = topServicesMap.get(serviceId) ?? {
      bookedRevenueAmount: 0,
      serviceId,
      serviceName: booking.service_name_snapshot ?? "Service",
      totalBookings: 0,
    };

    current.bookedRevenueAmount += booking.service_price_amount;
    current.totalBookings += 1;

    topServicesMap.set(serviceId, current);
  }

  return {
    activeServices: servicesResult.count ?? 0,
    averageBookingValueAmount:
      bookedValueCount > 0 ? Math.round(bookedValueAccumulator / bookedValueCount) : 0,
    bookedRevenueThisMonthAmount,
    customerStatusBreakdown,
    newCustomersThisMonth: newCustomersCountResult.count ?? 0,
    pastBookings: pastCountResult.count ?? 0,
    pendingBookings: pendingCountResult.count ?? 0,
    totalCustomers: customersCountResult.count ?? 0,
    upcomingBookings: upcomingCountResult.count ?? 0,
    upcomingItems: (upcomingResult.data ?? []) as UpcomingDashboardItem[],
    topServices: Array.from(topServicesMap.values())
      .sort((left, right) => right.bookedRevenueAmount - left.bookedRevenueAmount)
      .slice(0, 5),
  };
}
