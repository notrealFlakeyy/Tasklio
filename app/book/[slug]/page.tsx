import { notFound } from "next/navigation";

import { PublicBookingWidget } from "@/components/forms/public-booking-widget";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { todayInTimeZone } from "@/lib/date-utils";
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

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
      <section className="mb-8 rounded-[32px] border border-[color:var(--color-border)] bg-[var(--color-surface)] p-8">
        <Badge>Public booking page</Badge>
        <h1 className="mt-4 text-5xl font-semibold">{organization.name}</h1>
        <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
          This route is public, but slot generation and booking writes still happen
          on trusted server boundaries.
        </p>
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
            The owner has not published any active services yet.
          </CardDescription>
        </Card>
      )}
    </main>
  );
}
