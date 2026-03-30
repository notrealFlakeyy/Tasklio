import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
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

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <CardTitle>Availability</CardTitle>
        <CardDescription>
          Weekly hours are stored as weekday plus minute offsets. That keeps slot
          generation deterministic and timezone-safe.
        </CardDescription>
      </Card>

      <Card>
        <form action={saveWeeklyAvailabilityAction} className="space-y-4">
          {DAYS_OF_WEEK.map((day) => {
            const rule = ruleMap.get(day.value);
            const fallback = DEFAULT_WEEKLY_HOURS.find((item) => item.weekday === day.value)!;
            const enabled = Boolean(rule) || fallback.enabled;
            const startTime = rule
              ? minutesToTimeInput(rule.start_minute)
              : fallback.startTime;
            const endTime = rule ? minutesToTimeInput(rule.end_minute) : fallback.endTime;

            return (
              <div
                className="grid items-center gap-3 rounded-2xl border border-[color:var(--color-border)] bg-white p-4 md:grid-cols-[140px,120px,1fr,1fr]"
                key={day.value}
              >
                <span className="font-medium">{day.label}</span>
                <label className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
                  <input defaultChecked={enabled} name={`enabled-${day.value}`} type="checkbox" />
                  Enabled
                </label>
                <Input name={`start-${day.value}`} type="time" defaultValue={startTime} />
                <Input name={`end-${day.value}`} type="time" defaultValue={endTime} />
              </div>
            );
          })}
          <SubmitButton pendingLabel="Saving hours...">Save weekly hours</SubmitButton>
        </form>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <div>
            <CardTitle>Blocked dates</CardTitle>
            <CardDescription>
              Whole-day closures such as holidays and travel days.
            </CardDescription>
          </div>
          <form action={addBlockedDateAction} className="space-y-4">
            <Input name="blockedOn" required type="date" />
            <Input name="reason" placeholder="Holiday" />
            <SubmitButton pendingLabel="Blocking date...">Add blocked date</SubmitButton>
          </form>
          <div className="space-y-3">
            {availability.blockedDates.map((blockedDate) => (
              <form
                action={removeBlockedDateAction}
                className="flex items-center justify-between rounded-2xl border border-[color:var(--color-border)] bg-white p-4"
                key={blockedDate.id}
              >
                <input name="blockedDateId" type="hidden" value={blockedDate.id} />
                <div>
                  <p className="font-medium">{blockedDate.blocked_on}</p>
                  <p className="text-sm text-[var(--color-muted)]">
                    {blockedDate.reason ?? "No reason provided"}
                  </p>
                </div>
                <Button type="submit" variant="danger">
                  Remove
                </Button>
              </form>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <CardTitle>Manual time off</CardTitle>
            <CardDescription>
              Use timed blocks for partial-day absences. Inputs are interpreted in{" "}
              {organization.timezone}.
            </CardDescription>
          </div>
          <form action={addTimeOffAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="startsAtLocal">Start</Label>
              <Input id="startsAtLocal" name="startsAtLocal" required type="datetime-local" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endsAtLocal">End</Label>
              <Input id="endsAtLocal" name="endsAtLocal" required type="datetime-local" />
            </div>
            <Input name="reason" placeholder="Conference / personal time" />
            <SubmitButton pendingLabel="Saving time off...">Add time off</SubmitButton>
          </form>

          <div className="space-y-3">
            {availability.timeOffPeriods.map((period) => (
              <form
                action={removeTimeOffAction}
                className="flex items-center justify-between rounded-2xl border border-[color:var(--color-border)] bg-white p-4"
                key={period.id}
              >
                <input name="timeOffId" type="hidden" value={period.id} />
                <div>
                  <p className="font-medium">
                    {formatDateTimeLocalValue(period.starts_at, organization.timezone)} to{" "}
                    {formatDateTimeLocalValue(period.ends_at, organization.timezone)}
                  </p>
                  <p className="text-sm text-[var(--color-muted)]">
                    {period.reason ?? "No reason provided"}
                  </p>
                </div>
                <Button type="submit" variant="danger">
                  Remove
                </Button>
              </form>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
