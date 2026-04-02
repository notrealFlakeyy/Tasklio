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
            <ClientFlowLogo imageClassName="border border-[color:var(--color-border)] bg-white/84 p-2 shadow-[var(--shadow-soft)]" />
            <p className="editorial-kicker">Owner access</p>
            <h1 className="text-balance text-4xl leading-tight font-semibold md:text-5xl">
              Sign back into ClientFlow and step into bookings, clients, and the day.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-[var(--color-muted)]">
              Auth stays SSR-safe and protected, while the interface keeps the entry
              experience warm and editorial instead of flat and mechanical.
            </p>
          </div>
        </SpotlightPanel>

        <Card className="w-full space-y-6 p-8 md:p-10">
          <div className="space-y-2">
            <ClientFlowLogo className="mb-3" imageClassName="border border-[color:var(--color-border)] bg-white/84 p-2" size={44} />
            <CardTitle className="text-3xl">Sign in</CardTitle>
            <CardDescription>
              ClientFlow is protected by Supabase SSR cookies and the route proxy layer.
            </CardDescription>
          </div>
          <AuthSignInForm next={next} />
        </Card>
      </div>
    </main>
  );
}
