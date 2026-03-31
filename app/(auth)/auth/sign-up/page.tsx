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
            <p className="editorial-kicker">Create the first workspace</p>
            <h1 className="text-balance text-4xl leading-tight font-semibold md:text-5xl">
              Launch with a front door that feels inviting and an operating layer that feels composed.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-[var(--color-muted)]">
              The architecture starts single-tenant for speed, but the model is
              already prepared for teams, billing, resources, and deeper client management.
            </p>
          </div>
        </SpotlightPanel>

        <Card className="w-full space-y-6 p-8 md:p-10">
          <div className="space-y-2">
            <CardTitle className="text-3xl">Create owner account</CardTitle>
            <CardDescription>
              Set up the business, public URL, and timezone in one calm flow.
            </CardDescription>
          </div>
          <AuthSignUpForm defaultTimezone={defaultTimezone} />
        </Card>
      </div>
    </main>
  );
}
