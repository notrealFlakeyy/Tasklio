"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, ExternalLink, LogOut } from "lucide-react";

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

export function DashboardShell({
  children,
  organizationName,
  organizationSlug,
}: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="mx-auto grid min-h-screen max-w-[1520px] gap-6 px-4 py-4 md:px-6 lg:grid-cols-[300px,1fr] lg:px-8">
      <aside className="lg:sticky lg:top-4 lg:self-start">
        <SpotlightPanel className="overflow-hidden p-6">
          <div className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top_left,rgba(234,247,207,0.95),transparent_60%),radial-gradient(circle_at_top_right,rgba(230,253,255,0.9),transparent_54%)]" />
          <div className="relative">
            <div className="mb-8 flex items-start gap-4">
              <div className="flex size-14 items-center justify-center rounded-[22px] border border-[color:var(--color-border)] bg-white/84 text-[var(--color-brand)] shadow-[var(--shadow-soft)]">
                <Calendar className="size-6" />
              </div>
              <div>
                <p className="text-lg font-semibold text-[var(--color-brand-strong)]">
                  {organizationName}
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                  A living workspace for scheduling, customers, and revenue context.
                </p>
              </div>
            </div>

            <nav className="space-y-2">
              {DASHBOARD_NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    className={cn(
                      "block rounded-[20px] border px-4 py-3.5 text-sm font-medium transition duration-300",
                      isActive
                        ? "border-[color:rgba(68,55,48,0.15)] bg-[var(--color-brand-strong)] text-white shadow-[0_18px_40px_rgba(68,55,48,0.16)]"
                        : "border-transparent text-[var(--color-muted)] hover:border-[color:var(--color-border)] hover:bg-white/80 hover:text-[var(--color-ink)]",
                    )}
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 rounded-[24px] border border-[color:var(--color-border)] bg-white/78 p-4">
              <p className="text-sm font-semibold text-[var(--color-brand-strong)]">
                Public experience
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                Open the booking page in a new tab to review the premium public-facing flow.
              </p>
              <Link
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand)]"
                href={`/book/${organizationSlug}`}
                target="_blank"
              >
                Open public booking page
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
      </aside>

      <main className="space-y-6">{children}</main>
    </div>
  );
}
