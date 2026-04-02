/* eslint-disable @next/next/no-img-element */

import { notFound } from "next/navigation";
import { Clock3, Sparkles, WalletCards } from "lucide-react";

import { PublicBookingWidget } from "@/components/forms/public-booking-widget";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { todayInTimeZone } from "@/lib/date-utils";
import { buildPublicBrandingStyle, getOrganizationBranding } from "@/lib/organization-branding";
import { formatCurrency } from "@/lib/utils";
import {
  getPublicOrganizationBySlug,
  listPublicServices,
} from "@/modules/organizations/queries";

export default async function PublicBookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const organization = await getPublicOrganizationBySlug(slug);

  if (!organization) {
    notFound();
  }

  const services = await listPublicServices(organization.id);
  const branding = getOrganizationBranding(organization);
  const startingPrice = services.length
    ? Math.min(...services.map((service) => service.price_amount))
    : 0;

  return (
    <main
      className="mx-auto max-w-7xl px-6 py-8 lg:px-10"
      style={buildPublicBrandingStyle(branding)}
    >
      <section className="relative overflow-hidden py-8 lg:py-12">
        <div className="ambient-orb soft left-[-2rem] top-12 h-36 w-36 animate-drift" />
        <div className="ambient-orb alt right-[-1rem] top-20 h-44 w-44 animate-pulse-glow" />

        <div className="grid gap-8 lg:grid-cols-[0.92fr,1.08fr] lg:items-end">
          <Reveal className="space-y-5">
            <div className="flex flex-wrap items-center gap-4">
              {branding.logoUrl ? (
                <img
                  alt={`${organization.name} logo`}
                  className={
                    branding.logoNeedsContrastPanel
                      ? "h-20 w-20 rounded-[24px] border border-[color:rgba(68,55,48,0.08)] bg-white object-contain p-2.5 shadow-[0_18px_38px_rgba(68,55,48,0.08)]"
                      : "h-16 w-16 rounded-[20px] border border-[color:var(--color-border)] bg-white/80 object-cover p-1 shadow-[var(--shadow-soft)]"
                  }
                  src={branding.logoUrl}
                />
              ) : null}
              <div>
                <p className="editorial-kicker">{branding.tagline}</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  Hosted by {organization.name}
                </p>
              </div>
            </div>
            <h1 className="text-balance text-5xl leading-[0.95] font-semibold md:text-6xl">
              {branding.headline}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
              {branding.description}
            </p>
          </Reveal>

          <Reveal delay={120}>
            <SpotlightPanel className="p-6 md:p-7">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white/80 p-4">
                  <Clock3 className="size-5 text-[var(--color-brand)]" />
                  <p className="mt-4 text-sm text-[var(--color-muted)]">Timezone-aware</p>
                  <p className="mt-1 font-semibold">{organization.timezone}</p>
                </div>
                <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white/80 p-4">
                  <WalletCards className="size-5 text-[var(--color-brand)]" />
                  <p className="mt-4 text-sm text-[var(--color-muted)]">Starting from</p>
                  <p className="mt-1 font-semibold">
                    {services.length ? formatCurrency(startingPrice) : "Unavailable"}
                  </p>
                </div>
                <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white/80 p-4">
                  <Sparkles className="size-5 text-[var(--color-brand)]" />
                  <p className="mt-4 text-sm text-[var(--color-muted)]">Experience</p>
                  <p className="mt-1 font-semibold">Warm, responsive, and clear</p>
                </div>
              </div>
            </SpotlightPanel>
          </Reveal>
        </div>
      </section>

      {services.length ? (
        <PublicBookingWidget
          defaultDate={todayInTimeZone(organization.timezone)}
          organizationName={organization.name}
          organizationSlug={organization.slug}
          services={services}
          timezone={organization.timezone}
        />
      ) : (
        <Card>
          <CardTitle>No active services</CardTitle>
          <CardDescription>
            This business has not published any active services yet.
          </CardDescription>
        </Card>
      )}
    </main>
  );
}
