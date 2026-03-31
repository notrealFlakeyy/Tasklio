"use client";

import { startTransition, useEffect, useEffectEvent, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, PhoneCall } from "lucide-react";

import type { Tables } from "@/lib/database.types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { Textarea } from "@/components/ui/textarea";

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
      setError("Please choose a time before submitting.");
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

      setSuccess(`Your booking request with ${organizationName} has been received.`);
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
      <SpotlightPanel className="p-8">
        <CardTitle>No services published yet</CardTitle>
        <CardDescription>
          This business has not activated any bookable services.
        </CardDescription>
      </SpotlightPanel>
    );
  }

  return (
    <section className="grid gap-6 pb-10 lg:grid-cols-[0.92fr,1.08fr]">
      <SpotlightPanel className="p-6 md:p-7">
        <div className="space-y-6">
          <div>
            <p className="editorial-kicker">Choose the visit</p>
            <CardTitle className="mt-3 text-3xl md:text-4xl">{organizationName}</CardTitle>
            <CardDescription className="mt-3 max-w-xl text-base">
              Pick the service that fits, choose a date, and reserve from the live
              availability grid. Everything is shown in {timezone}.
            </CardDescription>
          </div>

          <div className="space-y-3">
            {services.map((service) => {
              const isActive = selectedServiceId === service.id;

              return (
                <button
                  className={`w-full rounded-[24px] border p-5 text-left transition duration-300 ${
                    isActive
                      ? "border-[color:rgba(68,55,48,0.16)] bg-[var(--color-brand-strong)] text-white shadow-[0_20px_50px_rgba(68,55,48,0.18)]"
                      : "border-[color:var(--color-border)] bg-white/82 text-[var(--color-ink)] hover:-translate-y-0.5 hover:border-[color:var(--color-border-strong)]"
                  }`}
                  key={service.id}
                  onClick={() => setSelectedServiceId(service.id)}
                  type="button"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">{service.name}</p>
                      <p
                        className={`mt-2 text-sm ${
                          isActive ? "text-white/76" : "text-[var(--color-muted)]"
                        }`}
                      >
                        {service.duration_minutes} min session with{" "}
                        {service.buffer_minutes} min buffer
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      {formatCurrency(service.price_amount, service.currency)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white/80 p-5">
              <div className="flex items-center gap-3">
                <CalendarDays className="size-5 text-[var(--color-brand)]" />
                <div>
                  <p className="text-sm font-semibold">Pick your date</p>
                  <p className="text-sm text-[var(--color-muted)]">
                    Real slots are generated from weekly rules plus time off.
                  </p>
                </div>
              </div>
              <Input
                className="mt-4"
                id="date"
                min={defaultDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                type="date"
                value={selectedDate}
              />
            </div>

            <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white/80 p-5">
              <div className="flex items-center gap-3">
                <Clock3 className="size-5 text-[var(--color-brand)]" />
                <div>
                  <p className="text-sm font-semibold">Select a time</p>
                  <p className="text-sm text-[var(--color-muted)]">
                    Time slots stay aligned to business timezone rules.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                {isLoadingSlots ? (
                  <p className="text-sm text-[var(--color-muted)]">Loading live slots...</p>
                ) : slots.length ? (
                  <div className="grid grid-cols-2 gap-3">
                    {slots.map((slot) => (
                      <button
                        className={`rounded-[18px] border px-4 py-3 text-sm font-semibold transition ${
                          selectedSlot === slot.startsAt
                            ? "border-[color:rgba(68,55,48,0.16)] bg-[var(--background-soft)] text-[var(--color-brand-strong)] shadow-[var(--shadow-soft)]"
                            : "border-[color:var(--color-border)] bg-white text-[var(--color-ink)] hover:-translate-y-0.5 hover:border-[color:var(--color-border-strong)]"
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
                  <p className="text-sm leading-7 text-[var(--color-muted)]">
                    No times are available for the current selection.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </SpotlightPanel>

      <SpotlightPanel className="p-6 md:p-7">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <p className="editorial-kicker">Confirm the details</p>
            <CardTitle className="mt-3 text-3xl md:text-4xl">Complete your booking</CardTitle>
            <CardDescription className="mt-3 max-w-xl text-base">
              Clean form fields, live feedback, and server-side validation keep the
              flow elegant without sacrificing reliability.
            </CardDescription>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
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
              placeholder="Anything useful to know before the appointment?"
            />
          </div>

          <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white/78 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5 text-[var(--color-brand)]" />
              <div>
                <p className="font-semibold text-[var(--color-brand-strong)]">
                  Selected experience
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                  {selectedService
                    ? `${selectedService.name} · ${selectedService.duration_minutes} min · ${formatCurrency(
                        selectedService.price_amount,
                        selectedService.currency,
                      )}`
                    : "Choose a service to continue."}
                </p>
                <p className="mt-1 text-sm leading-7 text-[var(--color-muted)]">
                  {selectedSlot
                    ? `Chosen time: ${slots.find((slot) => slot.startsAt === selectedSlot)?.label ?? ""}`
                    : "No time selected yet."}
                </p>
              </div>
            </div>
          </div>

          {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}
          {success ? <p className="text-sm text-[var(--color-success)]">{success}</p> : null}

          <div className="flex flex-wrap items-center gap-3">
            <Button disabled={isSubmitting || !selectedSlot} size="lg" type="submit">
              {isSubmitting ? "Booking..." : "Request this appointment"}
            </Button>
            <div className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)]">
              <PhoneCall className="size-4 text-[var(--color-brand)]" />
              Prefer phone follow-up? Add it above and the business can call you.
            </div>
          </div>
        </form>
      </SpotlightPanel>
    </section>
  );
}
