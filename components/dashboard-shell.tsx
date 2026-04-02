"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLink, LogOut, Menu, X } from "lucide-react";

import { ClientFlowLogo } from "@/components/clientflow-logo";
import { Button } from "@/components/ui/button";
import { DASHBOARD_NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/modules/auth/actions";

type DashboardShellProps = {
  children: React.ReactNode;
  organizationName: string;
  organizationSlug: string;
};

type NavigationLinksProps = {
  pathname: string;
  onNavigate?: () => void;
};

function NavigationLinks({ pathname, onNavigate }: NavigationLinksProps) {
  return (
    <>
      {DASHBOARD_NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center rounded-[16px] border px-4 py-2.5 text-sm font-medium transition duration-300",
              isActive
                ? "border-[color:rgba(68,55,48,0.12)] bg-[var(--color-brand-strong)] text-white shadow-[0_16px_35px_rgba(68,55,48,0.14)]"
                : "border-transparent bg-white/52 text-[var(--color-muted)] hover:border-[color:var(--color-border)] hover:bg-white hover:text-[var(--color-ink)]",
            )}
            href={item.href}
            key={item.href}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

type MobileNavigationPanelProps = {
  organizationName: string;
  organizationSlug: string;
  pathname: string;
  onClose: () => void;
};

function MobileNavigationPanel({
  organizationName,
  organizationSlug,
  pathname,
  onClose,
}: MobileNavigationPanelProps) {
  return (
    <div className="rounded-[28px] border border-[color:var(--color-border)] bg-white p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <ClientFlowLogo size={72} />
          <div className="mt-3 min-w-0">
            <p className="truncate text-base font-semibold text-[var(--color-brand-strong)]">
              {organizationName}
            </p>
            <p className="mt-1 text-sm text-[var(--color-muted)]">Simple booking dashboard</p>
          </div>
          <p className="mt-4 max-w-[26ch] text-sm leading-6 text-[var(--color-muted)]">
            Keep your services, working hours, and appointments easy to manage.
          </p>
        </div>
        <Button
          aria-label="Close dashboard navigation"
          onClick={onClose}
          size="sm"
          variant="ghost"
        >
          <X className="size-4" />
        </Button>
      </div>

      <nav className="mt-6 grid gap-2">
        <NavigationLinks onNavigate={onClose} pathname={pathname} />
      </nav>

      <div className="mt-6 rounded-[22px] border border-[color:var(--color-border)] bg-[var(--background-soft)]/45 p-4">
        <p className="text-sm font-semibold text-[var(--color-brand-strong)]">
          Booking page
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
          Open the page people will use to make bookings.
        </p>
        <Link
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand)]"
          href={`/book/${organizationSlug}`}
          onClick={onClose}
          target="_blank"
        >
          Open booking page
          <ExternalLink className="size-4" />
        </Link>
      </div>

      <form action={signOutAction} className="mt-4">
        <Button className="w-full justify-center" type="submit" variant="secondary">
          <LogOut className="size-4" />
          Sign out
        </Button>
      </form>
    </div>
  );
}

export function DashboardShell({
  children,
  organizationName,
  organizationSlug,
}: DashboardShellProps) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!isMobileNavOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileNavOpen]);

  return (
    <div className="mx-auto min-h-screen max-w-[1600px] px-4 py-4 md:px-6 lg:px-8">
      <div className="rounded-[30px] border border-[color:var(--color-border)] bg-white px-4 py-4 shadow-[var(--shadow-soft)] md:px-5 lg:px-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <ClientFlowLogo size={72} />
              <div className="mt-3 min-w-0">
                <p className="truncate text-base font-semibold text-[var(--color-brand-strong)] md:text-lg">
                  {organizationName}
                </p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">Simple booking dashboard</p>
              </div>
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <Link
                className="inline-flex h-12 items-center gap-2 rounded-[18px] border border-[color:var(--color-border)] bg-[var(--background-soft)]/35 px-4 text-sm font-semibold text-[var(--color-ink)] transition duration-300 hover:border-[color:var(--color-border-strong)] hover:bg-white"
                href={`/book/${organizationSlug}`}
                target="_blank"
              >
                Public booking page
                <ExternalLink className="size-4" />
              </Link>
              <form action={signOutAction}>
                <Button type="submit" variant="secondary">
                  <LogOut className="size-4" />
                  Sign out
                </Button>
              </form>
            </div>

            <div className="lg:hidden">
              <Button
                aria-expanded={isMobileNavOpen}
                aria-label="Open dashboard navigation"
                onClick={() => setIsMobileNavOpen(true)}
                variant="secondary"
              >
                <Menu className="size-4" />
                Menu
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm leading-6 text-[var(--color-muted)] md:text-[15px]">
                Keep things simple: set your services, choose your working hours, and
                review bookings in one calm place.
              </p>
            </div>

            <nav className="-mx-1 hidden flex-wrap items-center gap-2 overflow-x-auto px-1 pb-1 lg:flex">
              <NavigationLinks pathname={pathname} />
            </nav>
          </div>
        </div>
      </div>

      {isMobileNavOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-[rgba(68,55,48,0.22)] backdrop-blur-[3px]"
            onClick={() => setIsMobileNavOpen(false)}
            type="button"
          />
          <div className="absolute inset-y-3 left-3 w-[min(340px,calc(100vw-24px))] overflow-y-auto">
            <MobileNavigationPanel
              onClose={() => setIsMobileNavOpen(false)}
              organizationName={organizationName}
              organizationSlug={organizationSlug}
              pathname={pathname}
            />
          </div>
        </div>
      ) : null}

      <main className="mt-6 min-w-0 space-y-6">{children}</main>
    </div>
  );
}
