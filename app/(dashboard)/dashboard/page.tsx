import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, ScissorsLineDashed } from "lucide-react";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCard } from "@/components/ui/metric-card";
import { Reveal } from "@/components/ui/reveal";
import { requireDashboardContext } from "@/lib/auth";
import { formatUtcInTimeZone } from "@/lib/date-utils";
import { getDashboardSnapshot } from "@/modules/dashboard/queries";

export default async function DashboardPage() {
  const { organization } = await requireDashboardContext();
  const snapshot = await getDashboardSnapshot(organization.id);

  const setupSteps = [
    {
      description: "Add the services you want available for booking.",
      href: "/dashboard/services",
      icon: ScissorsLineDashed,
      title: "1. Set your services",
    },
    {
      description: "Choose which days and hours you are available.",
      href: "/dashboard/availability",
      icon: Clock3,
      title: "2. Set your hours",
    },
    {
      description: "Open your booking page and test the full flow.",
      href: `/book/${organization.slug}`,
      icon: CalendarDays,
      title: "3. Check your booking page",
    },
  ] as const;

  return (
    <div className="space-y-6">
      <Reveal>
        <Card className="p-8 md:p-10">
          <div className="grid gap-8 xl:grid-cols-[1.08fr,0.92fr] xl:items-start">
            <div className="space-y-5">
              <p className="editorial-kicker">Simple daily overview</p>
              <h1 className="text-balance text-4xl leading-tight font-semibold md:text-5xl">
                Keep your booking setup easy to understand.
              </h1>
              <p className="max-w-3xl text-base leading-8 text-[var(--color-muted)] md:text-lg">
                This dashboard focuses on the essentials: the services you offer,
                the hours you work, and the appointments on your calendar.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand)]"
                  href="/dashboard/services"
                >
                  Edit services
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand)]"
                  href="/dashboard/bookings"
                >
                  Open calendar
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[24px] border border-[color:var(--color-border)] bg-[var(--background-soft)]/35 p-5">
                <p className="text-sm font-semibold text-[var(--color-brand-strong)]">
                  Booking page
                </p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  Share this link when you are ready.
                </p>
                <Link
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand)]"
                  href={`/book/${organization.slug}`}
                  target="_blank"
                >
                  Open booking page
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </Reveal>

      <section className="grid gap-4 md:grid-cols-1 xl:grid-cols-3">
        <MetricCard
          description="Services shown on your booking page"
          label="Active services"
          value={snapshot.activeServices}
        />
        <MetricCard
          description="Appointments still ahead"
          label="Upcoming bookings"
          value={snapshot.upcomingBookings}
        />
        <MetricCard
          description="Bookings waiting for you"
          label="Pending bookings"
          value={snapshot.pendingBookings}
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <Reveal>
          <Card className="space-y-4">
            <CardTitle>Start here</CardTitle>
            <CardDescription>
              If this is your first time in the app, these are the only things you need to do.
            </CardDescription>

            <div className="grid gap-3">
              {setupSteps.map(({ description, href, icon: Icon, title }) => (
                <Link
                  className="rounded-[24px] border border-[color:var(--color-border)] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
                  href={href}
                  key={title}
                  target={href.startsWith("/book/") ? "_blank" : undefined}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 items-center justify-center rounded-[18px] border border-[color:var(--color-border)] bg-[var(--background-alt)]/72 text-[var(--color-brand)]">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--color-ink)]">{title}</p>
                      <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                        {description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </Reveal>

        <Reveal delay={80}>
          <Card className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Next bookings</CardTitle>
                <CardDescription>
                  A simple list of the next appointments on your calendar.
                </CardDescription>
              </div>
              <Link
                className="text-sm font-semibold text-[var(--color-brand)]"
                href="/dashboard/bookings"
              >
                Open calendar
              </Link>
            </div>

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
                          {booking.service_name_snapshot ?? "Service"}
                        </p>
                        <p className="mt-1 text-sm text-[var(--color-muted)]">
                          {formatUtcInTimeZone(booking.starts_at, organization.timezone)}
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
                  description="When bookings start coming in, the next appointments will show here."
                  title="No bookings yet"
                />
              )}
            </div>
          </Card>
        </Reveal>
      </div>

      <Reveal delay={120}>
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Keep it simple</CardTitle>
              <CardDescription>
                Most owners only need these three areas from day to day.
              </CardDescription>
            </div>
            <Link
              className="text-sm font-semibold text-[var(--color-brand)]"
              href="/dashboard/settings"
            >
              Open business settings
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-3">
            <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white p-5">
              <p className="font-semibold text-[var(--color-ink)]">Services</p>
              <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                Add what people can book, how long it takes, and what it costs.
              </p>
            </div>
            <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white p-5">
              <p className="font-semibold text-[var(--color-ink)]">Hours</p>
              <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                Choose the days and times you are available, plus any days off.
              </p>
            </div>
            <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white p-5">
              <p className="font-semibold text-[var(--color-ink)]">Calendar</p>
              <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                Check new bookings, confirm them, or cancel them when needed.
              </p>
            </div>
          </div>
        </Card>
      </Reveal>
    </div>
  );
}
