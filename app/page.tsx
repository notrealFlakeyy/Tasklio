import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

import { ClientFlowLogo } from "@/components/clientflow-logo";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";

const simpleBenefits = [
  {
    description: "Add the services you offer, how long they take, and what they cost.",
    icon: CheckCircle2,
    title: "Services and prices",
  },
  {
    description: "Choose your normal working hours and block days off when needed.",
    icon: Clock3,
    title: "Working hours",
  },
  {
    description: "See new bookings in one place and confirm or cancel them easily.",
    icon: CalendarCheck2,
    title: "Simple calendar",
  },
] as const;

const reassurancePoints = [
  "Customers can book online at any time",
  "You control exactly when people can book",
  "Your booking page uses one simple link",
  "The calendar is easy to read on desktop and mobile",
] as const;

const startSteps = [
  {
    description: "Add one or two services with a price and duration.",
    title: "1. Add your services",
  },
  {
    description: "Set the days and times you are available.",
    title: "2. Set your hours",
  },
  {
    description: "Share your booking page link with customers.",
    title: "3. Start taking bookings",
  },
] as const;

const faqItems = [
  {
    answer:
      "Yes. ClientFlow is built first for solo service businesses that want a simple way to take bookings online and keep the calendar organized.",
    question: "Is this made for small businesses?",
  },
  {
    answer:
      "You mainly need three things: your services, your prices, and your working hours. After that, you can share your booking page.",
    question: "What do I need to set up first?",
  },
  {
    answer:
      "Yes. Customers book through your public booking page, and you can review new bookings inside the dashboard.",
    question: "Can customers book online by themselves?",
  },
  {
    answer:
      "No. Customers only see the times that are actually available based on your hours, days off, and existing bookings.",
    question: "Will it prevent double bookings?",
  },
] as const;

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
      <SiteHeader ctaLabel="Create workspace" />

      <section className="py-12 lg:py-16" id="features">
        <div className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr] lg:items-start">
          <Reveal className="space-y-8">
            <div className="space-y-5">
              <p className="editorial-kicker">Simple online booking for service businesses</p>
              <h1 className="text-balance max-w-4xl text-5xl leading-[1.02] font-semibold md:text-6xl lg:text-[4.6rem]">
                Let customers book online while you keep your hours and calendar under control.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--color-muted)] md:text-xl">
                ClientFlow helps small business owners take bookings online without
                dealing with a complicated system. Set your services, choose your hours,
                and share one booking page with customers.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/auth/sign-up">
                <Button size="lg">
                  Create workspace
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/book/clientflow-demo">
                <Button size="lg" variant="secondary">
                  See booking page
                </Button>
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "Easy to start",
                "Clear booking page",
                "Simple daily calendar",
              ].map((item) => (
                <div
                  className="rounded-[26px] border border-[color:var(--color-border)] bg-white/72 p-5 shadow-[var(--shadow-soft)]"
                  key={item}
                >
                  <p className="text-base font-semibold text-[var(--color-brand-strong)]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Card className="space-y-6 p-7 lg:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <ClientFlowLogo size={72} />
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    Built to be clear from the first day.
                  </p>
                </div>
                <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[var(--background-soft)]/70 px-4 py-3 text-sm font-semibold text-[var(--color-brand-strong)]">
                  Private beta
                </div>
              </div>

              <div className="rounded-[24px] border border-[color:var(--color-border)] bg-[var(--background-alt)]/40 p-6">
                <p className="editorial-kicker">How it works</p>
                <div className="mt-5 space-y-4">
                  {startSteps.map((step) => (
                    <div
                      className="rounded-[20px] border border-[color:var(--color-border)] bg-white p-4"
                      key={step.title}
                    >
                      <p className="font-semibold text-[var(--color-brand-strong)]">
                        {step.title}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-[color:var(--color-border)] bg-[var(--background-soft)]/55 p-6">
                <p className="editorial-kicker">Why owners like it</p>
                <div className="mt-4 grid gap-3">
                  {reassurancePoints.map((item) => (
                    <div className="flex items-start gap-3" key={item}>
                      <CheckCircle2 className="mt-1 size-4 text-[var(--color-brand)]" />
                      <p className="text-sm leading-7 text-[var(--color-muted)]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      <section className="py-12 lg:py-18">
        <div className="grid gap-6 lg:grid-cols-[0.8fr,1.2fr]">
          <Reveal className="space-y-4">
            <p className="editorial-kicker">What you need</p>
            <h2 className="text-balance text-4xl leading-tight font-semibold md:text-5xl">
              The core of the app is simple.
            </h2>
            <p className="max-w-xl text-lg leading-8 text-[var(--color-muted)]">
              If you are not technical, that is the point. The app is built around the
              few things most owners actually need every week.
            </p>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-1 xl:grid-cols-3">
            {simpleBenefits.map(({ description, icon: Icon, title }, index) => (
              <Reveal delay={index * 80} key={title}>
                <Card className="h-full p-6">
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
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-18" id="how-it-works">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[0.92fr,1.08fr]">
            <Card className="space-y-5 p-8 md:p-10">
              <p className="editorial-kicker">Made for busy owners</p>
              <CardTitle className="text-4xl">
                Less time answering booking calls. More time doing the work.
              </CardTitle>
              <CardDescription className="max-w-2xl text-base leading-8">
                The booking page stays available online, so customers can book even when
                you are with another client or away from the phone.
              </CardDescription>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Customers can book online 24/7",
                  "Your hours stay under your control",
                  "The booking page is easy to share",
                  "The calendar is easy to review",
                ].map((item) => (
                  <div
                    className="rounded-[22px] border border-[color:var(--color-border)] bg-white p-4 text-sm font-medium text-[var(--color-ink)]"
                    key={item}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="space-y-5 p-8 md:p-10">
              <div className="space-y-5">
                <p className="editorial-kicker">Why it feels safe to use</p>
                <h2 className="text-balance text-4xl leading-tight font-semibold md:text-5xl">
                  Simple on the surface, reliable underneath.
                </h2>
                <div className="space-y-4">
                  {[
                    "Only available booking times are shown to customers.",
                    "Double bookings are blocked in the database.",
                    "You can confirm or cancel bookings clearly from the calendar.",
                    "Your booking page and dashboard work well on both desktop and mobile.",
                  ].map((item) => (
                    <div
                      className="flex items-start gap-3 rounded-[22px] border border-[color:var(--color-border)] bg-white/80 p-4"
                      key={item}
                    >
                      <ShieldCheck className="mt-0.5 size-5 text-[var(--color-brand)]" />
                      <p className="text-sm leading-7 text-[var(--color-muted)]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </Reveal>
      </section>

      <section className="py-12 lg:py-18" id="faq">
        <div className="grid gap-8 lg:grid-cols-[0.8fr,1.2fr]">
          <Reveal className="space-y-5">
            <p className="editorial-kicker">FAQ</p>
            <h2 className="text-balance text-4xl leading-tight font-semibold md:text-5xl">
              Clear answers before you start.
            </h2>
            <p className="max-w-xl text-lg leading-8 text-[var(--color-muted)]">
              If you are looking for a simple booking system, these are usually the first questions.
            </p>
          </Reveal>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <Reveal delay={index * 70} key={item.question}>
                <details className="group rounded-[28px] border border-[color:var(--color-border)] bg-white/82 p-6 shadow-[var(--shadow-soft)]">
                  <summary className="cursor-pointer list-none text-xl font-semibold text-[var(--color-brand-strong)]">
                    {item.question}
                  </summary>
                  <p className="mt-4 max-w-3xl text-[15px] leading-8 text-[var(--color-muted)]">
                    {item.answer}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-18">
        <Reveal>
          <Card className="overflow-hidden p-8 md:p-12">
            <div className="relative grid gap-8 lg:grid-cols-[1fr,auto] lg:items-center">
              <div className="space-y-5">
                <p className="editorial-kicker">Get started</p>
                <h2 className="text-balance text-4xl leading-tight font-semibold md:text-5xl">
                  Start simple: add your services, set your hours, and share your booking page.
                </h2>
                <p className="max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
                  ClientFlow is best when it stays easy to understand. That is the direction of the product.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/auth/sign-up">
                  <Button size="lg">Create workspace</Button>
                </Link>
                <Link href="/book/clientflow-demo">
                  <Button size="lg" variant="secondary">
                    Preview booking page
                    <ExternalLink className="size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </Reveal>
      </section>

      <SiteFooter />
    </main>
  );
}
