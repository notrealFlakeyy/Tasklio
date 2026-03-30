"use client";

import { startTransition, useEffect, useEffectEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import type { Tables } from "@/lib/database.types";

type ServiceOption = Pick<
  Tables<"services">,
  | "buffer_minutes"
  | "currency"
  | "duration_minutes"
  | "id"
  | "name"
  | "price_amount"
>;

type Slot = {
  endsAt: string;
  label: string;
  startsAt: string;
};

type PublicBookingWidgetProps = {
  defaultDate: string;
  organizationName: string;
  organizationSlug: string;
  services: ServiceOption[];
  timezone: string;
};

export function PublicBookingWidget({
  defaultDate,
  organizationName,
  organizationSlug,
  services,
  timezone,
}: PublicBookingWidgetProps) {
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id ?? "");
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedService = services.find((service) => service.id === selectedServiceId);

  const loadSlots = useEffectEvent(async () => {
    if (!selectedServiceId || !selectedDate) {
      setSlots([]);
      setSelectedSlot("");
      return;
    }

    setIsLoadingSlots(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/public/organizations/${organizationSlug}/slots?serviceId=${selectedServiceId}&date=${selectedDate}`,
        { cache: "no-store" },
      );
      const payload = (await response.json()) as { message?: string; slots?: Slot[] };

      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to load time slots.");
      }

      setSlots(payload.slots ?? []);
      setSelectedSlot("");
    } catch (slotError) {
      setSlots([]);
      setSelectedSlot("");
      setError(
        slotError instanceof Error
          ? slotError.message
          : "Unable to load booking slots.",
      );
    } finally {
      setIsLoadingSlots(false);
    }
  });

  useEffect(() => {
    startTransition(() => {
      void loadSlots();
    });
  }, [selectedDate, selectedServiceId, loadSlots]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedSlot) {
      setError("Please choose a time.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/public/bookings", {
        body: JSON.stringify({
          customerEmail: formData.get("customerEmail"),
          customerName: formData.get("customerName"),
          customerNotes: formData.get("customerNotes") || null,
          customerPhone: formData.get("customerPhone") || null,
          organizationSlug,
          serviceId: selectedServiceId,
          startsAt: selectedSlot,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "Booking failed.");
      }

      setSuccess("Booking created. Check the dashboard to confirm or cancel it.");
      event.currentTarget.reset();
      setSelectedSlot("");
      await loadSlots();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Booking failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!services.length) {
    return (
      <Card>
        <CardTitle>No services published yet</CardTitle>
        <CardDescription>
          This business has not activated any bookable services.
        </CardDescription>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
      <Card className="space-y-5">
        <div>
          <CardTitle>{organizationName}</CardTitle>
          <CardDescription>
            Pick a service and a time in {timezone}. All booking timestamps are
            stored in UTC behind the scenes.
          </CardDescription>
        </div>

        <div className="space-y-2">
          <Label htmlFor="service">Service</Label>
          <select
            className="h-11 w-full rounded-2xl border border-[color:var(--color-border)] bg-white px-4 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-brand)]"
            id="service"
            onChange={(event) => setSelectedServiceId(event.target.value)}
            value={selectedServiceId}
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} · {service.duration_minutes} min ·{" "}
                {formatCurrency(service.price_amount, service.currency)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            min={defaultDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            type="date"
            value={selectedDate}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Available times</Label>
            {selectedService ? (
              <span className="text-xs text-[var(--color-muted)]">
                Includes {selectedService.buffer_minutes} min buffer
              </span>
            ) : null}
          </div>

          {isLoadingSlots ? (
            <p className="text-sm text-[var(--color-muted)]">Loading slots...</p>
          ) : slots.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {slots.map((slot) => (
                <button
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    selectedSlot === slot.startsAt
                      ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-white"
                      : "border-[color:var(--color-border)] bg-white text-[var(--color-ink)] hover:border-[var(--color-brand)]"
                  }`}
                  key={slot.startsAt}
                  onClick={() => setSelectedSlot(slot.startsAt)}
                  type="button"
                >
                  {slot.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--color-muted)]">
              No bookable slots match the current availability rules.
            </p>
          )}
        </div>
      </Card>

      <Card>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <CardTitle>Complete your booking</CardTitle>
            <CardDescription>
              This submits through a protected server handler. Final conflict
              prevention still happens in Postgres.
            </CardDescription>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="customerName">Name</Label>
              <Input id="customerName" name="customerName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email</Label>
              <Input id="customerEmail" name="customerEmail" required type="email" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerPhone">Phone</Label>
            <Input id="customerPhone" name="customerPhone" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerNotes">Notes</Label>
            <Textarea
              id="customerNotes"
              name="customerNotes"
              placeholder="Anything the provider should know before the appointment?"
            />
          </div>

          {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}
          {success ? (
            <p className="text-sm text-[var(--color-success)]">{success}</p>
          ) : null}

          <Button disabled={isSubmitting || !selectedSlot} type="submit">
            {isSubmitting ? "Booking..." : "Book selected time"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
