import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  ChartSpline,
  Layers3,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { ClientFlowLogo } from "@/components/clientflow-logo";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const platformSignals = [
  {
    description: "Structured around organizations, clients, bookings, revenue, and future billing.",
    icon: Layers3,
    title: "Business model first",
  },
  {
    description: "Every write is validated, server-side, and backed by database constraints.",
    icon: ShieldCheck,
    title: "Trust at the core",
  },
  {
    description: "Designed for repeat business, relationships, and operational visibility.",
    icon: UsersRound,
    title: "Client-led workflow",
  },
] as const;

const operatingLoops = [
  {
    detail: "Craft services, shape availability, and create a first impression that feels intentional.",
    number: "01",
    title: "Attract and schedule",
  },
  {
    detail: "Turn every booking into a customer record with history, notes, tags, and lifecycle context.",
    number: "02",
    title: "Remember every client",
  },
  {
    detail: "See booked revenue, top services, pending work, and customer mix from one dashboard.",
    number: "03",
    title: "Run the business daily",
  },
] as const;

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-[color:rgba(68,55,48,0.08)] pb-6">
        <div className="space-y-3">
          <ClientFlowLogo size={160} />
          <p className="max-w-xl text-sm leading-7 text-[#6a5b51] md:text-[15px]">
            A calmer visual identity for booking, client memory, and everyday business operations.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 sm:justify-end">
          <Link href="/auth/sign-in">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button>Create ClientFlow workspace</Button>
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden py-12 lg:py-18">
        <div className="ambient-orb soft animate-drift left-[-3rem] top-12 h-44 w-44" />
        <div className="ambient-orb alt animate-pulse-glow right-[-4rem] top-24 h-56 w-56" />
        <div className="ambient-orb warm bottom-8 left-1/2 h-48 w-48 -translate-x-1/2" />

        <div className="grid gap-10 lg:grid-cols-[1.05fr,0.95fr] lg:items-center">
          <Reveal className="space-y-8">
            <div className="space-y-5">
              <p className="editorial-kicker">Scheduling, client memory, and daily revenue visibility</p>
              <h1 className="text-balance max-w-4xl text-5xl leading-[0.95] font-semibold md:text-6xl lg:text-[5.2rem]">
                A booking platform that feels like it already understands the business behind the appointment.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--color-muted)] md:text-xl">
                Built for service-led teams that want a warmer, more premium front
                door and a calmer back office. Schedule visits, build client
                memory, and keep revenue context visible without turning the site
                into a cold template.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/auth/sign-up">
                <Button size="lg">
                  Start with the owner flow
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/book/clientflow-demo">
                <Button size="lg" variant="secondary">
                  Preview the public booking experience
                </Button>
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Booked revenue view", value: formatCurrency(48200) },
                { label: "Client profiles created", value: "240+" },
                { label: "Average completion lift", value: "19%" },
              ].map((item) => (
                <div
                  className="rounded-[26px] border border-[color:var(--color-border)] bg-white/72 p-5 shadow-[var(--shadow-soft)]"
                  key={item.label}
                >
                  <p className="text-2xl font-semibold text-[var(--color-brand-strong)]">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <SpotlightPanel className="mesh-sheen min-h-[640px] p-7 lg:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(234,247,207,0.92),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(230,253,255,0.85),transparent_36%)]" />
              <div className="relative space-y-6">
                <div className="rounded-[28px] border border-[color:var(--color-border)] bg-[rgba(255,255,255,0.84)] p-6">
                  <p className="editorial-kicker">Today at a glance</p>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-[var(--color-muted)]">Booked revenue</p>
                      <p className="mt-2 text-4xl font-semibold text-[var(--color-brand-strong)]">
                        {formatCurrency(18450)}
                      </p>
                    </div>
                    <div className="space-y-3 rounded-[24px] bg-[var(--background-alt)]/75 p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--color-muted)]">Pending confirmations</span>
                        <span className="font-semibold text-[var(--color-brand-strong)]">4</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/80">
                        <div className="h-2 w-2/3 rounded-full bg-[var(--color-brand)]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[0.95fr,1.05fr]">
                  <div className="rounded-[28px] border border-[color:var(--color-border)] bg-[rgba(255,255,255,0.8)] p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-semibold">Upcoming visits</p>
                        <p className="mt-1 text-sm text-[var(--color-muted)]">
                          Designed to feel calm at a glance
                        </p>
                      </div>
                      <CalendarCheck2 className="size-5 text-[var(--color-brand)]" />
                    </div>
                    <div className="mt-5 space-y-3">
                      {[
                        ["09:30", "Initial consultation", "Sofia Reyes"],
                        ["11:00", "Follow-up treatment", "Micah Jones"],
                        ["14:15", "VIP renewal session", "Aria Bennett"],
                      ].map(([time, service, client]) => (
                        <div
                          className="rounded-[22px] border border-[color:var(--color-border)] bg-white/80 p-4"
                          key={`${time}-${client}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold">{service}</p>
                              <p className="text-sm text-[var(--color-muted)]">{client}</p>
                            </div>
                            <p className="text-sm font-semibold text-[var(--color-brand-strong)]">
                              {time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-[28px] border border-[color:var(--color-border)] bg-[rgba(255,255,255,0.82)] p-5">
                      <div className="flex items-center gap-3">
                        <UsersRound className="size-5 text-[var(--color-brand)]" />
                        <div>
                          <p className="font-semibold">Client memory built in</p>
                          <p className="text-sm text-[var(--color-muted)]">
                            Tags, status, notes, and full booking history
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-[28px] border border-[color:var(--color-border)] bg-[var(--background-soft)]/70 p-5">
                      <div className="flex items-center gap-3">
                        <ChartSpline className="size-5 text-[var(--color-brand)]" />
                        <div>
                          <p className="font-semibold">Revenue by service</p>
                          <p className="text-sm text-[var(--color-muted)]">
                            Snapshot pricing preserves historical accuracy
                          </p>
                        </div>
                      </div>
                      <div className="mt-5 space-y-3">
                        {[
                          ["Membership sessions", "42%", "w-5/6"],
                          ["Consultations", "31%", "w-2/3"],
                          ["Follow-ups", "27%", "w-1/2"],
                        ].map(([label, share, width]) => (
                          <div key={label}>
                            <div className="mb-2 flex items-center justify-between text-sm">
                              <span>{label}</span>
                              <span className="text-[var(--color-muted)]">{share}</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/80">
                              <div className={`h-2 rounded-full bg-[var(--color-brand)] ${width}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SpotlightPanel>
          </Reveal>
        </div>
      </section>

      <section className="py-12 lg:py-18">
        <div className="grid gap-8 lg:grid-cols-[0.78fr,1.22fr]">
          <Reveal className="space-y-4">
            <p className="editorial-kicker">A warmer, less template-looking system</p>
            <h2 className="text-balance text-4xl leading-tight font-semibold md:text-5xl">
              The front door should feel inviting. The operating system behind it should feel composed.
            </h2>
            <p className="max-w-xl text-lg leading-8 text-[var(--color-muted)]">
              Instead of repeating the same centered heading and three-card block,
              the layout shifts rhythm from section to section. That gives the site
              more personality, more hierarchy, and more room to breathe.
            </p>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2">
            {platformSignals.map(({ description, icon: Icon, title }, index) => (
              <Reveal className={index === 1 ? "md:translate-y-10" : ""} delay={index * 80} key={title}>
                <SpotlightPanel className="h-full p-6">
                  <div className="space-y-5">
                    <div className="flex size-14 items-center justify-center rounded-[20px] border border-[color:var(--color-border)] bg-white/78 text-[var(--color-brand)] shadow-[var(--shadow-soft)]">
                      <Icon className="size-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold">{title}</h3>
                      <p className="mt-3 text-[15px] leading-7 text-[var(--color-muted)]">
                        {description}
                      </p>
                    </div>
                  </div>
                </SpotlightPanel>
              </Reveal>
            ))}

            <Reveal className="md:col-span-2" delay={220}>
              <div className="section-frame rounded-[34px] p-8 md:p-10">
                <div className="relative grid gap-8 md:grid-cols-[0.9fr,1.1fr] md:items-center">
                  <div className="space-y-4">
                    <p className="editorial-kicker">Not just an online calendar</p>
                    <h3 className="text-3xl font-semibold md:text-4xl">
                      Every appointment strengthens context instead of disappearing into a list.
                    </h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      "Customer profiles with notes and lifecycle status",
                      "Booking history connected to each client",
                      "Booked revenue snapshots tied to services",
                      "Dashboard KPIs that explain what needs attention",
                    ].map((item) => (
                      <div
                        className="rounded-[24px] border border-[color:var(--color-border)] bg-white/82 p-4 text-sm leading-7 text-[var(--color-muted)]"
                        key={item}
                      >
                        <Sparkles className="mb-3 size-4 text-[var(--color-brand)]" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-18">
        <Reveal className="grid gap-8 lg:grid-cols-[0.88fr,1.12fr]">
          <div className="space-y-5">
            <p className="editorial-kicker">Three operating loops</p>
            <h2 className="text-balance text-4xl leading-tight font-semibold md:text-5xl">
              The product now moves from marketing surface to client memory to operational clarity.
            </h2>
            <p className="max-w-xl text-lg leading-8 text-[var(--color-muted)]">
              That shift is what makes the site feel more premium and more useful.
              It is no longer a static brochure with a booking form attached.
            </p>
          </div>

          <div className="space-y-4">
            {operatingLoops.map((loop, index) => (
              <Reveal delay={index * 90} key={loop.number}>
                <SpotlightPanel className="p-6 md:p-8">
                  <div className="grid gap-4 md:grid-cols-[120px,1fr] md:items-start">
                    <p className="text-5xl font-semibold text-[rgba(68,55,48,0.18)]">
                      {loop.number}
                    </p>
                    <div>
                      <h3 className="text-2xl font-semibold">{loop.title}</h3>
                      <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[var(--color-muted)]">
                        {loop.detail}
                      </p>
                    </div>
                  </div>
                </SpotlightPanel>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="py-12 lg:py-18">
        <Reveal>
          <SpotlightPanel className="overflow-hidden p-8 md:p-12">
            <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,rgba(230,253,255,0.85),transparent_60%)] lg:block" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr,auto] lg:items-center">
              <div className="space-y-5">
                <p className="editorial-kicker">Move from generic tools to a more memorable ClientFlow experience</p>
                <h2 className="text-balance text-4xl leading-tight font-semibold md:text-5xl">
                  A calmer visual language, richer interaction, and a front end that feels cared for.
                </h2>
                <p className="max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
                  The redesign keeps the stack lean while bringing in layered
                  backgrounds, editorial hierarchy, soft motion, elevated cards,
                  and stronger section identities throughout the product.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/auth/sign-up">
                  <Button size="lg">Create your ClientFlow workspace</Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="secondary">
                    Explore dashboard routes
                  </Button>
                </Link>
              </div>
            </div>
          </SpotlightPanel>
        </Reveal>
      </section>
    </main>
  );
}
