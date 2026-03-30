import { SubmitButton } from "@/components/forms/submit-button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireDashboardContext } from "@/lib/auth";
import { updateOrganizationSettingsAction } from "@/modules/organizations/actions";

export default async function SettingsPage() {
  const { organization } = await requireDashboardContext();

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <CardTitle>Owner settings</CardTitle>
        <CardDescription>
          These organization-level fields are intentionally small now, but they map
          directly to future plan enforcement, branding, and custom-domain features.
        </CardDescription>
      </Card>

      <Card>
        <form action={updateOrganizationSettingsAction} className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="name">Business name</Label>
            <Input id="name" name="name" required defaultValue={organization.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Public slug</Label>
            <Input id="slug" name="slug" required defaultValue={organization.slug} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input id="timezone" name="timezone" required defaultValue={organization.timezone} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bookingNoticeHours">Minimum notice hours</Label>
            <Input
              id="bookingNoticeHours"
              name="bookingNoticeHours"
              required
              type="number"
              defaultValue={organization.booking_notice_hours}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slotIntervalMinutes">Slot interval minutes</Label>
            <Input
              id="slotIntervalMinutes"
              name="slotIntervalMinutes"
              required
              type="number"
              defaultValue={organization.slot_interval_minutes}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact email</Label>
            <Input id="contactEmail" name="contactEmail" defaultValue={organization.contact_email ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact phone</Label>
            <Input id="contactPhone" name="contactPhone" defaultValue={organization.contact_phone ?? ""} />
          </div>
          <SubmitButton pendingLabel="Saving settings...">Save settings</SubmitButton>
        </form>
      </Card>
    </div>
  );
}
