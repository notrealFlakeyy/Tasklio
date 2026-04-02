/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { ActionForm } from "@/components/forms/action-form";
import { FieldError } from "@/components/forms/field-error";
import { FormNotice } from "@/components/forms/form-notice";
import { SubmitButton } from "@/components/forms/submit-button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { Textarea } from "@/components/ui/textarea";
import { requireDashboardContext } from "@/lib/auth";
import {
  buildPublicBrandingStyle,
  getOrganizationBranding,
} from "@/lib/organization-branding";
import { updateOrganizationSettingsAction } from "@/modules/organizations/actions";

export default async function SettingsPage() {
  const { organization } = await requireDashboardContext();
  const branding = getOrganizationBranding(organization);

  return (
    <div className="space-y-6">
      <section className="section-frame relative overflow-hidden rounded-[36px] border border-[color:var(--color-border)] bg-[linear-gradient(150deg,rgba(255,255,255,0.86),rgba(234,247,207,0.84))] px-7 py-8 shadow-[var(--shadow-soft)] md:px-10 md:py-10">
        <div className="ambient-orb absolute -right-12 top-6 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(230,253,255,0.95),transparent_70%)]" />
        <div className="ambient-orb absolute bottom-0 left-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(120,100,82,0.12),transparent_72%)]" />
        <div className="relative grid gap-8 xl:grid-cols-[1.05fr,0.95fr]">
          <div className="max-w-3xl">
            <p className="editorial-kicker">Business profile</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Keep your business details clear and up to date.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--color-muted)] md:text-lg">
              This page controls the name, contact details, colors, and booking-page text
              people see before they book.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Business name
              </p>
              <CardTitle className="mt-3 text-2xl">{organization.name}</CardTitle>
              <CardDescription className="mt-2">
                The name shown on the booking page and in messages.
              </CardDescription>
            </Card>
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Public booking URL
              </p>
              <CardTitle className="mt-3 text-2xl">/book/{organization.slug}</CardTitle>
              <CardDescription className="mt-2">
                The single public entry point for your MVP.
              </CardDescription>
            </Card>
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Timezone
              </p>
              <CardTitle className="mt-3 text-2xl">{organization.timezone}</CardTitle>
              <CardDescription className="mt-2">
                Used for slot generation and local booking display.
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
            <Card className="bg-white/74 sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Booking-page branding
              </p>
              <CardTitle className="mt-3 text-2xl">
                {branding.tagline || "Simple booking page"}
              </CardTitle>
              <CardDescription className="mt-2">
                Logo, colors, headline, and description for the public booking flow.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.84fr,1.16fr]">
        <SpotlightPanel className="p-6 md:p-8">
          <p className="editorial-kicker">Live booking preview</p>
          <CardTitle className="mt-3 text-3xl">Preview your booking page.</CardTitle>
          <CardDescription className="mt-3 max-w-xl">
            You only need one public booking page. Keep it clear, friendly, and easy to trust.
          </CardDescription>

          <div className="mt-6 grid gap-4">
            <div
              className="rounded-[30px] border border-[color:var(--color-border)] bg-white/82 p-5 shadow-[0_18px_38px_rgba(68,55,48,0.06)]"
              style={buildPublicBrandingStyle(branding)}
            >
              <div className="rounded-[26px] border border-[color:var(--color-border)] bg-[linear-gradient(160deg,var(--background-soft),rgba(255,255,255,0.94),var(--background-alt))] p-5">
                <div className="flex items-center gap-3">
                  {branding.logoUrl ? (
                    <img
                      alt={`${organization.name} logo`}
                      className={
                        branding.logoNeedsContrastPanel
                          ? "h-16 w-16 rounded-[20px] border border-[color:rgba(68,55,48,0.08)] bg-white object-contain p-2 shadow-[0_14px_28px_rgba(68,55,48,0.08)]"
                          : "h-12 w-12 rounded-[16px] border border-[color:var(--color-border)] bg-white/80 object-cover p-1"
                      }
                      src={branding.logoUrl}
                    />
                  ) : null}
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-brand-strong)]">
                      {branding.tagline || organization.name}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      /book/{organization.slug}
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-2xl font-semibold text-[var(--color-brand-strong)]">
                  {branding.headline}
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  {branding.description}
                </p>
              </div>
            </div>

            <Card className="bg-white/74">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    Public link
                  </p>
                  <CardTitle className="mt-3 text-2xl">Open the booking page</CardTitle>
                  <CardDescription className="mt-2 max-w-md">
                    Open this page before sharing it.
                  </CardDescription>
                </div>
                <Link href={`/book/${organization.slug}`} target="_blank">
                  <span className="inline-flex h-11 items-center gap-2 rounded-[18px] border border-[color:var(--color-border)] bg-white/84 px-4 text-sm font-semibold text-[var(--color-ink)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5">
                    Open booking page
                    <ExternalLink className="size-4" />
                  </span>
                </Link>
              </div>
            </Card>
          </div>
        </SpotlightPanel>

        <SpotlightPanel className="p-6 md:p-8">
          <ActionForm action={updateOrganizationSettingsAction} className="space-y-8">
            <div className="grid gap-6">
              <div>
                <p className="editorial-kicker">Edit organization</p>
                <CardTitle className="mt-3 text-3xl">Keep the important details accurate.</CardTitle>
                <CardDescription className="mt-3 max-w-2xl">
                  These settings control your public booking page and a few simple booking rules.
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
                      <Input
                        id="timezone"
                        name="timezone"
                        required
                        defaultValue={organization.timezone}
                      />
                      <FieldError name="timezone" />
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-[color:var(--color-border)] bg-white/80 p-5 md:col-span-2">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    Public booking branding
                  </p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="brandLogoUrl">Logo URL</Label>
                      <Input
                        id="brandLogoUrl"
                        name="brandLogoUrl"
                        defaultValue={organization.brand_logo_url ?? ""}
                        placeholder="https://your-site.com/logo.png"
                      />
                      <FieldError name="brandLogoUrl" />
                      <p className="text-sm leading-6 text-[var(--color-muted)]">
                        Use a public image URL for now.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="publicTagline">Tagline</Label>
                      <Input
                        id="publicTagline"
                        name="publicTagline"
                        defaultValue={organization.public_tagline ?? ""}
                        placeholder="Optional short line"
                      />
                      <FieldError name="publicTagline" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="publicHeadline">Headline</Label>
                      <Input
                        id="publicHeadline"
                        name="publicHeadline"
                        defaultValue={organization.public_headline ?? ""}
                        placeholder={`A calmer way to book with ${organization.name}.`}
                      />
                      <FieldError name="publicHeadline" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="publicDescription">Description</Label>
                      <Textarea
                        id="publicDescription"
                        name="publicDescription"
                        defaultValue={organization.public_description ?? ""}
                        placeholder="A short description shown before someone chooses a service"
                      />
                      <FieldError name="publicDescription" />
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
                    Color system
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="brandPrimaryColor">Primary color</Label>
                      <Input
                        id="brandPrimaryColor"
                        name="brandPrimaryColor"
                        type="color"
                        defaultValue={organization.brand_primary_color ?? "#443730"}
                      />
                      <FieldError name="brandPrimaryColor" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brandAccentColor">Accent color</Label>
                      <Input
                        id="brandAccentColor"
                        name="brandAccentColor"
                        type="color"
                        defaultValue={organization.brand_accent_color ?? "#786452"}
                      />
                      <FieldError name="brandAccentColor" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brandSurfaceColor">Soft background</Label>
                      <Input
                        id="brandSurfaceColor"
                        name="brandSurfaceColor"
                        type="color"
                        defaultValue={organization.brand_surface_color ?? "#eaf7cf"}
                      />
                      <FieldError name="brandSurfaceColor" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brandAltColor">Alt background</Label>
                      <Input
                        id="brandAltColor"
                        name="brandAltColor"
                        type="color"
                        defaultValue={organization.brand_alt_color ?? "#e6fdff"}
                      />
                      <FieldError name="brandAltColor" />
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-[color:var(--color-border)] bg-white/80 p-5 md:col-span-2">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    Contact presence
                  </p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
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
