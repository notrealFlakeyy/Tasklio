import { ActionForm } from "@/components/forms/action-form";
import { DestructiveActionDialog } from "@/components/forms/destructive-action-dialog";
import { FieldError } from "@/components/forms/field-error";
import { FormNotice } from "@/components/forms/form-notice";
import { SubmitButton } from "@/components/forms/submit-button";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Textarea } from "@/components/ui/textarea";
import { requireDashboardContext } from "@/lib/auth";
import { formatUtcInTimeZone } from "@/lib/date-utils";
import { formatCurrency } from "@/lib/utils";
import {
  cancelBookingAction,
  confirmBookingAction,
  updateBookingNotesAction,
} from "@/modules/bookings/actions";
import { listBookingsForDashboard } from "@/modules/bookings/queries";

function statusTone(status: string) {
  if (status === "confirmed") {
    return "border-emerald-200 bg-emerald-50/80 text-emerald-900";
  }

  if (status === "pending") {
    return "border-amber-200 bg-amber-50/80 text-amber-900";
  }

  if (status === "cancelled") {
    return "border-stone-200 bg-stone-100/90 text-stone-700";
  }

  return "border-[color:var(--color-border)] bg-white/80 text-[var(--color-ink)]";
}

export default async function BookingsPage() {
  const { organization } = await requireDashboardContext();
  const bookings = await listBookingsForDashboard(organization.id);

  const upcomingBookings = bookings.filter(
    (booking) => booking.status === "pending" || booking.status === "confirmed",
  );
  const pendingBookings = bookings.filter((booking) => booking.status === "pending");
  const bookedRevenue = bookings
    .filter((booking) => booking.status !== "cancelled")
    .reduce((sum, booking) => sum + booking.service_price_amount, 0);
  const completedBookings = bookings.filter((booking) => booking.status === "completed");

  return (
    <div className="space-y-6">
      <section className="section-frame relative overflow-hidden rounded-[36px] border border-[color:var(--color-border)] bg-[linear-gradient(150deg,rgba(230,253,255,0.9),rgba(255,255,255,0.82))] px-7 py-8 shadow-[var(--shadow-soft)] md:px-10 md:py-10">
        <div className="ambient-orb absolute right-0 top-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(234,247,207,0.9),transparent_72%)]" />
        <div className="ambient-orb absolute bottom-0 left-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(120,100,82,0.12),transparent_70%)]" />
        <div className="relative grid gap-8 xl:grid-cols-[1.05fr,0.95fr]">
          <div className="max-w-3xl">
            <p className="editorial-kicker">Calendar</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              See what is booked and what still needs your attention.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--color-muted)] md:text-lg">
              Keep the day-to-day simple. Confirm new bookings, cancel when needed,
              and keep a few private notes for yourself.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Total bookings
              </p>
              <CardTitle className="mt-3 text-3xl">{bookings.length}</CardTitle>
              <CardDescription className="mt-2">
                Everything booked so far.
              </CardDescription>
            </Card>
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Upcoming
              </p>
              <CardTitle className="mt-3 text-3xl">{upcomingBookings.length}</CardTitle>
              <CardDescription className="mt-2">
                Appointments still ahead.
              </CardDescription>
            </Card>
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Pending review
              </p>
              <CardTitle className="mt-3 text-3xl">{pendingBookings.length}</CardTitle>
              <CardDescription className="mt-2">
                Waiting for your confirmation.
              </CardDescription>
            </Card>
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Done
              </p>
              <CardTitle className="mt-3 text-3xl">{completedBookings.length}</CardTitle>
              <CardDescription className="mt-2">
                Completed appointments.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.8fr,1.2fr]">
        <SpotlightPanel className="p-6 md:p-8">
          <p className="editorial-kicker">Simple overview</p>
          <CardTitle className="mt-3 text-3xl">What to check today</CardTitle>
          <CardDescription className="mt-3 max-w-xl">
            Most days, you only need to look at new bookings, your next appointments,
            and your local timezone.
          </CardDescription>

          <div className="mt-6 grid gap-4">
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Completed bookings
              </p>
              <CardTitle className="mt-3 text-2xl">{completedBookings.length}</CardTitle>
              <CardDescription className="mt-2">
                Appointments already completed.
              </CardDescription>
            </Card>
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Timezone
              </p>
              <CardTitle className="mt-3 text-2xl">{organization.timezone}</CardTitle>
              <CardDescription className="mt-2">
                All appointments are shown in your local business time.
              </CardDescription>
            </Card>
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Booked value
              </p>
              <CardTitle className="mt-3 text-2xl">{formatCurrency(bookedRevenue)}</CardTitle>
              <CardDescription className="mt-2">
                Total value of all bookings except cancelled ones.
              </CardDescription>
            </Card>
          </div>
        </SpotlightPanel>

        <div className="space-y-4">
          {bookings.length ? (
            bookings.map((booking) => {
              const serviceName =
                booking.service_name_snapshot ??
                (typeof booking.services === "object" &&
                booking.services &&
                "name" in booking.services
                  ? String(booking.services.name)
                  : "Service");

              return (
                <SpotlightPanel className="p-6 md:p-7" key={booking.id}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <CardTitle className="text-[1.45rem]">
                          {booking.customer_name}
                        </CardTitle>
                        <span
                          className={`rounded-[16px] border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusTone(booking.status)}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white/78 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                            Service
                          </p>
                          <p className="mt-2 font-semibold text-[var(--color-ink)]">
                            {serviceName}
                          </p>
                        </div>
                        <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white/78 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                            Starts
                          </p>
                          <p className="mt-2 font-semibold text-[var(--color-ink)]">
                            {formatUtcInTimeZone(booking.starts_at, organization.timezone)}
                          </p>
                        </div>
                        <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white/78 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                            Value
                          </p>
                          <p className="mt-2 font-semibold text-[var(--color-ink)]">
                            {formatCurrency(
                              booking.service_price_amount,
                              booking.service_currency,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {booking.status === "pending" ? (
                        <ActionForm action={confirmBookingAction}>
                          <input name="bookingId" type="hidden" value={booking.id} />
                          <Button type="submit">Confirm</Button>
                        </ActionForm>
                      ) : null}
                      {booking.status !== "cancelled" ? (
                        <DestructiveActionDialog
                          action={cancelBookingAction}
                          confirmLabel="Cancel booking"
                          description="This booking will be marked as cancelled and removed from the active schedule. Use this when the appointment is truly no longer happening."
                          fieldName="bookingId"
                          fieldValue={booking.id}
                          pendingLabel="Cancelling..."
                          title={`Cancel ${booking.customer_name}'s booking?`}
                          triggerLabel="Cancel"
                        />
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-5 lg:grid-cols-[0.92fr,1.08fr]">
                    <div className="rounded-[28px] border border-[color:var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(255,255,255,0.7))] p-5">
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                        Booking details
                      </p>
                      <div className="mt-4 space-y-2 text-sm leading-7 text-[var(--color-muted)]">
                        <p>{booking.customer_email ?? "No email provided"}</p>
                        <p>{booking.customer_phone ?? "No phone provided"}</p>
                        <p className="pt-2 text-[var(--color-ink)]">
                          {booking.customer_notes ?? "No notes added with this booking."}
                        </p>
                      </div>
                    </div>

                    <ActionForm action={updateBookingNotesAction} className="space-y-3">
                      <input name="bookingId" type="hidden" value={booking.id} />
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                            Internal notes
                          </p>
                          <p className="mt-2 text-sm text-[var(--color-muted)]">
                            Private notes for yourself.
                          </p>
                        </div>
                      </div>
                      <Textarea
                        name="internalNotes"
                        defaultValue={booking.internal_notes ?? ""}
                        placeholder="Anything you want to remember about this booking"
                      />
                      <FieldError name="internalNotes" />
                      <FormNotice successLabel="Saved." />
                      <SubmitButton pendingLabel="Saving notes..." variant="secondary">
                        Save notes
                      </SubmitButton>
                    </ActionForm>
                  </div>
                </SpotlightPanel>
              );
            })
          ) : (
            <EmptyState
              description="Once bookings start coming in, appointments will show here."
              title="No bookings yet"
            />
          )}
        </div>
      </div>
    </div>
  );
}
