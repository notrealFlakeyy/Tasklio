import Link from "next/link";

import { ClientFlowLogo } from "@/components/clientflow-logo";

type SiteFooterProps = {
  anchorPrefix?: string;
  previewHref?: string;
};

export function SiteFooter({
  anchorPrefix = "",
  previewHref = "/book/clientflow-demo",
}: SiteFooterProps) {
  return (
    <footer className="border-t border-[color:rgba(68,55,48,0.08)] pt-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-4">
          <ClientFlowLogo size={64} withWordmark />
          <p className="max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
            ClientFlow helps service businesses take bookings online, manage working
            hours, and keep the calendar easy to follow.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-[var(--color-brand-strong)]">Product</p>
            <div className="mt-3 grid gap-2 text-sm text-[var(--color-muted)]">
              <Link href={`${anchorPrefix}#features`}>Features</Link>
              <Link href={`${anchorPrefix}#how-it-works`}>How it works</Link>
              <Link href={`${anchorPrefix}#faq`}>FAQ</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--color-brand-strong)]">Get started</p>
            <div className="mt-3 grid gap-2 text-sm text-[var(--color-muted)]">
              <Link href="/auth/sign-up">Create workspace</Link>
              <Link href="/auth/sign-in">Sign in</Link>
              <Link href={previewHref}>Preview booking page</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[color:rgba(68,55,48,0.08)] pt-5 text-sm text-[var(--color-muted)]">
        <p>ClientFlow private beta</p>
        <p>Simple online booking for small service businesses.</p>
      </div>
    </footer>
  );
}
