import { AuthSignUpForm } from "@/components/forms/auth-sign-up-form";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function SignUpPage() {
  const defaultTimezone = process.env.DEFAULT_BUSINESS_TIMEZONE ?? "Europe/Helsinki";

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-10">
      <Card className="w-full space-y-6 p-8">
        <div className="space-y-2">
          <CardTitle className="text-3xl">Create the first owner account</CardTitle>
          <CardDescription>
            The MVP is single-tenant per account, but the data model already uses
            organizations and memberships so you can grow into teams later.
          </CardDescription>
        </div>
        <AuthSignUpForm defaultTimezone={defaultTimezone} />
      </Card>
    </main>
  );
}
