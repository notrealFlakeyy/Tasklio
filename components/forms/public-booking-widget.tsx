"use client";

import { startTransition, useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, PhoneCall } from "lucide-react";

import type { Tables } from "@/lib/database.types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast-provider";

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

type BookingResponse = {
  fieldErrors?: Record<string, string>;
  message?: string;
};

type PublicBookingWidgetProps = {
  defaultDate: string;
  organizationName: string;
  organizationSlug: string;
  services: ServiceOption[];
  timezone: string;
};

async function fetchSlotsForSelection(
  organizationSlug: string,
  serviceId: string,
  date: string,
) {
  const response = await fetch(
    `/api/public/organizations/${organizationSlug}/slots?serviceId=${serviceId}&date=${date}`,
    { cache: "no-store" },
  );
  const payload = (await response.json()) as { message?: string; slots?: Slot[] };

  if (!response.ok) {
    throw new Error(payload.message ?? "Unable to load time slots.");
  }

  return payload.slots ?? [];
}

function FieldMessage({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-[var(--color-danger)]">{message}</p>;
}

function BookingNotice({
  message,
  tone,
}: {
  message?: string | null;
  tone: "error" | "success";
}) {
  if (!message) {
    return null;
  }

  const className =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50/90 text-emerald-950"
      : "border-rose-200 bg-rose-50/90 text-rose-950";

  const label = tone === "success" ? "Booked." : "Please review.";

  return (
    <div
      className={`rounded-[20px] border px-4 py-3 text-sm leading-6 ${className}`}
      role={tone === "success" ? "status" : "alert"}
    >
      <span className="font-semibold">{label}</span>{" "}
      <span>{message}</span>
    </div>
  );
}

export function PublicBookingWidget({
  defaultDate,
  organizationName,
  organizationSlug,
  services,
  timezone,
}: PublicBookingWidgetProps) {
  const { pushToast } = useToast();
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id ?? "");
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedService = services.find((service) => service.id === selectedServiceId);

  useEffect(() => {
    if (!selectedServiceId || !selectedDate) {
      setSlots([]);
      setSelectedSlot("");
      return;
    }

    let isCancelled = false;

    startTransition(() => {
      void (async () => {
        setIsLoadingSlots(true);
        setError(null);

        try {
          const nextSlots = await fetchSlotsForSelection(
            organizationSlug,
            selectedServiceId,
            selectedDate,
          );

          if (isCancelled) {
            return;
          }

          setSlots(nextSlots);
          setSelectedSlot("");
        } catch (slotError) {
          if (isCancelled) {
            return;
          }

          const message =
            slotError instanceof Error
              ? slotError.message
              : "Unable to load booking slots.";

          setSlots([]);
          setSelectedSlot("");
          setError(message);
          pushToast({ message, tone: "error" });
        } finally {
          if (!isCancelled) {
            setIsLoadingSlots(false);
          }
        }
      })();
    });

    return () => {
      isCancelled = true;
    };
  }, [organizationSlug, pushToast, selectedDate, selectedServiceId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setSuccess(null);

    if (!selectedSlot) {
      const message = "Please choose a time before submitting.";
      setFieldErrors({ startsAt: message });
      setError(message);
      pushToast({ message, tone: "error" });
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

      const payload = (await response.json()) as BookingResponse;

      if (!response.ok) {
        setFieldErrors(payload.fieldErrors ?? {});
        throw new Error(payload.message ?? "Booking failed.");
      }

      const message = `Your booking request with ${organizationName} has been received through ClientFlow.`;
      setSuccess(message);
      pushToast({ message, tone: "success" });
      event.currentTarget.reset();
      setSelectedSlot("");

      try {
        const nextSlots = await fetchSlotsForSelection(
          organizationSlug,
          selectedServiceId,
          selectedDate,
        );
        setSlots(nextSlots);
      } catch {
        setSlots([]);
      }
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Booking failed.";

      setError(message);
      pushToast({ message, tone: "error" });
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
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              Time slots are generated in the business timezone and stored in UTC behind the scenes,
              so confirmations stay consistent for the owner dashboard.
            </p>
          </div>

          <div className="space-y-3">
            {services.map((service) => {
              const isActive = selectedServiceId === service.id;

              return (
                <button
                  aria-pressed={isActive}
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
                aria-invalid={fieldErrors.date ? "true" : "false"}
                className="mt-4"
                id="date"
                min={defaultDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                type="date"
                value={selectedDate}
              />
              <FieldMessage message={fieldErrors.date} />
            </div>

            <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white/80 p-5">
              <div className="flex items-center gap-3">
                <Clock3 className="size-5 text-[var(--color-brand)]" />
                <div>
                  <p className="text-sm font-semibold">Select a time</p>
                  <p className="text-sm text-[var(--color-muted)]">
                    All visible times below are shown in {timezone}.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                {isLoadingSlots ? (
                  <div className="grid grid-cols-2 gap-3" aria-hidden="true">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div
                        className="h-[46px] rounded-[18px] border border-[color:var(--color-border)] bg-[linear-gradient(90deg,rgba(255,255,255,0.72),rgba(230,253,255,0.74),rgba(255,255,255,0.72))] animate-pulse"
                        key={index}
                      />
                    ))}
                  </div>
                ) : slots.length ? (
                  <div className="grid grid-cols-2 gap-3" role="list">
                    {slots.map((slot) => (
                      <button
                        aria-pressed={selectedSlot === slot.startsAt}
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

      <SpotlightPanel className="p-6 md:sticky md:top-6 md:p-7">
        <form className="space-y-6" noValidate onSubmit={handleSubmit}>
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
              <Input
                aria-invalid={fieldErrors.customerName ? "true" : "false"}
                autoComplete="name"
                id="customerName"
                name="customerName"
                required
              />
              <FieldMessage message={fieldErrors.customerName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                aria-invalid={fieldErrors.customerEmail ? "true" : "false"}
                autoComplete="email"
                id="customerEmail"
                name="customerEmail"
                required
                type="email"
              />
              <FieldMessage message={fieldErrors.customerEmail} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerPhone">Phone</Label>
            <Input
              aria-invalid={fieldErrors.customerPhone ? "true" : "false"}
              autoComplete="tel"
              id="customerPhone"
              name="customerPhone"
            />
            <FieldMessage message={fieldErrors.customerPhone} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerNotes">Notes</Label>
            <Textarea
              aria-invalid={fieldErrors.customerNotes ? "true" : "false"}
              id="customerNotes"
              name="customerNotes"
              placeholder="Anything useful to know before the appointment?"
            />
            <FieldMessage message={fieldErrors.customerNotes} />
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
                    ? `${selectedService.name} | ${selectedService.duration_minutes} min | ${formatCurrency(
                        selectedService.price_amount,
                        selectedService.currency,
                      )}`
                    : "Choose a service to continue."}
                </p>
                <p className="mt-1 text-sm leading-7 text-[var(--color-muted)]">
                  {selectedSlot
                    ? `Chosen time: ${slots.find((slot) => slot.startsAt === selectedSlot)?.label ?? ""} (${timezone})`
                    : "No time selected yet."}
                </p>
              </div>
            </div>
          </div>

          <FieldMessage message={fieldErrors.startsAt} />
          <BookingNotice message={error} tone="error" />
          <BookingNotice message={success} tone="success" />

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
