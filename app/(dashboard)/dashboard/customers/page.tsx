import Link from "next/link";

import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { requireDashboardContext } from "@/lib/auth";
import { formatCurrency, cn } from "@/lib/utils";
import { listCustomersForOrganization } from "@/modules/customers/queries";

function statusClassName(status: string) {
  if (status === "vip") {
    return "border-amber-200 bg-amber-50/90 text-amber-900";
  }

  if (status === "lead") {
    return "border-sky-200 bg-sky-50/90 text-sky-900";
  }

  if (status === "inactive") {
    return "border-stone-200 bg-stone-100/90 text-stone-700";
  }

  return "border-emerald-200 bg-emerald-50/90 text-emerald-900";
}

export default async function CustomersPage() {
  const { organization } = await requireDashboardContext();
  const customers = await listCustomersForOrganization(organization.id);

  const totalRevenue = customers.reduce(
    (sum, customer) => sum + customer.bookedRevenueAmount,
    0,
  );
  const vipCustomers = customers.filter((customer) => customer.status === "vip").length;
  const activeCustomers = customers.filter((customer) => customer.status === "active").length;
  const customersWithUpcoming = customers.filter(
    (customer) => customer.upcomingBookings > 0,
  ).length;

  return (
    <div className="space-y-6">
      <section className="section-frame relative overflow-hidden rounded-[36px] border border-[color:var(--color-border)] bg-[linear-gradient(150deg,rgba(234,247,207,0.9),rgba(255,255,255,0.82))] px-7 py-8 shadow-[var(--shadow-soft)] md:px-10 md:py-10">
        <div className="ambient-orb absolute right-0 top-2 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(230,253,255,0.92),transparent_72%)]" />
        <div className="ambient-orb absolute bottom-0 left-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(120,100,82,0.12),transparent_72%)]" />
        <div className="relative grid gap-8 xl:grid-cols-[1.1fr,0.9fr]">
          <div className="max-w-3xl">
            <p className="editorial-kicker">Client management</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              See the people behind the schedule, not just the appointments.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--color-muted)] md:text-lg">
              Customers now live as ongoing relationships with status, tags,
              notes, revenue context, and booking history. This is the CRM layer
              that makes the product feel like a business operating system.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Total customers
              </p>
              <CardTitle className="mt-3 text-3xl">{customers.length}</CardTitle>
              <CardDescription className="mt-2">
                Every client relationship in one place.
              </CardDescription>
            </Card>
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                VIP customers
              </p>
              <CardTitle className="mt-3 text-3xl">{vipCustomers}</CardTitle>
              <CardDescription className="mt-2">
                High-value relationships worth extra care.
              </CardDescription>
            </Card>
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Active now
              </p>
              <CardTitle className="mt-3 text-3xl">{activeCustomers}</CardTitle>
              <CardDescription className="mt-2">
                Customers currently marked as active.
              </CardDescription>
            </Card>
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Booked revenue
              </p>
              <CardTitle className="mt-3 text-3xl">
                {formatCurrency(totalRevenue)}
              </CardTitle>
              <CardDescription className="mt-2">
                Based on appointment-time price snapshots.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.82fr,1.18fr]">
        <SpotlightPanel className="p-6 md:p-8">
          <p className="editorial-kicker">Relationship overview</p>
          <CardTitle className="mt-3 text-3xl">Signals that help you follow through.</CardTitle>
          <CardDescription className="mt-3 max-w-xl">
            The point of this screen is not just record-keeping. It helps you spot
            who is returning, who needs follow-up, and where your revenue is coming
            from across the client base.
          </CardDescription>

          <div className="mt-6 grid gap-4">
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Upcoming relationships
              </p>
              <CardTitle className="mt-3 text-2xl">{customersWithUpcoming}</CardTitle>
              <CardDescription className="mt-2">
                Customers with at least one upcoming appointment.
              </CardDescription>
            </Card>
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                CRM posture
              </p>
              <CardDescription className="mt-3">
                Use tags and statuses to distinguish leads, regulars, and premium
                clients without needing a heavyweight CRM system.
              </CardDescription>
            </Card>
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Growth note
              </p>
              <CardDescription className="mt-3">
                This structure can later expand into automations, segmented outreach,
                loyalty tracking, and staff-assigned account ownership.
              </CardDescription>
            </Card>
          </div>
        </SpotlightPanel>

        <div className="space-y-4">
          {customers.length ? (
            customers.map((customer) => (
              <Link
                href={`/dashboard/customers/${customer.public_id}`}
                key={customer.id}
              >
                <SpotlightPanel className="p-6 md:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div className="max-w-3xl space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <CardTitle className="text-[1.45rem]">{customer.full_name}</CardTitle>
                        <span
                          className={cn(
                            "rounded-[16px] border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
                            statusClassName(customer.status),
                          )}
                        >
                          {customer.status}
                        </span>
                      </div>

                      <CardDescription className="max-w-2xl">
                        {customer.email ?? "No email on file"}{" "}
                        <span className="mx-2 text-[var(--color-border-strong)]">/</span>
                        {customer.phone ?? "No phone on file"}
                      </CardDescription>

                      {customer.tags.length ? (
                        <div className="flex flex-wrap gap-2">
                          {customer.tags.map((tag) => (
                            <span
                              className="rounded-[14px] border border-[color:rgba(120,100,82,0.18)] bg-[rgba(230,253,255,0.76)] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-brand-strong)]"
                              key={tag}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-[var(--color-muted)]">
                          No tags yet. Add tags on the profile for segmentation and follow-up.
                        </p>
                      )}
                    </div>

                    <div className="grid min-w-[280px] gap-3 sm:grid-cols-3">
                      <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white/78 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                          Bookings
                        </p>
                        <p className="mt-2 text-xl font-semibold">{customer.totalBookings}</p>
                      </div>
                      <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white/78 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                          Upcoming
                        </p>
                        <p className="mt-2 text-xl font-semibold">{customer.upcomingBookings}</p>
                      </div>
                      <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white/78 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                          Revenue
                        </p>
                        <p className="mt-2 text-xl font-semibold">
                          {formatCurrency(customer.bookedRevenueAmount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </SpotlightPanel>
              </Link>
            ))
          ) : (
            <EmptyState
              description="Customer records will be created automatically from the public booking flow once new appointments start coming in."
              title="No customers yet"
            />
          )}
        </div>
      </div>
    </div>
  );
}
