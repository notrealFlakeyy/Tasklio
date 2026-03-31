import Link from "next/link";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCard } from "@/components/ui/metric-card";
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
        <p className="editorial-kicker">Business operating system</p>
        <h1 className="mt-4 text-4xl font-semibold">Client, revenue, and booking control</h1>
        <p className="mt-3 max-w-3xl text-[var(--color-muted)]">
          This dashboard now treats bookings as part of the customer relationship and
          the business pipeline, not just calendar occupancy. Your organization runs
          in {organization.timezone}, while all timestamps remain stored in UTC.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          description="Booked revenue this month"
          label="Monthly revenue"
          value={formatCurrency(snapshot.bookedRevenueThisMonthAmount)}
        />
        <MetricCard
          description="Total customers"
          label="Customer base"
          value={snapshot.totalCustomers}
        />
        <MetricCard
          description="New customers this month"
          label="New relationships"
          value={snapshot.newCustomersThisMonth}
        />
        <MetricCard
          description="Upcoming bookings"
          label="Upcoming"
          value={snapshot.upcomingBookings}
        />
        <MetricCard
          description="Pending confirmations"
          label="Needs review"
          value={snapshot.pendingBookings}
        />
        <MetricCard
          description="Average booking value"
          label="Average value"
          value={formatCurrency(snapshot.averageBookingValueAmount)}
        />
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
              <EmptyState
                description="Revenue metrics will appear once bookings start coming in."
                title="No service revenue yet"
              />
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
              <EmptyState
                description="Customer status data will appear as soon as records exist."
                title="No customer segments yet"
              />
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
            <EmptyState
              description="Publish services and availability, then share your public URL."
              title="No upcoming bookings yet"
            />
          )}
        </div>
      </Card>
    </div>
  );
}
