import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { requireDashboardContext } from "@/lib/auth";
import { formatCurrency, cn } from "@/lib/utils";
import { listCustomersForOrganization } from "@/modules/customers/queries";

function statusClassName(status: string) {
  if (status === "vip") {
    return "bg-amber-100 text-amber-900";
  }

  if (status === "lead") {
    return "bg-sky-100 text-sky-900";
  }

  if (status === "inactive") {
    return "bg-zinc-200 text-zinc-700";
  }

  return "bg-emerald-100 text-emerald-900";
}

export default async function CustomersPage() {
  const { organization } = await requireDashboardContext();
  const customers = await listCustomersForOrganization(organization.id);

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <Badge>Client management</Badge>
        <CardTitle>Customers</CardTitle>
        <CardDescription>
          Treat customers as ongoing relationships, not one-off form submissions.
          Status, tags, notes, and booking history now live in one place.
        </CardDescription>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardTitle>{customers.length}</CardTitle>
          <CardDescription>Total customer records</CardDescription>
        </Card>
        <Card>
          <CardTitle>{customers.filter((customer) => customer.status === "vip").length}</CardTitle>
          <CardDescription>VIP customers</CardDescription>
        </Card>
        <Card>
          <CardTitle>
            {formatCurrency(
              customers.reduce(
                (sum, customer) => sum + customer.bookedRevenueAmount,
                0,
              ),
            )}
          </CardTitle>
          <CardDescription>Booked revenue across customers</CardDescription>
        </Card>
      </div>

      <div className="space-y-4">
        {customers.length ? (
          customers.map((customer) => (
            <Link href={`/dashboard/customers/${customer.id}`} key={customer.id}>
              <Card className="transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle>{customer.full_name}</CardTitle>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
                          statusClassName(customer.status),
                        )}
                      >
                        {customer.status}
                      </span>
                    </div>
                    <CardDescription>
                      {customer.email ?? "No email"} | {customer.phone ?? "No phone"}
                    </CardDescription>
                    {customer.tags.length ? (
                      <div className="flex flex-wrap gap-2">
                        {customer.tags.map((tag) => (
                          <span
                            className="rounded-full bg-[var(--color-brand-soft)] px-3 py-1 text-xs font-medium text-[var(--color-brand-strong)]"
                            key={tag}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="grid min-w-[260px] gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
                        Bookings
                      </p>
                      <p className="mt-2 text-xl font-semibold">
                        {customer.totalBookings}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
                        Upcoming
                      </p>
                      <p className="mt-2 text-xl font-semibold">
                        {customer.upcomingBookings}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
                        Revenue
                      </p>
                      <p className="mt-2 text-xl font-semibold">
                        {formatCurrency(customer.bookedRevenueAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <Card>
            <CardTitle>No customers yet</CardTitle>
            <CardDescription>
              Customers will be created automatically from the public booking flow.
            </CardDescription>
          </Card>
        )}
      </div>
    </div>
  );
}
