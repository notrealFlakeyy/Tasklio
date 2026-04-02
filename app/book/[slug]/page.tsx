import Link from "next/link";
import { notFound } from "next/navigation";

import { ClientFlowLogo } from "@/components/clientflow-logo";
import { PublicBookingWidget } from "@/components/forms/public-booking-widget";
import { SiteFooter } from "@/components/site/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { todayInTimeZone } from "@/lib/date-utils";
import {
  buildPublicBrandingStyle,
  getOrganizationBranding,
} from "@/lib/organization-branding";
import { getPublicOrganizationBySlug, listPublicServices } from "@/modules/organizations/queries";

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

  return (
    <main
      className="mx-auto max-w-7xl px-6 py-8 lg:px-10"
      style={buildPublicBrandingStyle(branding)}
    >
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--color-border)] pb-6">
        <div className="space-y-3">
          <Link className="inline-flex items-center" href="/">
            <ClientFlowLogo size={64} />
          </Link>
          <div className="space-y-1">
            <p className="text-sm font-medium tracking-[0.08em] text-[var(--color-muted)] uppercase">
              Booking page
            </p>
            <p className="text-sm leading-7 text-[var(--color-muted)]">
              Choose a day and time with {organization.name}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-[18px] border border-[color:var(--color-border)] bg-white/82 px-4 py-3 text-sm font-medium text-[var(--color-muted)]">
            Times shown in {organization.timezone}
          </div>
          <Link href="/auth/sign-in">
            <Button variant="secondary">Owner sign in</Button>
          </Link>
        </div>
      </header>

      <section className="py-8 lg:py-10">
        <div className="space-y-6">
          <Card className="p-6 md:p-7">
            <div className="space-y-4">
              <CardTitle className="text-3xl md:text-4xl">{branding.headline}</CardTitle>
              <CardDescription className="max-w-3xl text-base leading-8">
                {branding.description}
              </CardDescription>
            </div>
          </Card>

          {services.length ? (
            <PublicBookingWidget
              defaultDate={todayInTimeZone(organization.timezone)}
              organizationName={organization.name}
              organizationSlug={organization.slug}
              services={services}
              timezone={organization.timezone}
            />
          ) : (
            <Card className="p-8">
              <CardTitle>No active services</CardTitle>
              <CardDescription>
                This business has not published any active services yet.
              </CardDescription>
            </Card>
          )}
        </div>
      </section>

      <SiteFooter anchorPrefix="/" previewHref={`/book/${organization.slug}`} />
    </main>
  );
}
