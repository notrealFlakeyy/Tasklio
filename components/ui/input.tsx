import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-[18px] border border-[color:var(--color-border)] bg-[rgba(255,255,255,0.82)] px-4 text-sm text-[var(--color-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] outline-none transition duration-300 placeholder:text-[var(--color-muted)] hover:border-[color:var(--color-border-strong)] focus:border-[var(--color-brand)] focus:bg-white focus:ring-2 focus:ring-[var(--color-ring)] aria-[invalid=true]:border-[var(--color-danger)] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[rgba(143,74,69,0.14)] disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
