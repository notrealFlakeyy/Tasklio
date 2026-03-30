import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-brand)] px-5 py-2.5 text-white shadow-lg shadow-[var(--color-brand-soft)] hover:bg-[var(--color-brand-strong)]",
        secondary:
          "border border-[color:var(--color-border)] bg-white/80 px-5 py-2.5 text-[var(--color-ink)] hover:bg-white",
        ghost:
          "px-3 py-2 text-[var(--color-muted)] hover:bg-white/70 hover:text-[var(--color-ink)]",
        danger:
          "bg-[var(--color-danger)] px-5 py-2.5 text-white hover:opacity-90",
      },
      size: {
        default: "h-11",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({
  className,
  size,
  variant,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ className, size, variant }))}
      type={type}
      {...props}
    />
  );
}
