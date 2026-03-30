import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border border-[color:var(--color-border)] bg-white px-4 text-sm text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-ring)]",
        className,
      )}
      {...props}
    />
  );
}
