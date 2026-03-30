import { notFound } from "next/navigation";

import { SubmitButton } from "@/components/forms/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireDashboardContext } from "@/lib/auth";
import { CUSTOMER_STATUS_OPTIONS } from "@/lib/constants";
import { formatUtcInTimeZone } from "@/lib/date-utils";
import { formatCurrency } from "@/lib/utils";
import { updateCustomerProfileAction } from "@/modules/customers/actions";
import { getCustomerProfile } from "@/modules/customers/queries";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;
  const { organization } = await requireDashboardContext();
  const profile = await getCustomerProfile(organization.id, customerId);

  if (!profile) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <Badge>Customer profile</Badge>
        <CardTitle>{profile.customer.full_name}</CardTitle>
        <CardDescription>
          One place for relationship context, profile hygiene, and booking history.
        </CardDescription>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardTitle>{profile.metrics.totalBookings}</CardTitle>
          <CardDescription>Total bookings</CardDescription>
        </Card>
        <Card>
          <CardTitle>{profile.metrics.upcomingBookings}</CardTitle>
          <CardDescription>Upcoming bookings</CardDescription>
        </Card>
        <Card>
          <CardTitle>{profile.metrics.completedBookings}</CardTitle>
          <CardDescription>Completed bookings</CardDescription>
        </Card>
        <Card>
          <CardTitle>{formatCurrency(profile.metrics.bookedRevenueAmount)}</CardTitle>
          <CardDescription>Booked revenue</CardDescription>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
        <Card>
          <form action={updateCustomerProfileAction} className="space-y-4">
            <input name="customerId" type="hidden" value={profile.customer.id} />
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" required defaultValue={profile.customer.full_name} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={profile.customer.email ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" defaultValue={profile.customer.phone ?? ""} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                className="h-11 w-full rounded-2xl border border-[color:var(--color-border)] bg-white px-4 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-brand)]"
                defaultValue={profile.customer.status}
                id="status"
                name="status"
              >
                {CUSTOMER_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                defaultValue={profile.customer.tags.join(", ")}
                placeholder="vip, referral, recurring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Customer notes</Label>
              <Textarea
                id="notes"
                name="notes"
                defaultValue={profile.customer.notes ?? ""}
                placeholder="Shared context or remembered preferences..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="internalNotes">Internal notes</Label>
              <Textarea
                id="internalNotes"
                name="internalNotes"
                defaultValue={profile.customer.internal_notes ?? ""}
                placeholder="Private operational notes for the business..."
              />
            </div>
            <SubmitButton pendingLabel="Saving customer...">Save customer profile</SubmitButton>
          </form>
        </Card>

        <Card className="space-y-4">
          <CardTitle>Booking history</CardTitle>
          <CardDescription>
            Historical bookings make this feel like client ops software, not just
            a booking widget.
          </CardDescription>
          <div className="space-y-3">
            {profile.bookingHistory.length ? (
              profile.bookingHistory.map((booking) => (
                <div
                  className="rounded-2xl border border-[color:var(--color-border)] bg-white p-4"
                  key={booking.id}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        {booking.service_name_snapshot ??
                          booking.services?.name ??
                          "Service"}
                      </p>
                      <p className="text-sm text-[var(--color-muted)]">
                        {formatUtcInTimeZone(booking.starts_at, organization.timezone)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                        {booking.status}
                      </p>
                      <p className="mt-1 text-sm">
                        {formatCurrency(
                          booking.service_price_amount,
                          booking.service_currency,
                        )}
                      </p>
                    </div>
                  </div>
                  {booking.customer_notes ? (
                    <p className="mt-3 text-sm text-[var(--color-muted)]">
                      {booking.customer_notes}
                    </p>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--color-muted)]">
                No bookings recorded for this customer yet.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
