import Link from "next/link";
import { ArrowRight, CalendarDays, Sparkles, UsersRound } from "lucide-react";

import { BetaLaunchChecklist } from "@/components/dashboard/beta-launch-checklist";
import { DashboardInsightsCharts } from "@/components/dashboard/dashboard-insights-charts";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCard } from "@/components/ui/metric-card";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { requireDashboardContext } from "@/lib/auth";
import { formatUtcInTimeZone } from "@/lib/date-utils";
import { formatCurrency } from "@/lib/utils";
import { getDashboardSnapshot } from "@/modules/dashboard/queries";

export default async function DashboardPage() {
  const { organization } = await requireDashboardContext();
  const snapshot = await getDashboardSnapshot(organization.id);
  const launchChecklist = [
    {
      description: "Add at least one active service so the public booking page can take appointments.",
      done: snapshot.activeServices > 0,
      href: "/dashboard/services",
      label: "Open services",
      title: "Publish a service",
    },
    {
      description: "Set weekly hours, blocked dates, and time off so slots are generated realistically.",
      done: snapshot.upcomingBookings > 0 || snapshot.activeServices > 0,
      href: "/dashboard/availability",
      label: "Set availability",
      title: "Define availability",
    },
    {
      description: "Open the branded booking page and test the public flow before sharing it with anyone.",
      done: Boolean(organization.public_headline || organization.public_description || organization.brand_logo_url),
      href: `/book/${organization.slug}`,
      label: "Preview booking page",
      title: "Review public experience",
    },
    {
      description: "Create one real test booking so bookings, customers, and follow-up flows have live data.",
      done: snapshot.totalCustomers > 0 || snapshot.upcomingBookings > 0 || snapshot.pastBookings > 0,
      href: "/dashboard/bookings",
      label: "Review bookings",
      title: "Make a test booking",
    },
  ] as const;

  return (
    <div className="space-y-6">
      <Reveal>
        <SpotlightPanel className="overflow-hidden p-8 md:p-10">
          <div className="absolute right-[-4rem] top-[-3rem] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(230,253,255,0.85),transparent_68%)]" />
          <div className="absolute bottom-[-4rem] left-[-2rem] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(234,247,207,0.8),transparent_66%)]" />
          <div className="relative grid gap-8 xl:grid-cols-[1.08fr,0.92fr] xl:items-end">
            <div className="space-y-5">
              <p className="editorial-kicker">Business operating system</p>
              <h1 className="text-balance text-4xl leading-tight font-semibold md:text-5xl">
                Client, revenue, and booking control in one calmer workspace.
              </h1>
              <p className="max-w-3xl text-base leading-8 text-[var(--color-muted)] md:text-lg">
                This dashboard treats bookings as part of the customer relationship
                and the business pipeline, not just calendar occupancy. Your
                organization runs in {organization.timezone}, while all timestamps
                remain stored in UTC.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand)]"
                  href="/dashboard/bookings"
                >
                  Review upcoming bookings
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand)]"
                  href="/dashboard/customers"
                >
                  Open customer records
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white/82 p-5">
                <div className="flex items-center gap-3">
                  <CalendarDays className="size-5 text-[var(--color-brand)]" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-brand-strong)]">
                      Upcoming bookings
                    </p>
                    <p className="text-sm text-[var(--color-muted)]">
                      {snapshot.upcomingBookings} currently on the calendar
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white/82 p-5">
                <div className="flex items-center gap-3">
                  <UsersRound className="size-5 text-[var(--color-brand)]" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-brand-strong)]">
                      Customer base
                    </p>
                    <p className="text-sm text-[var(--color-muted)]">
                      {snapshot.totalCustomers} profiles with relationship context
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white/82 p-5">
                <div className="flex items-center gap-3">
                  <Sparkles className="size-5 text-[var(--color-brand)]" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-brand-strong)]">
                      Needs review
                    </p>
                    <p className="text-sm text-[var(--color-muted)]">
                      {snapshot.pendingBookings} pending confirmations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SpotlightPanel>
      </Reveal>

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

      <Reveal delay={20}>
        <BetaLaunchChecklist items={launchChecklist.map((item) => ({ ...item }))} />
      </Reveal>

      <Reveal delay={40}>
        <DashboardInsightsCharts
          customerStatusSeries={snapshot.customerStatusSeries}
          monthlyRevenueSeries={snapshot.monthlyRevenueSeries}
        />
      </Reveal>

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Reveal>
          <Card className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Top services by booked revenue</CardTitle>
                <CardDescription>
                  Revenue uses booking-time price snapshots so service edits do not
                  rewrite history.
                </CardDescription>
              </div>
              <Link
                className="text-sm font-semibold text-[var(--color-brand)]"
                href="/dashboard/services"
              >
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
        </Reveal>

        <Reveal delay={80}>
          <Card className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Customer mix</CardTitle>
                <CardDescription>
                  Lightweight CRM signals for follow-up, retention, and segmentation.
                </CardDescription>
              </div>
              <Link
                className="text-sm font-semibold text-[var(--color-brand)]"
                href="/dashboard/customers"
              >
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
        </Reveal>
      </div>

      <Reveal delay={120}>
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
      </Reveal>
    </div>
  );
}
