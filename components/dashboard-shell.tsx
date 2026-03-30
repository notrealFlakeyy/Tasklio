"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, ExternalLink, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DASHBOARD_NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/modules/auth/actions";

type DashboardShellProps = {
  children: React.ReactNode;
  organizationName: string;
  organizationSlug: string;
};

export function DashboardShell({
  children,
  organizationName,
  organizationSlug,
}: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[260px,1fr] lg:px-10">
      <aside className="rounded-[32px] border border-[color:var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
            <Calendar className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--color-ink)]">
              {organizationName}
            </p>
            <p className="text-xs text-[var(--color-muted)]">Owner dashboard</p>
          </div>
        </div>

        <nav className="space-y-2">
          {DASHBOARD_NAV_ITEMS.map((item) => (
            <Link
              className={cn(
                "block rounded-2xl px-4 py-3 text-sm font-medium transition",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-[var(--color-brand)] text-white"
                  : "text-[var(--color-muted)] hover:bg-white hover:text-[var(--color-ink)]",
              )}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 space-y-3">
          <Link
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-brand)]"
            href={`/book/${organizationSlug}`}
            target="_blank"
          >
            Open public booking page
            <ExternalLink className="size-4" />
          </Link>
          <form action={signOutAction}>
            <Button className="w-full justify-center" type="submit" variant="secondary">
              <LogOut className="mr-2 size-4" />
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      <main className="space-y-6">{children}</main>
    </div>
  );
}
