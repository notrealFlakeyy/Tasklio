import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  action?: ReactNode;
  description: ReactNode;
  title: ReactNode;
};

export function EmptyState({
  action,
  className,
  description,
  title,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-[30px] border border-dashed border-[color:var(--color-border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.74),rgba(255,255,255,0.6))] px-6 py-8 text-center shadow-[0_18px_38px_rgba(68,55,48,0.05)]",
        className,
      )}
      {...props}
    >
      <div className="mx-auto max-w-xl">
        <p className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">{title}</p>
        <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{description}</p>
        {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}
