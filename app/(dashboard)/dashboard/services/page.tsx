import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireDashboardContext } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import {
  deleteServiceAction,
  upsertServiceAction,
} from "@/modules/services/actions";
import {
  getServicePerformanceSummary,
  listServicesForOrganization,
} from "@/modules/services/queries";

export default async function ServicesPage() {
  const { organization } = await requireDashboardContext();
  const [services, performance] = await Promise.all([
    listServicesForOrganization(organization.id),
    getServicePerformanceSummary(organization.id),
  ]);
  const performanceByServiceId = new Map(
    performance.map((item) => [item.serviceId, item]),
  );

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <CardTitle>Services</CardTitle>
        <CardDescription>
          CRUD stays in one place for the MVP. A future admin experience can split
          create and edit into dedicated routes without changing the underlying
          domain model.
        </CardDescription>
      </Card>

      <Card>
        <form action={upsertServiceAction} className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="create-name">New service name</Label>
            <Input id="create-name" name="name" placeholder="Initial consultation" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-duration">Duration (minutes)</Label>
            <Input id="create-duration" name="durationMinutes" required type="number" defaultValue="60" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-price">Price in minor units</Label>
            <Input id="create-price" name="priceAmount" required type="number" defaultValue="7500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-buffer">Buffer (minutes)</Label>
            <Input id="create-buffer" name="bufferMinutes" required type="number" defaultValue="15" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-currency">Currency</Label>
            <Input id="create-currency" name="currency" required defaultValue="EUR" />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="create-description">Description</Label>
            <Textarea
              id="create-description"
              name="description"
              placeholder="What is included in this service?"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
            <input defaultChecked name="isActive" type="checkbox" />
            Publish immediately
          </label>
          <SubmitButton pendingLabel="Creating service...">Create service</SubmitButton>
        </form>
      </Card>

      <div className="space-y-4">
        {services.map((service) => (
          <Card className="space-y-4" key={service.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>{service.name}</CardTitle>
                <CardDescription>
                  {formatCurrency(service.price_amount, service.currency)} |{" "}
                  {service.duration_minutes} min | {service.buffer_minutes} min buffer
                </CardDescription>
              </div>
              <form action={deleteServiceAction}>
                <input name="serviceId" type="hidden" value={service.id} />
                <Button type="submit" variant="danger">
                  Delete
                </Button>
              </form>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
                  Bookings
                </p>
                <p className="mt-2 text-xl font-semibold">
                  {performanceByServiceId.get(service.id)?.totalBookings ?? 0}
                </p>
              </div>
              <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
                  Booked revenue
                </p>
                <p className="mt-2 text-xl font-semibold">
                  {formatCurrency(
                    performanceByServiceId.get(service.id)?.bookedRevenueAmount ?? 0,
                    service.currency,
                  )}
                </p>
              </div>
              <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
                  Completed revenue
                </p>
                <p className="mt-2 text-xl font-semibold">
                  {formatCurrency(
                    performanceByServiceId.get(service.id)?.completedRevenueAmount ?? 0,
                    service.currency,
                  )}
                </p>
              </div>
            </div>

            <form action={upsertServiceAction} className="grid gap-4 lg:grid-cols-2">
              <input name="id" type="hidden" value={service.id} />
              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor={`name-${service.id}`}>Name</Label>
                <Input id={`name-${service.id}`} name="name" required defaultValue={service.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`duration-${service.id}`}>Duration</Label>
                <Input
                  id={`duration-${service.id}`}
                  name="durationMinutes"
                  required
                  type="number"
                  defaultValue={service.duration_minutes}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`price-${service.id}`}>Price</Label>
                <Input
                  id={`price-${service.id}`}
                  name="priceAmount"
                  required
                  type="number"
                  defaultValue={service.price_amount}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`buffer-${service.id}`}>Buffer</Label>
                <Input
                  id={`buffer-${service.id}`}
                  name="bufferMinutes"
                  required
                  type="number"
                  defaultValue={service.buffer_minutes}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`currency-${service.id}`}>Currency</Label>
                <Input
                  id={`currency-${service.id}`}
                  name="currency"
                  required
                  defaultValue={service.currency}
                />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor={`description-${service.id}`}>Description</Label>
                <Textarea
                  id={`description-${service.id}`}
                  name="description"
                  defaultValue={service.description ?? ""}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
                <input defaultChecked={service.is_active} name="isActive" type="checkbox" />
                Active
              </label>
              <SubmitButton pendingLabel="Saving service...">Save changes</SubmitButton>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
