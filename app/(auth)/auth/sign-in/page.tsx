import { AuthSignInForm } from "@/components/forms/auth-sign-in-form";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-6 py-10">
      <Card className="w-full space-y-6 p-8">
        <div className="space-y-2">
          <CardTitle className="text-3xl">Sign in to the owner dashboard</CardTitle>
          <CardDescription>
            Auth uses Supabase SSR cookies and the Next.js proxy boundary for route
            protection.
          </CardDescription>
        </div>
        <AuthSignInForm next={next} />
      </Card>
    </main>
  );
}
