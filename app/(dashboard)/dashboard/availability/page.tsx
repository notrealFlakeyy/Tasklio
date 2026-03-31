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
import { requireDashboardContext } from "@/lib/auth";
import { DEFAULT_WEEKLY_HOURS, DAYS_OF_WEEK } from "@/lib/constants";
import { formatDateTimeLocalValue, minutesToTimeInput } from "@/lib/date-utils";
import {
  addBlockedDateAction,
  addTimeOffAction,
  removeBlockedDateAction,
  removeTimeOffAction,
  saveWeeklyAvailabilityAction,
} from "@/modules/availability/actions";
import { getAvailabilitySettings } from "@/modules/availability/queries";

export default async function AvailabilityPage() {
  const { organization } = await requireDashboardContext();
  const availability = await getAvailabilitySettings(organization.id);
  const ruleMap = new Map(availability.rules.map((rule) => [rule.weekday, rule]));

  const weeklyRows = DAYS_OF_WEEK.map((day) => {
    const rule = ruleMap.get(day.value);
    const fallback = DEFAULT_WEEKLY_HOURS.find((item) => item.weekday === day.value)!;
    const enabled = Boolean(rule) || fallback.enabled;
    const startTime = rule ? minutesToTimeInput(rule.start_minute) : fallback.startTime;
    const endTime = rule ? minutesToTimeInput(rule.end_minute) : fallback.endTime;

    return {
      day,
      enabled,
      endTime,
      startTime,
    };
  });

  const activeDays = weeklyRows.filter((row) => row.enabled).length;
  const nextBlockedDate = availability.blockedDates[0]?.blocked_on ?? null;
  const nextTimeOff = availability.timeOffPeriods[0]?.starts_at ?? null;

  return (
    <div className="space-y-6">
      <section className="section-frame relative overflow-hidden rounded-[36px] border border-[color:var(--color-border)] bg-[linear-gradient(145deg,rgba(234,247,207,0.92),rgba(230,253,255,0.86))] px-7 py-8 shadow-[var(--shadow-soft)] md:px-10 md:py-10">
        <div className="ambient-orb absolute -right-14 top-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.92),transparent_68%)]" />
        <div className="ambient-orb absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(120,100,82,0.14),transparent_72%)]" />
        <div className="relative grid gap-8 xl:grid-cols-[1.15fr,0.85fr]">
          <div className="max-w-3xl">
            <p className="editorial-kicker">Availability engine</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Shape a weekly rhythm that still leaves room for real life.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--color-muted)] md:text-lg">
              Your public slots are generated from working hours, timed absences,
              and full-day closures. This screen controls the operating cadence your
              customers feel on the outside.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="bg-white/72">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Active weekdays
              </p>
              <CardTitle className="mt-3 text-3xl">{activeDays}</CardTitle>
              <CardDescription className="mt-2">
                Days currently open for new bookings.
              </CardDescription>
            </Card>
            <Card className="bg-white/72">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Full-day closures
              </p>
              <CardTitle className="mt-3 text-3xl">
                {availability.blockedDates.length}
              </CardTitle>
              <CardDescription className="mt-2">
                {nextBlockedDate ? `Next: ${nextBlockedDate}` : "No blocked dates queued."}
              </CardDescription>
            </Card>
            <Card className="bg-white/72">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Timed absences
              </p>
              <CardTitle className="mt-3 text-3xl">
                {availability.timeOffPeriods.length}
              </CardTitle>
              <CardDescription className="mt-2">
                {nextTimeOff
                  ? `Next starts ${formatDateTimeLocalValue(nextTimeOff, organization.timezone)}`
                  : "No partial-day time off scheduled."}
              </CardDescription>
            </Card>
            <Card className="bg-white/72">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Business timezone
              </p>
              <CardTitle className="mt-3 text-2xl">{organization.timezone}</CardTitle>
              <CardDescription className="mt-2">
                All slots render locally here while storage stays in UTC.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      <SpotlightPanel className="p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-2xl">
            <p className="editorial-kicker">Weekly schedule</p>
            <CardTitle className="mt-3 text-3xl md:text-[2rem]">
              Set the baseline hours your booking flow can trust.
            </CardTitle>
            <CardDescription className="mt-3 max-w-2xl">
              Each weekday stores a start and end minute range. That keeps slot
              generation deterministic and makes timezone handling much easier to
              scale later when you add staff, resources, or multiple locations.
            </CardDescription>
          </div>
          <div className="rounded-[26px] border border-[color:var(--color-border)] bg-white/78 px-5 py-4 text-sm text-[var(--color-muted)] shadow-[0_14px_35px_rgba(68,55,48,0.08)]">
            Start with one clear working rhythm, then layer exceptions below.
          </div>
        </div>

        <ActionForm action={saveWeeklyAvailabilityAction} className="mt-8 space-y-4">
          {weeklyRows.map(({ day, enabled, startTime, endTime }) => (
            <div
              className="grid gap-4 rounded-[28px] border border-[color:var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.7))] p-5 shadow-[0_18px_38px_rgba(68,55,48,0.06)] md:grid-cols-[160px,140px,1fr,1fr]"
              key={day.value}
            >
              <div>
                <p className="text-base font-semibold text-[var(--color-ink)]">{day.label}</p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {enabled ? "Open for bookings" : "Currently closed"}
                </p>
              </div>

              <label className="flex h-14 items-center gap-3 rounded-[22px] border border-[color:var(--color-border)] bg-[rgba(230,253,255,0.72)] px-4 text-sm font-medium text-[var(--color-ink)]">
                <input
                  className="h-4 w-4 accent-[var(--color-brand-strong)]"
                  defaultChecked={enabled}
                  name={`enabled-${day.value}`}
                  type="checkbox"
                />
                Enabled
              </label>

              <div className="space-y-2">
                <Label htmlFor={`start-${day.value}`}>Start time</Label>
                <Input
                  id={`start-${day.value}`}
                  name={`start-${day.value}`}
                  type="time"
                  defaultValue={startTime}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`end-${day.value}`}>End time</Label>
                <Input
                  id={`end-${day.value}`}
                  name={`end-${day.value}`}
                  type="time"
                  defaultValue={endTime}
                />
              </div>
            </div>
          ))}
          <FormNotice successLabel="Saved." />
          <div className="flex justify-end">
            <SubmitButton pendingLabel="Saving hours...">Save weekly hours</SubmitButton>
          </div>
        </ActionForm>
      </SpotlightPanel>

      <div className="grid gap-6 xl:grid-cols-2">
        <SpotlightPanel className="p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
            <div className="space-y-4">
              <div>
                <p className="editorial-kicker">Calendar closures</p>
                <CardTitle className="mt-3 text-3xl">Blocked dates</CardTitle>
                <CardDescription className="mt-3">
                  Reserve full days for holidays, travel, retreats, or seasonal
                  pauses without editing the weekly schedule itself.
                </CardDescription>
              </div>

              <ActionForm action={addBlockedDateAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="blockedOn">Date</Label>
                  <Input id="blockedOn" name="blockedOn" required type="date" />
                  <FieldError name="blockedOn" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blockedReason">Reason</Label>
                  <Input id="blockedReason" name="reason" placeholder="Holiday or travel day" />
                  <FieldError name="reason" />
                </div>
                <FormNotice successLabel="Saved." />
                <SubmitButton pendingLabel="Blocking date...">Add blocked date</SubmitButton>
              </ActionForm>
            </div>

            <div className="space-y-3">
              {availability.blockedDates.length ? (
                availability.blockedDates.map((blockedDate) => (
                  <ActionForm
                    action={removeBlockedDateAction}
                    className="flex flex-wrap items-start justify-between gap-4 rounded-[26px] border border-[color:var(--color-border)] bg-white/82 p-5"
                    key={blockedDate.id}
                  >
                    <input name="blockedDateId" type="hidden" value={blockedDate.id} />
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-[var(--color-ink)]">
                        {blockedDate.blocked_on}
                      </p>
                      <p className="text-sm leading-7 text-[var(--color-muted)]">
                        {blockedDate.reason ?? "No reason provided"}
                      </p>
                    </div>
                    <Button type="submit" variant="danger">
                      Remove
                    </Button>
                  </ActionForm>
                ))
              ) : (
                <EmptyState
                  className="bg-white/72"
                  description="Add dates here when the whole business should disappear from the public booking flow."
                  title="No blocked dates scheduled"
                />
              )}
            </div>
          </div>
        </SpotlightPanel>

        <SpotlightPanel className="p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
            <div className="space-y-4">
              <div>
                <p className="editorial-kicker">Partial-day control</p>
                <CardTitle className="mt-3 text-3xl">Manual time off</CardTitle>
                <CardDescription className="mt-3">
                  Use timed blocks for conferences, personal appointments, or admin
                  sessions. Inputs are interpreted in {organization.timezone}.
                </CardDescription>
              </div>

              <ActionForm action={addTimeOffAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="startsAtLocal">Start</Label>
                  <Input id="startsAtLocal" name="startsAtLocal" required type="datetime-local" />
                  <FieldError name="startsAtLocal" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endsAtLocal">End</Label>
                  <Input id="endsAtLocal" name="endsAtLocal" required type="datetime-local" />
                  <FieldError name="endsAtLocal" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeOffReason">Reason</Label>
                  <Input
                    id="timeOffReason"
                    name="reason"
                    placeholder="Conference, family time, admin block"
                  />
                  <FieldError name="reason" />
                </div>
                <FormNotice successLabel="Saved." />
                <SubmitButton pendingLabel="Saving time off...">Add time off</SubmitButton>
              </ActionForm>
            </div>

            <div className="space-y-3">
              {availability.timeOffPeriods.length ? (
                availability.timeOffPeriods.map((period) => (
                  <ActionForm
                    action={removeTimeOffAction}
                    className="flex flex-wrap items-start justify-between gap-4 rounded-[26px] border border-[color:var(--color-border)] bg-white/82 p-5"
                    key={period.id}
                  >
                    <input name="timeOffId" type="hidden" value={period.id} />
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-[var(--color-ink)]">
                        {formatDateTimeLocalValue(period.starts_at, organization.timezone)}
                      </p>
                      <p className="text-sm text-[var(--color-muted)]">
                        Until {formatDateTimeLocalValue(period.ends_at, organization.timezone)}
                      </p>
                      <p className="text-sm leading-7 text-[var(--color-muted)]">
                        {period.reason ?? "No reason provided"}
                      </p>
                    </div>
                    <Button type="submit" variant="danger">
                      Remove
                    </Button>
                  </ActionForm>
                ))
              ) : (
                <EmptyState
                  className="bg-white/72"
                  description="This is useful when you are open that day overall but unavailable for a specific stretch of time."
                  title="No timed absences yet"
                />
              )}
            </div>
          </div>
        </SpotlightPanel>
      </div>
    </div>
  );
}
