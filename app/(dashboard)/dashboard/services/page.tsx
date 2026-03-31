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
import { Textarea } from "@/components/ui/textarea";
import { requireDashboardContext } from "@/lib/auth";
import { formatCurrency, cn } from "@/lib/utils";
import {
  deleteServiceAction,
  upsertServiceAction,
} from "@/modules/services/actions";
import {
  getServicePerformanceSummary,
  listServicesForOrganization,
} from "@/modules/services/queries";

function serviceStatusClassName(isActive: boolean) {
  return isActive
    ? "border-emerald-200 bg-emerald-50/90 text-emerald-900"
    : "border-stone-200 bg-stone-100/90 text-stone-700";
}

export default async function ServicesPage() {
  const { organization } = await requireDashboardContext();
  const [services, performance] = await Promise.all([
    listServicesForOrganization(organization.id),
    getServicePerformanceSummary(organization.id),
  ]);
  const performanceByServiceId = new Map(
    performance.map((item) => [item.serviceId, item]),
  );

  const activeServices = services.filter((service) => service.is_active).length;
  const totalBookedRevenue = performance.reduce(
    (sum, item) => sum + item.bookedRevenueAmount,
    0,
  );
  const totalCompletedRevenue = performance.reduce(
    (sum, item) => sum + item.completedRevenueAmount,
    0,
  );

  return (
    <div className="space-y-6">
      <section className="section-frame relative overflow-hidden rounded-[36px] border border-[color:var(--color-border)] bg-[linear-gradient(150deg,rgba(255,255,255,0.84),rgba(230,253,255,0.9))] px-7 py-8 shadow-[var(--shadow-soft)] md:px-10 md:py-10">
        <div className="ambient-orb absolute right-0 top-2 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(234,247,207,0.94),transparent_72%)]" />
        <div className="ambient-orb absolute bottom-0 left-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(120,100,82,0.12),transparent_72%)]" />
        <div className="relative grid gap-8 xl:grid-cols-[1.08fr,0.92fr]">
          <div className="max-w-3xl">
            <p className="editorial-kicker">Service catalog</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Package the work you sell with clearer structure and stronger signals.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--color-muted)] md:text-lg">
              Services define what customers can book, how long it takes, how much
              it costs, and how much buffer your day needs. This screen turns that
              catalog into something that feels operational, not merely editable.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Total services
              </p>
              <CardTitle className="mt-3 text-3xl">{services.length}</CardTitle>
              <CardDescription className="mt-2">
                Every offer currently configured for the business.
              </CardDescription>
            </Card>
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Active now
              </p>
              <CardTitle className="mt-3 text-3xl">{activeServices}</CardTitle>
              <CardDescription className="mt-2">
                Services currently visible to booking flow logic.
              </CardDescription>
            </Card>
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Booked revenue
              </p>
              <CardTitle className="mt-3 text-3xl">
                {formatCurrency(totalBookedRevenue)}
              </CardTitle>
              <CardDescription className="mt-2">
                Revenue committed across active and completed bookings.
              </CardDescription>
            </Card>
            <Card className="bg-white/74">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Completed revenue
              </p>
              <CardTitle className="mt-3 text-3xl">
                {formatCurrency(totalCompletedRevenue)}
              </CardTitle>
              <CardDescription className="mt-2">
                Delivered revenue already earned from finished sessions.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.86fr,1.14fr]">
        <SpotlightPanel className="p-6 md:p-8">
          <div>
            <p className="editorial-kicker">Create service</p>
            <CardTitle className="mt-3 text-3xl">Add a new offer to the catalog.</CardTitle>
            <CardDescription className="mt-3 max-w-xl">
              Keep service creation simple for the MVP, but still structured enough
              to support future pricing rules, staff assignment, and plan-based
              catalog limits.
            </CardDescription>
          </div>

          <ActionForm action={upsertServiceAction} className="mt-6 grid gap-4">
            <div className="rounded-[28px] border border-[color:var(--color-border)] bg-white/80 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Core details
              </p>
              <div className="mt-4 grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="create-name">Service name</Label>
                  <Input
                    id="create-name"
                    name="name"
                    placeholder="Initial consultation"
                    required
                  />
                  <FieldError name="name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-description">Description</Label>
                  <Textarea
                    id="create-description"
                    name="description"
                    placeholder="What is included, who it is for, and what the customer should expect?"
                  />
                  <FieldError name="description" />
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[color:var(--color-border)] bg-white/80 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Pricing and delivery
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="create-duration">Duration (minutes)</Label>
                  <Input
                    id="create-duration"
                    name="durationMinutes"
                    required
                    type="number"
                    defaultValue="60"
                  />
                  <FieldError name="durationMinutes" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-price">Price in minor units</Label>
                  <Input
                    id="create-price"
                    name="priceAmount"
                    required
                    type="number"
                    defaultValue="7500"
                  />
                  <FieldError name="priceAmount" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-buffer">Buffer (minutes)</Label>
                  <Input
                    id="create-buffer"
                    name="bufferMinutes"
                    required
                    type="number"
                    defaultValue="15"
                  />
                  <FieldError name="bufferMinutes" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-currency">Currency</Label>
                  <Input
                    id="create-currency"
                    name="currency"
                    required
                    defaultValue="EUR"
                  />
                  <FieldError name="currency" />
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[color:var(--color-border)] bg-white/80 p-5">
              <label className="flex items-center gap-3 text-sm font-medium text-[var(--color-ink)]">
                <input
                  className="h-4 w-4 accent-[var(--color-brand-strong)]"
                  defaultChecked
                  name="isActive"
                  type="checkbox"
                />
                Publish immediately
              </label>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                Price stays in minor units for correctness. A value of 7500 means
                75.00 in the selected currency.
              </p>
            </div>

            <FormNotice successLabel="Saved." />
            <div className="flex justify-end">
              <SubmitButton pendingLabel="Creating service...">Create service</SubmitButton>
            </div>
          </ActionForm>
        </SpotlightPanel>

        <div className="space-y-4">
          {services.length ? (
            services.map((service) => {
              const servicePerformance = performanceByServiceId.get(service.id);

              return (
                <SpotlightPanel className="p-6 md:p-7" key={service.id}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-3xl space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <CardTitle className="text-[1.45rem]">{service.name}</CardTitle>
                        <span
                          className={cn(
                            "rounded-[16px] border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
                            serviceStatusClassName(service.is_active),
                          )}
                        >
                          {service.is_active ? "active" : "inactive"}
                        </span>
                      </div>

                      <CardDescription className="max-w-2xl">
                        {service.description ??
                          "No service description yet. Add one to make the public booking flow feel more informed and premium."}
                      </CardDescription>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white/78 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                            Price
                          </p>
                          <p className="mt-2 text-lg font-semibold text-[var(--color-ink)]">
                            {formatCurrency(service.price_amount, service.currency)}
                          </p>
                        </div>
                        <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white/78 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                            Duration
                          </p>
                          <p className="mt-2 text-lg font-semibold text-[var(--color-ink)]">
                            {service.duration_minutes} min
                          </p>
                        </div>
                        <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white/78 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                            Buffer
                          </p>
                          <p className="mt-2 text-lg font-semibold text-[var(--color-ink)]">
                            {service.buffer_minutes} min
                          </p>
                        </div>
                      </div>
                    </div>

                    <ActionForm action={deleteServiceAction} toastMode="all">
                      <input name="serviceId" type="hidden" value={service.id} />
                      <Button type="submit" variant="danger">
                        Delete
                      </Button>
                    </ActionForm>
                  </div>

                  <div className="mt-6 grid gap-3 md:grid-cols-3">
                    <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white/78 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                        Bookings
                      </p>
                      <p className="mt-2 text-xl font-semibold">
                        {servicePerformance?.totalBookings ?? 0}
                      </p>
                    </div>
                    <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white/78 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                        Booked revenue
                      </p>
                      <p className="mt-2 text-xl font-semibold">
                        {formatCurrency(
                          servicePerformance?.bookedRevenueAmount ?? 0,
                          service.currency,
                        )}
                      </p>
                    </div>
                    <div className="rounded-[24px] border border-[color:var(--color-border)] bg-white/78 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                        Completed revenue
                      </p>
                      <p className="mt-2 text-xl font-semibold">
                        {formatCurrency(
                          servicePerformance?.completedRevenueAmount ?? 0,
                          service.currency,
                        )}
                      </p>
                    </div>
                  </div>

                  <ActionForm action={upsertServiceAction} className="mt-6 grid gap-4 md:grid-cols-2">
                    <input name="id" type="hidden" value={service.id} />
                    <div className="rounded-[28px] border border-[color:var(--color-border)] bg-white/80 p-5 md:col-span-2">
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                        Offer details
                      </p>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`name-${service.id}`}>Name</Label>
                          <Input
                            id={`name-${service.id}`}
                            name="name"
                            required
                            defaultValue={service.name}
                          />
                          <FieldError name="name" />
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
                          <FieldError name="durationMinutes" />
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
                          <FieldError name="priceAmount" />
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
                          <FieldError name="bufferMinutes" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`currency-${service.id}`}>Currency</Label>
                          <Input
                            id={`currency-${service.id}`}
                            name="currency"
                            required
                            defaultValue={service.currency}
                          />
                          <FieldError name="currency" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`description-${service.id}`}>Description</Label>
                          <Textarea
                            id={`description-${service.id}`}
                            name="description"
                            defaultValue={service.description ?? ""}
                          />
                          <FieldError name="description" />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[28px] border border-[color:var(--color-border)] bg-white/80 p-5 md:col-span-2">
                      <FormNotice successLabel="Saved." />
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <label className="flex items-center gap-3 text-sm font-medium text-[var(--color-ink)]">
                          <input
                            className="h-4 w-4 accent-[var(--color-brand-strong)]"
                            defaultChecked={service.is_active}
                            name="isActive"
                            type="checkbox"
                          />
                          Active in booking flow
                        </label>
                        <SubmitButton pendingLabel="Saving service...">Save changes</SubmitButton>
                      </div>
                    </div>
                  </ActionForm>
                </SpotlightPanel>
              );
            })
          ) : (
            <EmptyState
              description="Create your first service to start shaping the public booking flow and revenue model for the business."
              title="No services yet"
            />
          )}
        </div>
      </div>
    </div>
  );
}
