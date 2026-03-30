import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { requireDashboardContext } from "@/lib/auth";
import { formatUtcInTimeZone } from "@/lib/date-utils";
import { formatCurrency } from "@/lib/utils";
import { getDashboardSnapshot } from "@/modules/dashboard/queries";

export default async function DashboardPage() {
  const { organization } = await requireDashboardContext();
  const snapshot = await getDashboardSnapshot(organization.id);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-[color:var(--color-border)] bg-[var(--color-surface)] p-8">
        <Badge>Business operating system</Badge>
        <h1 className="mt-4 text-4xl font-semibold">Client, revenue, and booking control</h1>
        <p className="mt-3 max-w-3xl text-[var(--color-muted)]">
          This dashboard now treats bookings as part of the customer relationship and
          the business pipeline, not just calendar occupancy. Your organization runs
          in {organization.timezone}, while all timestamps remain stored in UTC.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardTitle>{formatCurrency(snapshot.bookedRevenueThisMonthAmount)}</CardTitle>
          <CardDescription>Booked revenue this month</CardDescription>
        </Card>
        <Card>
          <CardTitle>{snapshot.totalCustomers}</CardTitle>
          <CardDescription>Total customers</CardDescription>
        </Card>
        <Card>
          <CardTitle>{snapshot.newCustomersThisMonth}</CardTitle>
          <CardDescription>New customers this month</CardDescription>
        </Card>
        <Card>
          <CardTitle>{snapshot.upcomingBookings}</CardTitle>
          <CardDescription>Upcoming bookings</CardDescription>
        </Card>
        <Card>
          <CardTitle>{snapshot.pendingBookings}</CardTitle>
          <CardDescription>Pending confirmations</CardDescription>
        </Card>
        <Card>
          <CardTitle>{formatCurrency(snapshot.averageBookingValueAmount)}</CardTitle>
          <CardDescription>Average booking value</CardDescription>
        </Card>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Top services by booked revenue</CardTitle>
              <CardDescription>
                Revenue uses booking-time price snapshots so service edits do not
                rewrite history.
              </CardDescription>
            </div>
            <Link className="text-sm font-semibold text-[var(--color-brand)]" href="/dashboard/services">
              Manage services
            </Link>
          </div>
          <div className="space-y-3">
            {snapshot.topServices.length ? (
              snapshot.topServices.map((service) => (
                <div
                  className="flex items-center justify-between rounded-2xl border border-[color:var(--color-border)] bg-white p-4"
                  key={service.serviceId}
                >
                  <div>
                    <p className="font-semibold">{service.serviceName}</p>
                    <p className="text-sm text-[var(--color-muted)]">
                      {service.totalBookings} bookings
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatCurrency(service.bookedRevenueAmount)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--color-muted)]">
                Revenue metrics will appear once bookings start coming in.
              </p>
            )}
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Customer mix</CardTitle>
              <CardDescription>
                Lightweight CRM signals for follow-up, retention, and segmentation.
              </CardDescription>
            </div>
            <Link className="text-sm font-semibold text-[var(--color-brand)]" href="/dashboard/customers">
              Open customers
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(snapshot.customerStatusBreakdown).length ? (
              Object.entries(snapshot.customerStatusBreakdown).map(([status, count]) => (
                <div
                  className="rounded-2xl border border-[color:var(--color-border)] bg-white p-4"
                  key={status}
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
                    {status}
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{count}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--color-muted)]">
                Customer status data will appear as soon as records exist.
              </p>
            )}
          </div>
        </Card>
      </div>

      <Card className="space-y-4">
        <CardTitle>Upcoming timeline</CardTitle>
        <CardDescription>
          The booking timeline now sits alongside CRM and revenue insight instead of
          standing alone as the whole product.
        </CardDescription>
        <div className="space-y-3">
          {snapshot.upcomingItems.length ? (
            snapshot.upcomingItems.map((booking) => (
              <div
                className="rounded-2xl border border-[color:var(--color-border)] bg-white p-4"
                key={booking.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{booking.customer_name}</p>
                    <p className="text-sm text-[var(--color-muted)]">
                      {formatUtcInTimeZone(booking.starts_at, organization.timezone)}
                      {" | "}
                      {booking.service_name_snapshot ?? "Service"}
                    </p>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                    {booking.status}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[var(--color-muted)]">
              No upcoming bookings yet. Publish services and availability, then share
              your public URL.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
