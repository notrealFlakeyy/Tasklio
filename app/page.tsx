import Link from "next/link";
import { ArrowRight, CalendarClock, CreditCard, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const highlights = [
  {
    title: "Single-tenant MVP, SaaS-ready model",
    description:
      "Organizations, memberships, services, availability, customers, bookings, and billing scaffolding are separated from day one.",
    icon: CalendarClock,
  },
  {
    title: "Security-first Supabase boundaries",
    description:
      "SSR auth, protected dashboard routes, validated writes, RLS-ready tables, and a server-only admin client for trusted flows.",
    icon: ShieldCheck,
  },
  {
    title: "Stripe-ready architecture",
    description:
      "Plan and subscription tables are included now so future billing rollout does not require reworking booking ownership.",
    icon: CreditCard,
  },
] as const;

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-10 lg:px-10">
      <header className="flex items-center justify-between">
        <Badge>Booking SaaS MVP Starter</Badge>
        <div className="flex items-center gap-3">
          <Link href="/auth/sign-in">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button>Create owner account</Button>
          </Link>
        </div>
      </header>

      <section className="grid flex-1 gap-8 py-16 lg:grid-cols-[1.2fr,0.8fr] lg:items-center">
        <div className="space-y-6">
          <Badge>Next.js 16 + Supabase SSR</Badge>
          <h1 className="max-w-3xl text-5xl leading-tight font-semibold text-[var(--color-ink)] lg:text-7xl">
            Booking infrastructure that starts lean and grows into SaaS cleanly.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
            This scaffold ships the core booking MVP for solo providers while
            keeping clear seams for staff calendars, locations, billing tiers,
            custom domains, and white-labeling later.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/auth/sign-up">
              <Button size="lg">
                Launch the owner flow
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/book/demo-business">
              <Button size="lg" variant="secondary">
                Preview the public booking page
              </Button>
            </Link>
          </div>
        </div>

        <Card className="space-y-5 bg-[var(--color-surface)] p-8">
          <Badge>Included in the starter</Badge>
          {highlights.map(({ description, icon: Icon, title }) => (
            <div
              className="rounded-3xl border border-[color:var(--color-border)] bg-white/85 p-5"
              key={title}
            >
              <Icon className="mb-4 size-5 text-[var(--color-brand)]" />
              <CardTitle className="mb-2 text-lg">{title}</CardTitle>
              <CardDescription className="leading-7">{description}</CardDescription>
            </div>
          ))}
        </Card>
      </section>
    </main>
  );
}
