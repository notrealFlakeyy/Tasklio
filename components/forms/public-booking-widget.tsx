"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, Clock3 } from "lucide-react";

import type { Tables } from "@/lib/database.types";
import { formatDateOnly } from "@/lib/date-utils";
import { formatCurrency, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
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
  isAvailable: boolean;
  label: string;
  startsAt: string;
};

type CalendarDay = {
  availableCount: number;
  date: string;
  status: "available" | "closed" | "full" | "past";
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
    throw new Error(payload.message ?? "Unable to load available times.");
  }

  return payload.slots ?? [];
}

async function fetchCalendarMonth(
  organizationSlug: string,
  serviceId: string,
  month: string,
) {
  const response = await fetch(
    `/api/public/organizations/${organizationSlug}/calendar?serviceId=${serviceId}&month=${month}`,
    { cache: "no-store" },
  );
  const payload = (await response.json()) as { days?: CalendarDay[]; message?: string };

  if (!response.ok) {
    throw new Error(payload.message ?? "Unable to load the calendar.");
  }

  return payload.days ?? [];
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

  return (
    <div
      className={`rounded-[20px] border px-4 py-3 text-sm leading-6 ${className}`}
      role={tone === "success" ? "status" : "alert"}
    >
      {message}
    </div>
  );
}

function getDayButtonClassName(
  isSelected: boolean,
  dayState?: CalendarDay,
) {
  if (isSelected) {
    return "border-[color:rgba(68,55,48,0.16)] bg-[var(--color-brand-strong)] text-white shadow-[0_16px_36px_rgba(68,55,48,0.16)]";
  }

  if (!dayState || dayState.status === "past" || dayState.status === "closed") {
    return "border-[color:var(--color-border)] bg-stone-50 text-stone-400";
  }

  if (dayState.status === "full") {
    return "border-[color:rgba(120,100,82,0.16)] bg-[rgba(165,144,126,0.12)] text-[var(--color-muted)]";
  }

  return "border-[color:var(--color-border)] bg-white text-[var(--color-ink)] hover:border-[color:var(--color-border-strong)] hover:shadow-[var(--shadow-soft)]";
}

function getDayStatusLabel(dayState?: CalendarDay) {
  if (!dayState) {
    return "Check";
  }

  if (dayState.status === "available") {
    return `${dayState.availableCount}`;
  }

  if (dayState.status === "full") {
    return "Full";
  }

  if (dayState.status === "past") {
    return "Past";
  }

  return "Closed";
}

function getDayStatusDotClassName(dayState?: CalendarDay) {
  if (!dayState || dayState.status === "closed" || dayState.status === "past") {
    return "bg-stone-300";
  }

  if (dayState.status === "full") {
    return "bg-[var(--color-accent)]";
  }

  return "bg-emerald-500";
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
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(parseISO(`${defaultDate}T00:00:00`)));
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedService = services.find((service) => service.id === selectedServiceId);
  const monthKey = format(viewMonth, "yyyy-MM");
  const defaultMonthKey = defaultDate.slice(0, 7);
  const calendarGridDays = useMemo(
    () =>
      eachDayOfInterval({
        end: endOfWeek(endOfMonth(viewMonth), { weekStartsOn: 1 }),
        start: startOfWeek(startOfMonth(viewMonth), { weekStartsOn: 1 }),
      }),
    [viewMonth],
  );
  const dayStatesByDate = useMemo(
    () => new Map(calendarDays.map((day) => [day.date, day])),
    [calendarDays],
  );

  useEffect(() => {
    if (!selectedServiceId) {
      setCalendarDays([]);
      return;
    }

    let isCancelled = false;

    startTransition(() => {
      void (async () => {
        setIsLoadingCalendar(true);

        try {
          const nextDays = await fetchCalendarMonth(
            organizationSlug,
            selectedServiceId,
            monthKey,
          );

          if (isCancelled) {
            return;
          }

          setCalendarDays(nextDays);
        } catch (calendarError) {
          if (isCancelled) {
            return;
          }

          const message =
            calendarError instanceof Error
              ? calendarError.message
              : "Unable to load calendar.";

          pushToast({ message, tone: "error" });
        } finally {
          if (!isCancelled) {
            setIsLoadingCalendar(false);
          }
        }
      })();
    });

    return () => {
      isCancelled = true;
    };
  }, [monthKey, organizationSlug, pushToast, selectedServiceId]);

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
    const form = event.currentTarget;
    setError(null);
    setFieldErrors({});
    setSuccess(null);

    if (!selectedSlot) {
      const message = "Please choose a time before sending your booking.";
      setFieldErrors({ startsAt: message });
      setError(message);
      pushToast({ message, tone: "error" });
      return;
    }

    const formData = new FormData(form);
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

      const message = `Thank you. Your booking request has been sent to ${organizationName}.`;
      setSuccess(message);
      pushToast({ message, tone: "success" });
      form.reset();
      setSelectedSlot("");

      try {
        const [nextSlots, nextCalendar] = await Promise.all([
          fetchSlotsForSelection(organizationSlug, selectedServiceId, selectedDate),
          fetchCalendarMonth(organizationSlug, selectedServiceId, monthKey),
        ]);
        setSlots(nextSlots);
        setCalendarDays(nextCalendar);
      } catch {
        setSlots([]);
      }
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Unable to send your booking.";

      setError(message);
      pushToast({ message, tone: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!services.length) {
    return (
      <Card className="p-8">
        <CardTitle>No services published yet</CardTitle>
        <CardDescription>
          There are no services available for booking right now.
        </CardDescription>
      </Card>
    );
  }

  return (
    <section className="space-y-6 pb-10">
      <Card className="p-6 md:p-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="editorial-kicker">Booking calendar</p>
            <CardTitle className="text-3xl md:text-4xl">Choose a day and time</CardTitle>
            <CardDescription className="max-w-2xl text-base">
              Start by choosing a day. Free times are shown clearly, and all times are shown
              in {timezone}.
            </CardDescription>
          </div>

          {services.length > 1 ? (
            <div className="space-y-2">
              <Label htmlFor="serviceSelect">Choose a service</Label>
              <Select
                id="serviceSelect"
                onChange={(event) => setSelectedServiceId(event.target.value)}
                value={selectedServiceId}
              >
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {formatCurrency(service.price_amount, service.currency)}
                  </option>
                ))}
              </Select>
            </div>
          ) : (
            <div className="rounded-[22px] border border-[color:var(--color-border)] bg-[var(--background-soft)]/45 p-4">
              <p className="text-sm font-semibold text-[var(--color-brand-strong)]">
                {selectedService?.name}
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                {selectedService?.duration_minutes} min |{" "}
                {selectedService
                  ? formatCurrency(selectedService.price_amount, selectedService.currency)
                  : ""}
              </p>
            </div>
          )}

          <div className="grid gap-6 xl:grid-cols-[1.18fr,0.82fr]">
            <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-brand-strong)]">
                    {format(viewMonth, "MMMM yyyy")}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    Pick a day from the calendar
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    disabled={format(subMonths(viewMonth, 1), "yyyy-MM") < defaultMonthKey}
                    onClick={() => setViewMonth((current) => subMonths(current, 1))}
                    size="lg"
                    variant="secondary"
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button
                    onClick={() => setViewMonth((current) => addMonths(current, 1))}
                    size="lg"
                    variant="secondary"
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-[var(--color-muted)]">
                <div className="inline-flex items-center gap-2 rounded-[16px] border border-[color:var(--color-border)] bg-[var(--background-soft)]/35 px-3 py-2">
                  <span className="size-2.5 rounded-full bg-emerald-500" />
                  Free
                </div>
                <div className="inline-flex items-center gap-2 rounded-[16px] border border-[color:var(--color-border)] bg-white px-3 py-2">
                  <span className="size-2.5 rounded-full bg-[var(--color-accent)]" />
                  Full
                </div>
                <div className="inline-flex items-center gap-2 rounded-[16px] border border-[color:var(--color-border)] bg-white px-3 py-2">
                  <span className="size-2.5 rounded-full bg-stone-300" />
                  Closed
                </div>
              </div>

              <div className="mt-6 grid grid-cols-7 gap-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)] md:text-sm">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => (
                  <div key={label}>{label}</div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-7 gap-3">
                {calendarGridDays.map((day) => {
                  const dateKey = format(day, "yyyy-MM-dd");
                  const dayState = dayStatesByDate.get(dateKey);
                  const isCurrentMonth = isSameMonth(day, viewMonth);
                  const isSelected = selectedDate === dateKey;
                  const isDisabled =
                    !isCurrentMonth ||
                    dateKey < defaultDate;

                  return (
                    <button
                      className={cn(
                        "min-h-[108px] rounded-[22px] border px-3 py-4 text-left transition md:min-h-[122px] md:px-4 md:py-5",
                        !isCurrentMonth && "opacity-35",
                        getDayButtonClassName(isSelected, dayState),
                      )}
                      disabled={isDisabled}
                      key={dateKey}
                      onClick={() => setSelectedDate(dateKey)}
                      type="button"
                    >
                      <div className="flex h-full flex-col justify-between">
                        <p className="text-lg font-semibold md:text-xl">{format(day, "d")}</p>
                        {isCurrentMonth ? (
                          <div className="mt-4 flex items-center gap-2">
                            <span
                              className={cn(
                                "size-2.5 rounded-full",
                                getDayStatusDotClassName(dayState),
                              )}
                            />
                            <p className="text-xs font-medium tracking-[0.04em] md:text-sm">
                              {getDayStatusLabel(dayState)}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white p-5">
              <div className="flex items-center gap-3">
                <Clock3 className="size-5 text-[var(--color-brand)]" />
                <div>
                  <p className="text-sm font-semibold text-[var(--color-brand-strong)]">
                    {formatDateOnly(selectedDate)}
                  </p>
                  <p className="text-sm text-[var(--color-muted)]">
                    Available and booked times for this day
                  </p>
                </div>
              </div>

              <div className="mt-5">
                {isLoadingSlots || isLoadingCalendar ? (
                  <div className="grid grid-cols-2 gap-3" aria-hidden="true">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div
                        className="h-[52px] rounded-[18px] border border-[color:var(--color-border)] bg-[linear-gradient(90deg,rgba(255,255,255,0.72),rgba(230,253,255,0.74),rgba(255,255,255,0.72))] animate-pulse"
                        key={index}
                      />
                    ))}
                  </div>
                ) : slots.length ? (
                  <div className="grid grid-cols-2 gap-3" role="list">
                    {slots.map((slot) => (
                      <button
                        aria-pressed={selectedSlot === slot.startsAt}
                        className={cn(
                          "rounded-[18px] border px-4 py-3 text-sm font-semibold transition",
                          slot.isAvailable
                            ? selectedSlot === slot.startsAt
                              ? "border-[color:rgba(68,55,48,0.16)] bg-[var(--background-soft)] text-[var(--color-brand-strong)] shadow-[var(--shadow-soft)]"
                              : "border-[color:var(--color-border)] bg-white text-[var(--color-ink)] hover:border-[color:var(--color-border-strong)] hover:shadow-[var(--shadow-soft)]"
                            : "cursor-not-allowed border-stone-200 bg-stone-50 text-stone-400",
                        )}
                        disabled={!slot.isAvailable}
                        key={slot.startsAt}
                        onClick={() => setSelectedSlot(slot.startsAt)}
                        type="button"
                      >
                        <span>{slot.label}</span>
                        <span className="mt-1 block text-xs font-medium opacity-75">
                          {slot.isAvailable ? "Available" : "Booked"}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm leading-7 text-[var(--color-muted)]">
                    There are no available times for this day.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 md:p-8">
        <form className="space-y-6" noValidate onSubmit={handleSubmit}>
          <div className="space-y-3">
            <p className="editorial-kicker">Your details</p>
            <CardTitle className="text-3xl">Add your contact details</CardTitle>
            <CardDescription className="max-w-2xl text-base">
              After choosing a time, fill in your details below.
            </CardDescription>
          </div>

          <div className="rounded-[22px] border border-[color:var(--color-border)] bg-[var(--background-soft)]/45 p-4">
            <p className="text-sm font-semibold text-[var(--color-brand-strong)]">
              Your chosen time
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
              {selectedService
                ? `${selectedService.name} | ${selectedService.duration_minutes} min | ${formatCurrency(
                    selectedService.price_amount,
                    selectedService.currency,
                  )}`
                : "Choose a service"}
            </p>
            <p className="mt-1 text-sm leading-7 text-[var(--color-muted)]">
              {selectedSlot
                ? `${formatDateOnly(selectedDate)} at ${slots.find((slot) => slot.startsAt === selectedSlot)?.label ?? ""} (${timezone})`
                : "No time selected yet."}
            </p>
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
              placeholder="Optional"
            />
            <FieldMessage message={fieldErrors.customerPhone} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerNotes">Notes</Label>
            <Textarea
              aria-invalid={fieldErrors.customerNotes ? "true" : "false"}
              id="customerNotes"
              name="customerNotes"
              placeholder="Optional message before the appointment"
            />
            <FieldMessage message={fieldErrors.customerNotes} />
          </div>

          <FieldMessage message={fieldErrors.startsAt} />
          <BookingNotice message={error} tone="error" />
          <BookingNotice message={success} tone="success" />

          <div className="flex flex-wrap items-center gap-3">
            <Button disabled={isSubmitting || !selectedSlot} size="lg" type="submit">
              {isSubmitting ? "Sending..." : "Send booking request"}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
