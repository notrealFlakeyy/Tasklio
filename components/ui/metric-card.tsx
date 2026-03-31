import type { HTMLAttributes, ReactNode } from "react";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricCardProps = HTMLAttributes<HTMLDivElement> & {
  description: ReactNode;
  label: ReactNode;
  value: ReactNode;
};

export function MetricCard({
  className,
  description,
  label,
  value,
  ...props
}: MetricCardProps) {
  return (
    <Card className={cn("bg-white/74", className)} {...props}>
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
        {label}
      </p>
      <CardTitle className="mt-3 text-3xl">{value}</CardTitle>
      <CardDescription className="mt-2">{description}</CardDescription>
    </Card>
  );
}
