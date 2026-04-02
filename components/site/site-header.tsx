import Link from "next/link";

import { ClientFlowLogo } from "@/components/clientflow-logo";
import { Button } from "@/components/ui/button";

type SiteHeaderProps = {
  ctaHref?: string;
  ctaLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function SiteHeader({
  ctaHref = "/auth/sign-up",
  ctaLabel = "Create workspace",
  secondaryHref = "/auth/sign-in",
  secondaryLabel = "Sign in",
}: SiteHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[color:rgba(68,55,48,0.08)] pb-6">
      <Link className="shrink-0" href="/">
        <ClientFlowLogo size={96} withWordmark />
      </Link>

      <nav className="hidden items-center gap-6 lg:flex">
        <a className="text-sm font-medium text-[var(--color-muted)] transition hover:text-[var(--color-ink)]" href="#features">
          Features
        </a>
        <a className="text-sm font-medium text-[var(--color-muted)] transition hover:text-[var(--color-ink)]" href="#how-it-works">
          How it works
        </a>
        <a className="text-sm font-medium text-[var(--color-muted)] transition hover:text-[var(--color-ink)]" href="#faq">
          FAQ
        </a>
      </nav>

      <div className="flex flex-wrap items-center gap-3">
        <Link href={secondaryHref}>
          <Button variant="ghost">{secondaryLabel}</Button>
        </Link>
        <Link href={ctaHref}>
          <Button>{ctaLabel}</Button>
        </Link>
      </div>
    </header>
  );
}
