import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, FlaskConical } from "lucide-react";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ChecklistItem = {
  description: string;
  done: boolean;
  href?: string;
  label: string;
  title: string;
};

type BetaLaunchChecklistProps = {
  items: ChecklistItem[];
};

export function BetaLaunchChecklist({ items }: BetaLaunchChecklistProps) {
  const completed = items.filter((item) => item.done).length;

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-[16px] border border-[color:var(--color-border)] bg-white/84 text-[var(--color-brand)] shadow-[var(--shadow-soft)]">
              <FlaskConical className="size-5" />
            </div>
            <div>
              <CardTitle>Private beta checklist</CardTitle>
              <CardDescription className="mt-1">
                A short launch list for getting ClientFlow into testers’ hands cleanly.
              </CardDescription>
            </div>
          </div>
        </div>
        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-brand-strong)]">
          {completed}/{items.length} complete
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div
            className={cn(
              "rounded-[22px] border p-4 transition",
              item.done
                ? "border-emerald-200 bg-emerald-50/85"
                : "border-[color:var(--color-border)] bg-white",
            )}
            key={item.title}
          >
            <div className="flex items-start gap-3">
              <div className="pt-0.5">
                {item.done ? (
                  <CheckCircle2 className="size-5 text-emerald-700" />
                ) : (
                  <Circle className="size-5 text-[var(--color-muted)]" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--color-brand-strong)]">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  {item.description}
                </p>
                {item.href ? (
                  <Link
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand)]"
                    href={item.href}
                  >
                    {item.label}
                    <ArrowRight className="size-4" />
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
