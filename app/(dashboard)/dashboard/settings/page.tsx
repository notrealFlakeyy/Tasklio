import { ActionForm } from "@/components/forms/action-form";
import { FieldError } from "@/components/forms/field-error";
import { FormNotice } from "@/components/forms/form-notice";
import { SubmitButton } from "@/components/forms/submit-button";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireDashboardContext } from "@/lib/auth";
import { updateOrganizationSettingsAction } from "@/modules/organizations/actions";

export default async function SettingsPage() {
  const { organization } = await requireDashboardContext();

  return (
    <div className="space-y-6">
      <section className="section-frame relative overflow-hidden rounded-[36px] border border-[color:var(--color-border)] bg-[linear-gradient(150deg,rgba(255,255,255,0.86),rgba(234,247,207,0.84))] px-7 py-8 shadow-[var(--shadow-soft)] md:px-10 md:py-10">
        <div className="ambient-orb absolute -right-12 top-6 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(230,253,255,0.95),transparent_70%)]" />
        <div className="ambient-orb absolute bottom-0 left-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(120,100,82,0.12),transparent_72%)]" />
        <div className="relative grid gap-8 xl:grid-cols-[1.05fr,0.95fr]">
          <div className="max-w-3xl">
            <p className="editorial-kicker">Business profile</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Define the operating identity behind every booking.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--color-muted)] md:text-lg">
              These organization-level settings shape public booking links, slot
              generation, and future SaaS controls like billing, branding, and
              custom domains.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Business name
              </p>
              <CardTitle className="mt-3 text-2xl">{organization.name}</CardTitle>
              <CardDescription className="mt-2">
                The main label customers see across the product.
              </CardDescription>
            </Card>
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Public slug
              </p>
              <CardTitle className="mt-3 text-2xl">{organization.slug}</CardTitle>
              <CardDescription className="mt-2">
                Powers the shareable booking URL today.
              </CardDescription>
            </Card>
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Timezone
              </p>
              <CardTitle className="mt-3 text-2xl">{organization.timezone}</CardTitle>
              <CardDescription className="mt-2">
                Used for slot calculation and local dashboard display.
              </CardDescription>
            </Card>
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Scheduling rules
              </p>
              <CardTitle className="mt-3 text-2xl">
                {organization.slot_interval_minutes} min
              </CardTitle>
              <CardDescription className="mt-2">
                {organization.booking_notice_hours} hour notice window.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.84fr,1.16fr]">
        <SpotlightPanel className="p-6 md:p-8">
          <p className="editorial-kicker">Why these settings matter</p>
          <CardTitle className="mt-3 text-3xl">A small settings surface with room to grow.</CardTitle>
          <CardDescription className="mt-3 max-w-xl">
            The MVP keeps this page intentionally lean, but the fields here are
            already aligned with future product layers such as plan limits, multiple
            brands, domain mapping, and customer-facing contact details.
          </CardDescription>

          <div className="mt-6 grid gap-4">
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Public presence
              </p>
              <CardDescription className="mt-3">
                Name, slug, and contact fields define how the business presents
                itself before heavier branding controls are added.
              </CardDescription>
            </Card>
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Scheduling policy
              </p>
              <CardDescription className="mt-3">
                Notice hours and slot interval shape demand intake without needing
                custom booking logic on every page.
              </CardDescription>
            </Card>
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                SaaS readiness
              </p>
              <CardDescription className="mt-3">
                These fields map neatly to future billing, white-label, and multi-org
                plan enforcement instead of becoming throwaway MVP data.
              </CardDescription>
            </Card>
          </div>
        </SpotlightPanel>

        <SpotlightPanel className="p-6 md:p-8">
          <ActionForm action={updateOrganizationSettingsAction} className="space-y-8">
            <div className="grid gap-6">
              <div>
                <p className="editorial-kicker">Edit organization</p>
                <CardTitle className="mt-3 text-3xl">Keep the business profile accurate.</CardTitle>
                <CardDescription className="mt-3 max-w-2xl">
                  Update the identity, public link settings, and scheduling controls
                  that shape the customer experience across the app.
                </CardDescription>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[28px] border border-[color:var(--color-border)] bg-white/80 p-5 md:col-span-2">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    Business identity
                  </p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="name">Business name</Label>
                      <Input id="name" name="name" required defaultValue={organization.name} />
                      <FieldError name="name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Public slug</Label>
                      <Input id="slug" name="slug" required defaultValue={organization.slug} />
                      <FieldError name="slug" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input id="timezone" name="timezone" required defaultValue={organization.timezone} />
                      <FieldError name="timezone" />
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-[color:var(--color-border)] bg-white/80 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    Scheduling controls
                  </p>
                  <div className="mt-4 grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bookingNoticeHours">Minimum notice hours</Label>
                      <Input
                        id="bookingNoticeHours"
                        name="bookingNoticeHours"
                        required
                        type="number"
                        defaultValue={organization.booking_notice_hours}
                      />
                      <FieldError name="bookingNoticeHours" />
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
                      <FieldError name="slotIntervalMinutes" />
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-[color:var(--color-border)] bg-white/80 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    Contact presence
                  </p>
                  <div className="mt-4 grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact email</Label>
                      <Input
                        id="contactEmail"
                        name="contactEmail"
                        defaultValue={organization.contact_email ?? ""}
                      />
                      <FieldError name="contactEmail" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact phone</Label>
                      <Input
                        id="contactPhone"
                        name="contactPhone"
                        defaultValue={organization.contact_phone ?? ""}
                      />
                      <FieldError name="contactPhone" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <FormNotice successLabel="Saved." />
            </div>
            <div className="flex justify-end">
              <SubmitButton pendingLabel="Saving settings...">Save settings</SubmitButton>
            </div>
          </ActionForm>
        </SpotlightPanel>
      </div>
    </div>
  );
}
