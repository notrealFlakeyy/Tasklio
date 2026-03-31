import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-12 w-full rounded-[18px] border border-[color:var(--color-border)] bg-[rgba(255,255,255,0.78)] px-4 text-sm text-[var(--color-ink)] outline-none transition duration-300 focus:border-[var(--color-brand)] focus:bg-white focus:ring-2 focus:ring-[var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
