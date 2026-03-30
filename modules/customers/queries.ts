import "server-only";

import type { Tables } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";

type CustomerBookingRow = Pick<
  Tables<"bookings">,
  | "created_at"
  | "customer_id"
  | "id"
  | "service_currency"
  | "service_name_snapshot"
  | "service_price_amount"
  | "starts_at"
  | "status"
>;

export type CustomerListItem = Tables<"customers"> & {
  bookedRevenueAmount: number;
  totalBookings: number;
  upcomingBookings: number;
};

export type CustomerProfile = {
  bookingHistory: (Tables<"bookings"> & {
    services: Pick<Tables<"services">, "name"> | null;
  })[];
  customer: Tables<"customers">;
  metrics: {
    bookedRevenueAmount: number;
    completedBookings: number;
    totalBookings: number;
    upcomingBookings: number;
  };
};

function summarizeCustomerBookings(bookings: CustomerBookingRow[]) {
  const now = Date.now();

  return bookings.reduce(
    (accumulator, booking) => {
      const isRevenueStatus =
        booking.status === "pending" ||
        booking.status === "confirmed" ||
        booking.status === "completed";

      accumulator.totalBookings += 1;

      if (new Date(booking.starts_at).getTime() > now) {
        accumulator.upcomingBookings += 1;
      }

      if (booking.status === "completed") {
        accumulator.completedBookings += 1;
      }

      if (isRevenueStatus) {
        accumulator.bookedRevenueAmount += booking.service_price_amount;
      }

      return accumulator;
    },
    {
      bookedRevenueAmount: 0,
      completedBookings: 0,
      totalBookings: 0,
      upcomingBookings: 0,
    },
  );
}

export async function listCustomersForOrganization(
  organizationId: string,
): Promise<CustomerListItem[]> {
  const supabase = await createClient();
  const [customersResult, bookingsResult] = await Promise.all([
    supabase
      .from("customers")
      .select("*")
      .eq("organization_id", organizationId)
      .order("last_booked_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("bookings")
      .select(
        "id, customer_id, status, starts_at, service_name_snapshot, service_price_amount, service_currency, created_at",
      )
      .eq("organization_id", organizationId)
      .not("customer_id", "is", null),
  ]);

  const customers = (customersResult.data ?? []) as Tables<"customers">[];
  const bookings = (bookingsResult.data ?? []) as CustomerBookingRow[];

  const bookingsByCustomer = new Map<string, CustomerBookingRow[]>();

  for (const booking of bookings) {
    if (!booking.customer_id) {
      continue;
    }

    const existing = bookingsByCustomer.get(booking.customer_id) ?? [];
    existing.push(booking);
    bookingsByCustomer.set(booking.customer_id, existing);
  }

  return customers.map((customer) => ({
    ...customer,
    ...summarizeCustomerBookings(bookingsByCustomer.get(customer.id) ?? []),
  }));
}

export async function getCustomerProfile(
  organizationId: string,
  customerId: string,
): Promise<CustomerProfile | null> {
  const supabase = await createClient();
  const [customerResult, bookingsResult] = await Promise.all([
    supabase
      .from("customers")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("id", customerId)
      .maybeSingle(),
    supabase
      .from("bookings")
      .select("*, services(name)")
      .eq("organization_id", organizationId)
      .eq("customer_id", customerId)
      .order("starts_at", { ascending: false }),
  ]);

  if (!customerResult.data) {
    return null;
  }

  const bookingHistory = (bookingsResult.data ?? []) as (Tables<"bookings"> & {
    services: Pick<Tables<"services">, "name"> | null;
  })[];

  return {
    bookingHistory,
    customer: customerResult.data as Tables<"customers">,
    metrics: summarizeCustomerBookings(bookingHistory),
  };
}
