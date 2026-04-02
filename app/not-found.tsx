import Link from "next/link";

import { ClientFlowLogo } from "@/components/clientflow-logo";
import { Button } from "@/components/ui/button";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-10">
      <SpotlightPanel className="w-full p-8 md:p-12">
        <div className="space-y-6">
          <ClientFlowLogo size={96} withWordmark />
          <p className="editorial-kicker">Page not found</p>
          <h1 className="text-balance text-4xl leading-tight font-semibold md:text-5xl">
            This page stepped out of the booking flow.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
            The link may be outdated, the page may have moved, or the business has not
            published this route yet. You can head back to the main site or jump into the
            auth flow from here.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/">
              <Button>Back to home</Button>
            </Link>
            <Link href="/auth/sign-in">
              <Button variant="secondary">Sign in</Button>
            </Link>
          </div>
        </div>
      </SpotlightPanel>
    </main>
  );
}
