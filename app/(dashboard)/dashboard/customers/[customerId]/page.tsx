import Link from "next/link";
import { notFound } from "next/navigation";

import { ActionForm } from "@/components/forms/action-form";
import { FieldError } from "@/components/forms/field-error";
import { FormNotice } from "@/components/forms/form-notice";
import { SubmitButton } from "@/components/forms/submit-button";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { requireDashboardContext } from "@/lib/auth";
import { CUSTOMER_STATUS_OPTIONS } from "@/lib/constants";
import { formatUtcInTimeZone } from "@/lib/date-utils";
import { formatCurrency, cn } from "@/lib/utils";
import { updateCustomerProfileAction } from "@/modules/customers/actions";
import { getCustomerProfile } from "@/modules/customers/queries";

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
      <section className="section-frame relative overflow-hidden rounded-[36px] border border-[color:var(--color-border)] bg-[linear-gradient(150deg,rgba(230,253,255,0.88),rgba(255,255,255,0.82))] px-7 py-8 shadow-[var(--shadow-soft)] md:px-10 md:py-10">
        <div className="ambient-orb absolute right-2 top-4 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(234,247,207,0.92),transparent_72%)]" />
        <div className="ambient-orb absolute bottom-0 left-6 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(120,100,82,0.12),transparent_72%)]" />
        <div className="relative grid gap-8 xl:grid-cols-[1.12fr,0.88fr]">
          <div className="max-w-3xl">
            <p className="editorial-kicker">Customer profile</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                {profile.customer.full_name}
              </h1>
              <span
                className={cn(
                  "rounded-[16px] border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
                  statusClassName(profile.customer.status),
                )}
              >
                {profile.customer.status}
              </span>
            </div>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--color-muted)] md:text-lg">
              One place for relationship context, profile hygiene, notes, and booking
              history. This is where a customer stops being a form submission and
              becomes part of the ongoing business.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/dashboard/customers">
                <Button variant="secondary">Back to customers</Button>
              </Link>
              <Link href="/dashboard/bookings">
                <Button variant="ghost">Open booking operations</Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Total bookings
              </p>
              <CardTitle className="mt-3 text-3xl">{profile.metrics.totalBookings}</CardTitle>
              <CardDescription className="mt-2">
                Every recorded appointment for this customer.
              </CardDescription>
            </Card>
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Upcoming
              </p>
              <CardTitle className="mt-3 text-3xl">
                {profile.metrics.upcomingBookings}
              </CardTitle>
              <CardDescription className="mt-2">
                Future appointments already on the calendar.
              </CardDescription>
            </Card>
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Completed
              </p>
              <CardTitle className="mt-3 text-3xl">
                {profile.metrics.completedBookings}
              </CardTitle>
              <CardDescription className="mt-2">
                Sessions already delivered.
              </CardDescription>
            </Card>
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Booked revenue
              </p>
              <CardTitle className="mt-3 text-3xl">
                {formatCurrency(profile.metrics.bookedRevenueAmount)}
              </CardTitle>
              <CardDescription className="mt-2">
                Based on historical booking snapshots.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.92fr,1.08fr]">
        <SpotlightPanel className="p-6 md:p-8">
          <ActionForm action={updateCustomerProfileAction} className="space-y-6">
            <input name="customerId" type="hidden" value={profile.customer.id} />

            <div>
              <p className="editorial-kicker">Relationship data</p>
              <CardTitle className="mt-3 text-3xl">Edit the client record with confidence.</CardTitle>
              <CardDescription className="mt-3 max-w-2xl">
                Keep contact details, tags, notes, and status current so the rest of
                the business can act on a clean customer profile.
              </CardDescription>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[28px] border border-[color:var(--color-border)] bg-white/80 p-5 md:col-span-2">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Contact profile
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      required
                      defaultValue={profile.customer.full_name}
                    />
                    <FieldError name="fullName" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={profile.customer.email ?? ""}
                    />
                    <FieldError name="email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      defaultValue={profile.customer.phone ?? ""}
                    />
                    <FieldError name="phone" />
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-[color:var(--color-border)] bg-white/80 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Lifecycle
                </p>
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      defaultValue={profile.customer.status}
                      id="status"
                      name="status"
                    >
                      {CUSTOMER_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                    <FieldError name="status" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      name="tags"
                      defaultValue={profile.customer.tags.join(", ")}
                      placeholder="vip, referral, recurring"
                    />
                    <FieldError name="tags" />
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-[color:var(--color-border)] bg-white/80 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Notes
                </p>
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notes">Customer notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      defaultValue={profile.customer.notes ?? ""}
                      placeholder="Shared context or remembered preferences..."
                    />
                    <FieldError name="notes" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="internalNotes">Internal notes</Label>
                    <Textarea
                      id="internalNotes"
                      name="internalNotes"
                      defaultValue={profile.customer.internal_notes ?? ""}
                      placeholder="Private operational notes for the business..."
                    />
                    <FieldError name="internalNotes" />
                  </div>
                </div>
              </div>
            </div>

            <FormNotice successLabel="Saved." />
            <div className="flex justify-end">
              <SubmitButton pendingLabel="Saving customer...">Save customer profile</SubmitButton>
            </div>
          </ActionForm>
        </SpotlightPanel>

        <div className="space-y-6">
          <SpotlightPanel className="p-6 md:p-8">
            <p className="editorial-kicker">Profile signals</p>
            <CardTitle className="mt-3 text-3xl">Quick relationship context</CardTitle>
            <CardDescription className="mt-3 max-w-xl">
              These small signals make the profile easier to act on during a busy day
              without needing to scan the entire history every time.
            </CardDescription>

            <div className="mt-6 grid gap-4">
              <Card className="bg-white/74">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Contactability
                </p>
                <CardDescription className="mt-3">
                  {profile.customer.email ?? "No email on file"}{" "}
                  <span className="mx-2 text-[var(--color-border-strong)]">/</span>
                  {profile.customer.phone ?? "No phone on file"}
                </CardDescription>
              </Card>
              <Card className="bg-white/74">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Tags
                </p>
                {profile.customer.tags.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.customer.tags.map((tag) => (
                      <span
                        className="rounded-[14px] border border-[color:rgba(120,100,82,0.18)] bg-[rgba(230,253,255,0.76)] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-brand-strong)]"
                        key={tag}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <CardDescription className="mt-3">
                    No tags yet. Add a few to make segmentation and follow-up easier.
                  </CardDescription>
                )}
              </Card>
            </div>
          </SpotlightPanel>

          <SpotlightPanel className="p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="editorial-kicker">Timeline</p>
                <CardTitle className="mt-3 text-3xl">Booking history</CardTitle>
                <CardDescription className="mt-3 max-w-xl">
                  Historical bookings make this feel like client operations software,
                  not just a booking widget.
                </CardDescription>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {profile.bookingHistory.length ? (
                profile.bookingHistory.map((booking) => (
                  <div
                    className="rounded-[28px] border border-[color:var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,255,255,0.72))] p-5"
                    key={booking.id}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-2">
                        <p className="font-semibold text-[var(--color-ink)]">
                          {booking.service_name_snapshot ??
                            booking.services?.name ??
                            "Service"}
                        </p>
                        <p className="text-sm text-[var(--color-muted)]">
                          {formatUtcInTimeZone(booking.starts_at, organization.timezone)}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p
                          className={cn(
                            "inline-flex rounded-[14px] border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
                            statusClassName(booking.status),
                          )}
                        >
                          {booking.status}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">
                          {formatCurrency(
                            booking.service_price_amount,
                            booking.service_currency,
                          )}
                        </p>
                      </div>
                    </div>
                    {booking.customer_notes ? (
                      <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                        {booking.customer_notes}
                      </p>
                    ) : null}
                  </div>
                ))
              ) : (
                <EmptyState
                  className="bg-white/74"
                  description="Once this customer books, their history will build here automatically."
                  title="No bookings recorded yet"
                />
              )}
            </div>
          </SpotlightPanel>
        </div>
      </div>
    </div>
  );
}
