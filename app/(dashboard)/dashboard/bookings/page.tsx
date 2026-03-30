import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { requireDashboardContext } from "@/lib/auth";
import { formatUtcInTimeZone } from "@/lib/date-utils";
import {
  cancelBookingAction,
  confirmBookingAction,
  updateBookingNotesAction,
} from "@/modules/bookings/actions";
import { listBookingsForDashboard } from "@/modules/bookings/queries";

export default async function BookingsPage() {
  const { organization } = await requireDashboardContext();
  const bookings = await listBookingsForDashboard(organization.id);

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <CardTitle>Bookings</CardTitle>
        <CardDescription>
          Confirmation and cancellation remain explicit owner actions. The overlap
          rule is enforced at the database layer, not just in UI.
        </CardDescription>
      </Card>

      <div className="space-y-4">
        {bookings.length ? (
          bookings.map((booking) => (
            <Card className="space-y-4" key={booking.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{booking.customer_name}</CardTitle>
                  <CardDescription>
                    {formatUtcInTimeZone(booking.starts_at, organization.timezone)}
                    {" · "}
                    {typeof booking.services === "object" &&
                    booking.services &&
                    "name" in booking.services
                      ? String(booking.services.name)
                      : "Service"}
                    {" · "}
                    {booking.status}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {booking.status === "pending" ? (
                    <form action={confirmBookingAction}>
                      <input name="bookingId" type="hidden" value={booking.id} />
                      <Button type="submit">Confirm</Button>
                    </form>
                  ) : null}
                  {booking.status !== "cancelled" ? (
                    <form action={cancelBookingAction}>
                      <input name="bookingId" type="hidden" value={booking.id} />
                      <Button type="submit" variant="danger">
                        Cancel
                      </Button>
                    </form>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-4 text-sm">
                  <p className="font-medium">Customer details</p>
                  <p className="mt-2 text-[var(--color-muted)]">{booking.customer_email}</p>
                  <p className="text-[var(--color-muted)]">{booking.customer_phone}</p>
                  <p className="mt-3 whitespace-pre-wrap text-[var(--color-muted)]">
                    {booking.customer_notes ?? "No customer notes."}
                  </p>
                </div>

                <form action={updateBookingNotesAction} className="space-y-3">
                  <input name="bookingId" type="hidden" value={booking.id} />
                  <p className="text-sm font-medium text-[var(--color-ink)]">
                    Internal notes
                  </p>
                  <Textarea
                    name="internalNotes"
                    defaultValue={booking.internal_notes ?? ""}
                    placeholder="Internal context, follow-up, preparation notes..."
                  />
                  <SubmitButton pendingLabel="Saving notes..." variant="secondary">
                    Save notes
                  </SubmitButton>
                </form>
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <CardTitle>No bookings yet</CardTitle>
            <CardDescription>
              Once the public booking page is live, customer bookings will appear here.
            </CardDescription>
          </Card>
        )}
      </div>
    </div>
  );
}
