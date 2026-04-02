import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { ClientFlowLogo } from "@/components/clientflow-logo";
import { AuthSignInForm } from "@/components/forms/auth-sign-in-form";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10">
      <div className="grid w-full gap-6 lg:grid-cols-[0.95fr,1.05fr]">
        <SpotlightPanel className="p-8 md:p-10">
          <div className="space-y-5">
            <Link href="/">
              <ClientFlowLogo size={88} withWordmark />
            </Link>
            <p className="editorial-kicker">Owner access</p>
            <h1 className="text-balance text-4xl leading-tight font-semibold md:text-5xl">
              Sign in and open your booking dashboard.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-[var(--color-muted)]">
              Keep your services, working hours, and bookings in one simple place.
            </p>
            <div className="grid gap-3">
              {[
                "Check new bookings quickly",
                "Update services and prices",
                "Change your working hours when needed",
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
            <CardTitle className="text-3xl">Sign in</CardTitle>
            <CardDescription>
              Enter your details to open your workspace.
            </CardDescription>
          </div>
          <AuthSignInForm next={next} />
        </Card>
      </div>
    </main>
  );
}
