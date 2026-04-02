"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLink, LogOut, Menu, X } from "lucide-react";

import { ClientFlowLogo } from "@/components/clientflow-logo";
import { Button } from "@/components/ui/button";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
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
    <SpotlightPanel className="overflow-hidden p-5">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-18%] top-[-22%] h-44 w-56 rounded-full bg-[rgba(234,247,207,0.9)] blur-3xl" />
        <div className="absolute right-[-16%] top-[-26%] h-48 w-64 rounded-full bg-[rgba(230,253,255,0.82)] blur-3xl" />
      </div>
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <ClientFlowLogo size={72} />
            <div className="mt-3 min-w-0">
              <p className="truncate text-base font-semibold text-[var(--color-brand-strong)]">
                {organizationName}
              </p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">Dashboard</p>
            </div>
            <p className="mt-4 max-w-[26ch] text-sm leading-6 text-[var(--color-muted)]">
              Keep appointments, client history, and service operations in one place.
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

        <div className="mt-6 rounded-[22px] border border-[color:var(--color-border)] bg-white/78 p-4">
          <p className="text-sm font-semibold text-[var(--color-brand-strong)]">
            Public experience
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
            Review the branded booking journey in a separate tab.
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
    </SpotlightPanel>
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
      <SpotlightPanel className="overflow-hidden px-4 py-4 md:px-5 lg:px-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-8%] top-[-46%] h-48 w-80 rounded-full bg-[rgba(234,247,207,0.88)] blur-3xl" />
          <div className="absolute right-[-8%] top-[-52%] h-52 w-96 rounded-full bg-[rgba(230,253,255,0.78)] blur-3xl" />
          <div className="absolute left-[28%] top-[-72%] h-40 w-72 rounded-full bg-[rgba(255,255,255,0.5)] blur-[72px]" />
        </div>
        <div className="relative flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <ClientFlowLogo size={72} />
              <div className="mt-3 min-w-0">
                <p className="truncate text-base font-semibold text-[var(--color-brand-strong)] md:text-lg">
                  {organizationName}
                </p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">Dashboard</p>
              </div>
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <Link
                className="inline-flex h-12 items-center gap-2 rounded-[18px] border border-[color:var(--color-border)] bg-white/80 px-4 text-sm font-semibold text-[var(--color-ink)] shadow-[0_12px_30px_rgba(68,55,48,0.07)] transition duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-border-strong)] hover:bg-white"
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
                Manage bookings, customers, availability, and revenue without the
                navigation taking over the workspace.
              </p>
            </div>

            <nav className="-mx-1 hidden flex-wrap items-center gap-2 overflow-x-auto px-1 pb-1 lg:flex">
              <NavigationLinks pathname={pathname} />
            </nav>
          </div>
        </div>
      </SpotlightPanel>

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
