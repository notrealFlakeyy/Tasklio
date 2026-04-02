import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { ClientFlowLogo } from "@/components/clientflow-logo";
import { AuthSignUpForm } from "@/components/forms/auth-sign-up-form";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";

export default function SignUpPage() {
  const defaultTimezone = process.env.DEFAULT_BUSINESS_TIMEZONE ?? "Europe/Helsinki";

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10">
      <div className="grid w-full gap-6 lg:grid-cols-[0.88fr,1.12fr]">
        <SpotlightPanel className="p-8 md:p-10">
          <div className="space-y-5">
            <Link href="/">
              <ClientFlowLogo size={88} withWordmark />
            </Link>
            <p className="editorial-kicker">Create the first workspace</p>
            <h1 className="text-balance text-4xl leading-tight font-semibold md:text-5xl">
              Get your booking page ready in a few simple steps.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-[var(--color-muted)]">
              Start with the basics: your business name, your email, and a password.
              We can create the booking page link for you automatically.
            </p>
            <div className="grid gap-3">
              {[
                "Add your services and prices",
                "Set your working hours",
                "Share your booking page when you are ready",
              ].map((item) => (
                <div
                  className="flex items-start gap-3 rounded-[22px] border border-[color:var(--color-border)] bg-white/78 p-4"
                  key={item}
                >
                  <CheckCircle2 className="mt-0.5 size-4 text-[var(--color-brand)]" />
                  <p className="text-sm leading-7 text-[var(--color-muted)]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </SpotlightPanel>

        <Card className="w-full space-y-6 p-8 md:p-10">
          <div className="space-y-2">
            <CardTitle className="text-3xl">Create ClientFlow workspace</CardTitle>
            <CardDescription>
              Fill in the basics below. You can change the rest later.
            </CardDescription>
          </div>
          <AuthSignUpForm defaultTimezone={defaultTimezone} />
        </Card>
      </div>
    </main>
  );
}
