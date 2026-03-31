import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "hover-lift rounded-[30px] border border-[color:var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.76))] p-6 shadow-[var(--shadow-soft)] backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-xl font-semibold tracking-tight text-[var(--color-ink)] md:text-[1.35rem]",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm leading-7 text-[var(--color-muted)]", className)}
      {...props}
    />
  );
}
